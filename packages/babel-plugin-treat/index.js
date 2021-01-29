const { dirname, basename } = require('path');

const treatExports = ['style', 'styleMap', 'css', 'createTheme'];

const extractName = (t, parent, fileIdentifier) => {
  if (t.isObjectProperty(parent) && t.isIdentifier(parent.key)) {
    return parent.key.name;
  } else if (
    t.isVariableDeclarator(parent) ||
    t.isFunctionDeclaration(parent)
  ) {
    return parent.id.name;
  } else if (t.isExportDefaultDeclaration(parent)) {
    return fileIdentifier;
  }
};

const getDebugIdent = (t, path, fileIdentifier) => {
  const { parent } = path;

  if (
    t.isObjectProperty(parent) ||
    t.isReturnStatement(parent) ||
    t.isArrayExpression(parent) ||
    t.isSpreadElement(parent)
  ) {
    const names = [];

    path.findParent(({ node: parentNode }) => {
      const name = extractName(t, parentNode, fileIdentifier);
      if (name) {
        names.unshift(name);
      }
    });

    return names.join('_');
  } else {
    return extractName(t, parent, fileIdentifier);
  }
};

const isTreatCall = (t, node, namespaceImport, treatIdentifiers) => {
  if (namespaceImport && t.isMemberExpression(node)) {
    return (
      t.isIdentifier(node.object, { name: namespaceImport }) &&
      treatExports.some((exportName) =>
        t.isIdentifier(node.property, { name: exportName }),
      )
    );
  } else {
    return treatIdentifiers.some((identifier) =>
      t.isIdentifier(node, { name: identifier }),
    );
  }
};

module.exports = function ({ types: t }) {
  return {
    pre(state) {
      const { filename } = state.opts;
      const shortFilename = basename(filename).split('.')[0];

      this.fileIdentifier =
        shortFilename.indexOf('index') > -1
          ? basename(dirname(filename))
          : shortFilename;

      this.treatIdentifiers = [];
      this.namespaceImport = '';
    },
    visitor: {
      ImportDeclaration(path, { opts }) {
        const treatImportIdentifier = opts.alias || 'treat';

        if (path.node.source.value === treatImportIdentifier) {
          path.node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportNamespaceSpecifier') {
              this.namespaceImport = specifier.local.name;
            } else {
              const { imported, local } = specifier;

              if (treatExports.includes(imported.name)) {
                this.treatIdentifiers.push(local.name);
              }
            }
          });
        }
      },
      CallExpression(path) {
        const { callee } = path.node;
        if (
          isTreatCall(t, callee, this.namespaceImport, this.treatIdentifiers)
        ) {
          const { node } = path;

          if (node.arguments.length === 1) {
            const debugIdent = getDebugIdent(t, path, this.fileIdentifier);

            if (debugIdent) {
              node.arguments.push(t.stringLiteral(debugIdent));
            }
          }
        }
      },
    },
  };
};

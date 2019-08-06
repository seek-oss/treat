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

module.exports = function({ types: t }) {
  return {
    pre(state) {
      const { filename } = state.opts;
      const shortFilename = basename(filename).split('.')[0];

      this.fileIdentifier =
        shortFilename.indexOf('index') > -1
          ? basename(dirname(filename))
          : shortFilename;

      this.treatIdentifiers = [];
    },
    visitor: {
      ImportDeclaration(path, { opts }) {
        const treatImportIdentifier = opts.alias || 'treat';

        if (path.node.source.value === treatImportIdentifier) {
          path.node.specifiers.forEach(({ imported, local }) => {
            if (treatExports.includes(imported.name)) {
              this.treatIdentifiers.push(local.name);
            }
          });
        }
      },
      CallExpression(path) {
        const { callee } = path.node;
        if (
          this.treatIdentifiers.some(identifier =>
            t.isIdentifier(callee, { name: identifier }),
          )
        ) {
          const { parent, node } = path;

          if (node.arguments.length === 1) {
            let debugIdent;

            if (t.isObjectProperty(parent) || t.isReturnStatement(parent)) {
              const names = [];

              path.findParent(({ node: parentNode }) => {
                const name = extractName(t, parentNode);
                if (name) {
                  names.unshift(name);
                }
              });

              debugIdent = names.join('_');
            } else {
              debugIdent = extractName(t, parent, this.fileIdentifier);
            }

            if (debugIdent) {
              node.arguments.push(t.stringLiteral(debugIdent));
            }
          }
        }
      },
    },
  };
};

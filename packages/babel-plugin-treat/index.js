const { dirname, basename } = require('path');

const treatExports = ['style', 'styleMap', 'css', 'createTheme'];

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

            if (t.isObjectProperty(parent) && t.isIdentifier(parent.key)) {
              debugIdent = parent.key.name;
            } else if (t.isVariableDeclarator(parent)) {
              debugIdent = parent.id.name;
            } else if (t.isExportDefaultDeclaration(parent)) {
              debugIdent = this.fileIdentifier;
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

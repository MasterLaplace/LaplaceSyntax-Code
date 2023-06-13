const vscode = require('vscode');

class LaplaceQuickFixProvider {
    provideCodeActions(document, range, context, token) {
        const diagnostics = context.diagnostics || [];
        const fixes = [];

        for (const diagnostic of diagnostics) {
            if (diagnostic.code === 'invalidFunctionName') {
                const functionName = document.getText(range);
                const newFunctionName = functionName.replace(/[0-9]/g, '');

                const edit = new vscode.WorkspaceEdit();
                edit.replace(document.uri, range, newFunctionName);

                const fix = new vscode.CodeAction('Renommer la fonction', vscode.CodeActionKind.QuickFix);
                fix.edit = edit;
                fix.isPreferred = true;
                fix.diagnostics = [diagnostic];

                fixes.push(fix);
            }
        }

        return fixes;
    }
}

module.exports = LaplaceQuickFixProvider;

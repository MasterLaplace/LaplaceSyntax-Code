const vscode = require('vscode');

class DiagnosticsManager {
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('laplace-syntax');
    }

    createDiagnostic(range, message, code) {
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
        diagnostic.code = code;
        diagnostic.source = 'laplace-syntax';
        return diagnostic;
    }

    updateDiagnostics(document, diagnostics) {
        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    clearDiagnostics(document) {
        this.diagnosticCollection.delete(document.uri);
    }

    detectFunctionNameErrors(document) {
        const diagnostics = [];

        const regexFunctionName = /\b[A-Za-z_]+[0-9]+[A-Za-z_]*\b/g;
        const text = document.getText();
        let match;

        while ((match = regexFunctionName.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = this.createDiagnostic(
                range,
                'Erreur de nom de fonction : Les chiffres ne sont pas autorisés dans les noms de fonction.',
                'invalidFunctionName'
            );

            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }

    detectUninitializedGlobalVariables(document) {
        const diagnostics = [];

        const regexGlobalVariable = /\bglobal\s+[A-Za-z_]+\b(?!\s*=)/g;
        const text = document.getText();
        let match;

        while ((match = regexGlobalVariable.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = this.createDiagnostic(
                range,
                'Erreur de variable globale : La variable globale doit être initialisée avec une valeur.',
                'uninitializedGlobalVariable'
            );

            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}

exports.DiagnosticsManager = DiagnosticsManager;

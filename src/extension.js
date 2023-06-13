const vscode = require('vscode');
const { DiagnosticsManager } = require('./diagnosticsManager');
const { LaplaceQuickFixProvider } = require('./quickFixProvider');

function activate(context) {
    const diagnosticsManager = new DiagnosticsManager();

    // Inspecter les documents ouverts pour détecter les erreurs de noms de fonctions et de variables globales non initialisées
    vscode.workspace.onDidChangeTextDocument(event => {
        const document = event.document;

        // Vérifier le contenu du document pour détecter les erreurs de noms de fonctions
        const functionDiagnostics = diagnosticsManager.detectFunctionNameErrors(document);
        const globalVariableDiagnostics = diagnosticsManager.detectUninitializedGlobalVariables(document);

        const allDiagnostics = [...functionDiagnostics, ...globalVariableDiagnostics];
        diagnosticsManager.updateDiagnostics(document, allDiagnostics);
    });

    vscode.languages.registerCodeActionsProvider('laplace-syntax', new LaplaceQuickFixProvider());

    context.subscriptions.push(diagnosticsManager.diagnosticCollection);
}

exports.activate = activate;

import * as vscode from 'vscode';

export class EvaluateExpression {
  async execute(): Promise<void> {
    const session = vscode.debug.activeDebugSession;
    if (!session) {
      vscode.window.showWarningMessage(
        'pyCharisma: Nenhuma sessão de debug ativa.'
      );
      return;
    }

    const editor = vscode.window.activeTextEditor;
    const prefilledExpression = editor?.document.getText(editor.selection) ?? '';

    const expression = await vscode.window.showInputBox({
      title: 'pyCharisma — Avaliar Expressão',
      prompt: 'Digite uma expressão Python para avaliar no contexto atual',
      value: prefilledExpression,
      placeHolder: 'ex: len(minha_lista), objeto.__dict__',
    });

    if (!expression) return;

    try {
      const response = await session.customRequest('evaluate', {
        expression,
        context: 'repl',
      });

      vscode.window.showInformationMessage(
        `${expression} = ${response.result}`
      );
    } catch (err) {
      vscode.window.showErrorMessage(
        `pyCharisma: Erro ao avaliar expressão — ${err}`
      );
    }
  }
}

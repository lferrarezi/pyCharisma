import * as vscode from 'vscode';

export class RunToCursor {
  async execute(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    if (!vscode.debug.activeDebugSession) {
      vscode.window.showWarningMessage(
        'pyCharisma: Nenhuma sessão de debug ativa.'
      );
      return;
    }

    // VSCode expõe runToCursor via comando nativo do editor de debug
    await vscode.commands.executeCommand(
      'editor.debug.action.runToCursor'
    );
  }
}

import * as vscode from 'vscode';
import * as path from 'path';

export class QuickDebugger {
  async debugCurrentFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showWarningMessage('pyCharisma: Nenhum arquivo aberto.');
      return;
    }

    if (editor.document.languageId !== 'python') {
      vscode.window.showWarningMessage(
        'pyCharisma: Quick Debug só funciona com arquivos Python (.py).'
      );
      return;
    }

    const filePath = editor.document.fileName;
    const config = vscode.workspace.getConfiguration('pycharisma.quickDebug');

    const debugConfig: vscode.DebugConfiguration = {
      name: `pyCharisma: ${path.basename(filePath)}`,
      type: 'debugpy',
      request: 'launch',
      program: filePath,
      console: 'integratedTerminal',
      justMyCode: true,
      stopOnEntry: config.get<boolean>('stopOnEntry', false),
    };

    const pythonPath = config.get<string>('pythonPath', '');
    if (pythonPath) {
      debugConfig.python = pythonPath;
    }

    const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);

    const started = await vscode.debug.startDebugging(folder, debugConfig);

    if (!started) {
      vscode.window.showErrorMessage(
        'pyCharisma: Falha ao iniciar debug. Verifique se o debugpy está instalado: pip install debugpy'
      );
    }
  }
}

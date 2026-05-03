import * as vscode from 'vscode';
import { QuickDebugger } from './debugger/quickDebug';
import { PyCharismaInlineValuesProvider } from './providers/inlineValues';
import { RunToCursor } from './debugger/runToCursor';
import { EvaluateExpression } from './debugger/evaluateExpression';
import { StatusBarManager } from './ui/statusBar';
import { DebugBarProvider } from './ui/debugBar';

export function activate(context: vscode.ExtensionContext) {
  const quickDebugger = new QuickDebugger();
  const statusBar = new StatusBarManager();
  const runToCursor = new RunToCursor();
  const evaluator = new EvaluateExpression();
  const debugBar = new DebugBarProvider();

  // Inline values provider — ativa durante sessões de debug Python
  const inlineValuesProvider = new PyCharismaInlineValuesProvider();
  context.subscriptions.push(
    vscode.languages.registerInlineValuesProvider(
      { language: 'python' },
      inlineValuesProvider
    )
  );

  // Debug bar no painel inferior
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(DebugBarProvider.viewId, debugBar)
  );

  // Comandos
  context.subscriptions.push(
    vscode.commands.registerCommand('pycharisma.quickDebug', () =>
      quickDebugger.debugCurrentFile()
    ),

    vscode.commands.registerCommand('pycharisma.runToCursor', () =>
      runToCursor.execute()
    ),

    vscode.commands.registerCommand('pycharisma.evaluateExpression', () =>
      evaluator.execute()
    ),

    vscode.commands.registerCommand('pycharisma.toggleInlineValues', () => {
      inlineValuesProvider.toggle();
      debugBar.notifyInlineValuesToggled(inlineValuesProvider.isEnabled);
    }),

    vscode.commands.registerCommand('pycharisma.addToWatch', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const selection = editor.document.getText(editor.selection);
      if (selection) {
        vscode.commands.executeCommand('editor.debug.action.selectionToWatch');
      }
    }),

    vscode.commands.registerCommand('pycharisma.debugContinue', () =>
      vscode.commands.executeCommand('workbench.action.debug.continue')
    ),

    vscode.commands.registerCommand('pycharisma.debugStepOver', () =>
      vscode.commands.executeCommand('workbench.action.debug.stepOver')
    ),

    vscode.commands.registerCommand('pycharisma.debugStepInto', () =>
      vscode.commands.executeCommand('workbench.action.debug.stepInto')
    ),

    vscode.commands.registerCommand('pycharisma.debugStepOut', () =>
      vscode.commands.executeCommand('workbench.action.debug.stepOut')
    ),

    vscode.commands.registerCommand('pycharisma.debugStop', () =>
      vscode.commands.executeCommand('workbench.action.debug.stop')
    )
  );

  // Sincroniza status bar e debug bar com o ciclo da sessão de debug
  context.subscriptions.push(
    vscode.debug.onDidStartDebugSession(session => {
      if (session.type === 'debugpy') {
        statusBar.showDebugging();
        inlineValuesProvider.onSessionStart();
        debugBar.onSessionStart();
      }
    }),

    vscode.debug.onDidTerminateDebugSession(session => {
      if (session.type === 'debugpy') {
        statusBar.showIdle();
        inlineValuesProvider.onSessionEnd();
        debugBar.onSessionEnd();
      }
    })
  );

  statusBar.showIdle();
  context.subscriptions.push(statusBar);
}

export function deactivate() {}

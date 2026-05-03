import * as vscode from 'vscode';

export class StatusBarManager implements vscode.Disposable {
  private readonly _item: vscode.StatusBarItem;

  constructor() {
    this._item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this._item.command = 'pycharisma.quickDebug';
    this._item.show();
  }

  showIdle(): void {
    this._item.text = '$(debug-alt) pyCharisma';
    this._item.tooltip = 'pyCharisma: Debug Current File (Shift+F9)';
    this._item.backgroundColor = undefined;
  }

  showDebugging(): void {
    this._item.text = '$(debug-pause) pyCharisma — debugging';
    this._item.tooltip = 'pyCharisma: Sessão de debug ativa';
    this._item.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
  }

  dispose(): void {
    this._item.dispose();
  }
}

import * as vscode from 'vscode';

export class DebugBarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = 'pycharisma.debugBar';

  private _view?: vscode.WebviewView;
  private _sessionActive = false;
  private _inlineValuesEnabled: boolean;

  constructor() {
    const config = vscode.workspace.getConfiguration('pycharisma.inlineValues');
    this._inlineValuesEnabled = config.get<boolean>('enabled', true);
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._buildHtml();

    webviewView.webview.onDidReceiveMessage(msg => {
      if (msg.command) {
        vscode.commands.executeCommand(msg.command);
      }
    });

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this._postState();
      }
    });

    this._postState();
  }

  onSessionStart(): void {
    this._sessionActive = true;
    this._postState();
  }

  onSessionEnd(): void {
    this._sessionActive = false;
    this._postState();
  }

  notifyInlineValuesToggled(enabled: boolean): void {
    this._inlineValuesEnabled = enabled;
    this._postState();
  }

  private _postState(): void {
    this._view?.webview.postMessage({
      type: 'stateUpdate',
      sessionActive: this._sessionActive,
      inlineValuesEnabled: this._inlineValuesEnabled,
    });
  }

  private _buildHtml(): string {
    return /* html */`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--vscode-panel-background, #1e1e1e);
      color: var(--vscode-foreground, #cccccc);
      font-family: var(--vscode-font-family, sans-serif);
      font-size: 12px;
      height: 100vh;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 6px;
      flex-wrap: wrap;
      overflow: hidden;
    }

    .group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .divider {
      width: 1px;
      height: 22px;
      background: var(--vscode-panel-border, #3c3c3c);
      margin: 0 2px;
      flex-shrink: 0;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 9px;
      height: 26px;
      border: 1px solid transparent;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      font-family: inherit;
      white-space: nowrap;
      transition: opacity 0.12s, background 0.12s, border-color 0.12s;
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #cccccc);
      outline: none;
    }

    button:hover:not(:disabled) {
      background: var(--vscode-button-secondaryHoverBackground, #45494e);
    }

    button:focus-visible {
      border-color: var(--vscode-focusBorder, #007fd4);
    }

    button:disabled {
      opacity: 0.38;
      cursor: default;
    }

    button.primary {
      background: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #ffffff);
      font-weight: 500;
    }

    button.primary:hover:not(:disabled) {
      background: var(--vscode-button-hoverBackground, #1177bb);
    }

    button.stop {
      background: transparent;
      color: var(--vscode-errorForeground, #f48771);
      border-color: var(--vscode-errorForeground, #f48771);
    }

    button.stop:hover:not(:disabled) {
      background: color-mix(in srgb, var(--vscode-errorForeground, #f48771) 15%, transparent);
    }

    button.toggle-on {
      background: color-mix(in srgb, var(--vscode-button-background, #0e639c) 25%, transparent);
      color: var(--vscode-button-background, #0e639c);
      border-color: color-mix(in srgb, var(--vscode-button-background, #0e639c) 60%, transparent);
    }

    button.toggle-on:hover:not(:disabled) {
      background: color-mix(in srgb, var(--vscode-button-background, #0e639c) 35%, transparent);
    }

    .icon {
      font-size: 13px;
      line-height: 1;
      flex-shrink: 0;
    }

    .label { line-height: 1; }

    .hint {
      opacity: 0.5;
      font-size: 10px;
      margin-left: 1px;
    }
  </style>
</head>
<body>

  <!-- Grupo 1: Iniciar / Parar sessão -->
  <div class="group">
    <button class="primary" id="btn-debug"
            title="Debug Current File — Shift+F9"
            onclick="cmd('pycharisma.quickDebug')">
      <span class="icon">▶</span>
      <span class="label">Quick Debug</span>
    </button>

    <button class="stop" id="btn-stop"
            title="Stop — Shift+F5"
            disabled
            onclick="cmd('workbench.action.debug.stop')">
      <span class="icon">⏹</span>
      <span class="label">Stop</span>
    </button>
  </div>

  <div class="divider"></div>

  <!-- Grupo 2: Controles de passo -->
  <div class="group">
    <button id="btn-continue"
            title="Continue — F9"
            disabled
            onclick="cmd('workbench.action.debug.continue')">
      <span class="icon">⏵</span>
      <span class="label">Continue</span>
      <span class="hint">F9</span>
    </button>

    <button id="btn-stepover"
            title="Step Over — F8"
            disabled
            onclick="cmd('workbench.action.debug.stepOver')">
      <span class="icon">↷</span>
      <span class="label">Step Over</span>
      <span class="hint">F8</span>
    </button>

    <button id="btn-stepinto"
            title="Step Into — F7"
            disabled
            onclick="cmd('workbench.action.debug.stepInto')">
      <span class="icon">↓</span>
      <span class="label">Step Into</span>
      <span class="hint">F7</span>
    </button>

    <button id="btn-stepout"
            title="Step Out — Shift+F8"
            disabled
            onclick="cmd('workbench.action.debug.stepOut')">
      <span class="icon">↑</span>
      <span class="label">Step Out</span>
      <span class="hint">⇧F8</span>
    </button>

    <button id="btn-cursor"
            title="Run to Cursor — Alt+F9"
            disabled
            onclick="cmd('pycharisma.runToCursor')">
      <span class="icon">→</span>
      <span class="label">Run to Cursor</span>
      <span class="hint">⌥F9</span>
    </button>
  </div>

  <div class="divider"></div>

  <!-- Grupo 3: Avaliação -->
  <div class="group">
    <button id="btn-evaluate"
            title="Evaluate Expression — Alt+F8"
            disabled
            onclick="cmd('pycharisma.evaluateExpression')">
      <span class="icon">ƒ</span>
      <span class="label">Evaluate</span>
      <span class="hint">⌥F8</span>
    </button>
  </div>

  <div class="divider"></div>

  <!-- Grupo 4: Visualização -->
  <div class="group">
    <button id="btn-inline"
            title="Toggle Inline Variable Values"
            onclick="cmd('pycharisma.toggleInlineValues')">
      <span class="icon">◉</span>
      <span class="label">Inline Values</span>
    </button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function cmd(command) {
      vscode.postMessage({ command });
    }

    const SESSION_BTNS = [
      'btn-stop', 'btn-continue', 'btn-stepover',
      'btn-stepinto', 'btn-stepout', 'btn-cursor', 'btn-evaluate'
    ];

    window.addEventListener('message', ({ data }) => {
      if (data.type !== 'stateUpdate') return;

      SESSION_BTNS.forEach(id => {
        document.getElementById(id).disabled = !data.sessionActive;
      });

      const inlineBtn = document.getElementById('btn-inline');
      inlineBtn.classList.toggle('toggle-on', data.inlineValuesEnabled);
    });
  </script>
</body>
</html>`;
  }
}

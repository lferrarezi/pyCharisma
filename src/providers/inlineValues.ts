import * as vscode from 'vscode';

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield', 'print', 'len', 'range', 'type', 'str',
  'int', 'float', 'list', 'dict', 'set', 'tuple', 'bool', 'self',
]);

export class PyCharismaInlineValuesProvider implements vscode.InlineValuesProvider {
  private _enabled: boolean;
  private _sessionActive = false;
  private readonly _onDidChangeInlineValues = new vscode.EventEmitter<void>();

  readonly onDidChangeInlineValues = this._onDidChangeInlineValues.event;

  constructor() {
    const config = vscode.workspace.getConfiguration('pycharisma.inlineValues');
    this._enabled = config.get<boolean>('enabled', true);

    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('pycharisma.inlineValues.enabled')) {
        this._enabled = vscode.workspace.getConfiguration('pycharisma.inlineValues').get<boolean>('enabled', true);
        this._onDidChangeInlineValues.fire();
      }
    });
  }

  onSessionStart(): void {
    this._sessionActive = true;
    this._onDidChangeInlineValues.fire();
  }

  onSessionEnd(): void {
    this._sessionActive = false;
    this._onDidChangeInlineValues.fire();
  }

  get isEnabled(): boolean {
    return this._enabled;
  }

  toggle(): void {
    this._enabled = !this._enabled;
    this._onDidChangeInlineValues.fire();
    vscode.window.showInformationMessage(
      `pyCharisma: Inline values ${this._enabled ? 'ativados' : 'desativados'}`
    );
  }

  provideInlineValues(
    document: vscode.TextDocument,
    viewPort: vscode.Range,
    _context: vscode.InlineValueContext
  ): vscode.InlineValue[] {
    if (!this._enabled || !this._sessionActive) return [];

    const values: vscode.InlineValue[] = [];

    for (let line = viewPort.start.line; line <= viewPort.end.line; line++) {
      const lineText = document.lineAt(line).text;
      const identifierPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
      let match: RegExpExecArray | null;

      while ((match = identifierPattern.exec(lineText)) !== null) {
        const name = match[1];
        if (PYTHON_KEYWORDS.has(name)) continue;

        const range = new vscode.Range(
          line, match.index,
          line, match.index + name.length
        );
        values.push(new vscode.InlineValueVariableLookup(range, name, true));
      }
    }

    return values;
  }
}

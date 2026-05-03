# Constitution — pyCharisma

## Identidade

**pyCharisma** é uma extensão VSCode que traz a experiência de debug do
PyCharm para o VSCode/VSCodium, sem substituir a infraestrutura existente.

## Princípios Inegociáveis

1. **Orquestrar, não substituir** — pyCharisma sempre delega a execução real
   ao debugpy/DAP. Nunca implementa seu próprio adaptador de debug.

2. **Zero fricção de setup** — qualquer feature deve funcionar em um arquivo
   `.py` recém-aberto, sem exigir `launch.json`, `tasks.json` ou configuração
   adicional.

3. **Compatibilidade ampla** — nenhuma dependência de extensões proprietárias
   da Microsoft. Funciona no VSCodium e ambientes Open VSX.

4. **Familiaridade primeiro** — quando há conflito entre convenção VSCode e
   convenção PyCharm, a convenção PyCharm vence (o usuário migrou, não
   converteu).

5. **Progressivo** — o usuário pode usar só o Quick Debug e ignorar o resto.
   Nenhuma feature é mandatory para ativar outra.

## Contratos de API

### Debug Session Lifecycle
```
activate() → registrar comandos e providers
startDebugSession() → criar DebugConfiguration dinamicamente
onDidStartDebugSession() → ativar InlineValuesProvider
onDidTerminateDebugSession() → limpar estado
```

### Comando principal: `pycharisma.quickDebug`
- Pré-condição: arquivo ativo é `.py`
- Ação: cria `DebugConfiguration` com `type: "debugpy"`, `request: "launch"`,
  `program: "${file}"` e inicia sessão
- Fallback: se não há interpretador configurado, abre seletor de Python

### InlineValuesProvider
- Ativa somente durante sessão de debug ativa
- Consulta variáveis via `vscode.debug.activeDebugSession.customRequest`
- Exibe no formato `nome = valor` ao fim da linha
- Trunca valores longos (> 40 chars) com `…`

## Keybindings PyCharm (padrão)

| Ação                | PyCharm    | pyCharisma (VSCode) |
|---------------------|------------|---------------------|
| Debug arquivo atual | Shift+F9   | Shift+F9            |
| Step Over           | F8         | F8                  |
| Step Into           | F7         | F7                  |
| Step Out            | Shift+F8   | Shift+F8            |
| Run to Cursor       | Alt+F9     | Alt+F9              |
| Resume              | F9         | F9                  |
| Toggle Breakpoint   | Ctrl+F8    | Ctrl+F8             |
| Evaluate Expression | Alt+F8     | Alt+F8              |

> Keybindings são opcionais — o usuário pode desativar via settings.

## Versionamento

- **v1.x** — features Must Have + Should Have deste briefing
- **v2.x** — Smart Step Into, toolbar flutuante
- **v3.x** — integração com pytest debug, profiler view

## Limites do Produto

O que pyCharisma **nunca** será:
- Um substituto do debugpy
- Um IDE completo
- Uma ferramenta de profiling/performance
- Um gerenciador de ambientes Python

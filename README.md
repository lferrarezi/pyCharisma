# pyCharisma

> A experiência de debug do PyCharm para Python no VSCode/VSCodium

O pyCharisma traz o fluxo de debug familiar do PyCharm para dentro do VSCode,
sem substituir nenhuma ferramenta existente — ele orquestra por cima do `debugpy`.

> *The familiar PyCharm debugging workflow, brought into VSCode without replacing any existing tooling — it orchestrates on top of `debugpy`.*

---

## Funcionalidades

### Debug Rápido (Shift+F9)
Depure o arquivo Python atual instantaneamente — sem necessidade de `launch.json`.

*Debug the current Python file instantly — no `launch.json` required.*

---

### Valores de Variáveis Inline
Veja os valores das variáveis diretamente em cada linha durante uma sessão de debug, no estilo PyCharm.

*See variable values directly on each line during a debug session, PyCharm-style.*

---

### Atalhos no estilo PyCharm

| Ação                     | Atalho       |
|--------------------------|--------------|
| Debug do arquivo atual   | `Shift+F9`   |
| Step Over                | `F8`         |
| Step Into                | `F7`         |
| Step Out                 | `Shift+F8`   |
| Continuar execução       | `F9`         |
| Executar até o cursor    | `Alt+F9`     |
| Ativar/desativar breakpoint | `Ctrl+F8` |
| Avaliar expressão        | `Alt+F8`     |

*PyCharm-compatible keyboard shortcuts.*

---

### Avaliar Expressão (Alt+F8)
Abre um prompt para avaliar qualquer expressão Python no frame de debug atual.
Preenche automaticamente com o texto selecionado no editor.

*Opens a prompt to evaluate any Python expression in the current debug frame. Pre-fills with your current text selection.*

---

### Adicionar ao Watch
Clique com o botão direito em qualquer expressão selecionada durante o debug para adicioná-la ao painel Watch.

*Right-click any selected expression during debug to add it to the Watch panel.*

---

## Requisitos

- Python com `debugpy` instalado: `pip install debugpy`
- VSCode 1.85+ ou VSCodium com suporte equivalente à linguagem Python

*Python with `debugpy` installed and VSCode 1.85+ or VSCodium with equivalent Python language support.*

---

## Configurações

| Configuração | Padrão | Descrição |
|---|---|---|
| `pycharisma.inlineValues.enabled` | `true` | Exibir valores de variáveis inline |
| `pycharisma.inlineValues.maxLength` | `40` | Máximo de caracteres por valor inline |
| `pycharisma.quickDebug.stopOnEntry` | `false` | Pausar na primeira linha ao iniciar debug |
| `pycharisma.quickDebug.pythonPath` | `""` | Caminho para um interpretador Python específico |

*Extension settings available via VSCode Settings UI or `settings.json`.*

---

## Compatibilidade

- VSCode Marketplace
- Open VSX Registry (VSCodium)
- **Não** requer a extensão `ms-python.python` (recomendada, mas não obrigatória)

*Compatible with VSCode Marketplace and Open VSX Registry. Does not require `ms-python.python` (recommended but not required).*

---

## Roadmap

- **v1** — Debug Rápido, Valores Inline, Atalhos PyCharm, Avaliar Expressão
- **v2** — Smart Step Into, barra de debug flutuante
- **v3** — integração com debug do pytest, visualização de profiler

*v1 — Quick Debug, Inline Values, PyCharm Keybindings, Evaluate Expression · v2 — Smart Step Into, floating debug toolbar · v3 — pytest debug integration, profiler view.*

# Briefing Técnico — pyCharisma

## Problema

Desenvolvedores Python migrando do PyCharm para VSCode/VSCodium perdem uma
experiência de debug altamente refinada. O VSCode possui a infraestrutura
técnica (debugpy + DAP) mas a UX é substancialmente diferente, gerando fricção
e perda de produtividade.

## Objetivo

Criar uma extensão chamada **pyCharisma** que feche o gap de experiência de
debug entre PyCharm e VSCode, priorizando os fluxos mais impactantes para
usuários que fizeram essa migração.

## Repositório

https://github.com/lferrarezi/pyCharisma

## Mapa de Gaps PyCharm → VSCode

| Funcionalidade                          | PyCharm | VSCode nativo | pyCharisma v1 |
|-----------------------------------------|---------|---------------|---------------|
| Breakpoints visuais                     | ✅      | ✅             | melhoria UX   |
| Step Over / Into / Out                  | ✅      | ✅             | keybindings   |
| Run to Cursor                           | ✅      | ✅ (oculto)    | expor         |
| Inline variable values na linha         | ✅      | ⚠️ parcial    | implementar   |
| Debug sem launch.json (arquivo atual)   | ✅      | ⚠️ requer cfg | implementar   |
| Evaluate Expression com autocomplete    | ✅      | ⚠️ parcial    | melhorar      |
| Variables panel com edição inline       | ✅      | ⚠️ parcial    | melhorar      |
| Exception breakpoints granulares        | ✅      | ⚠️ parcial    | melhorar      |
| Smart Step Into (escolher método)       | ✅      | ❌            | v2            |
| Memory/heap view                        | ✅      | ❌            | fora de escopo|
| Toolbar flutuante reposicionável        | ✅      | ❌ (fixo)     | v2            |

## Priorização MoSCoW — v1

### Must Have
1. **Quick Debug** — F5 inteligente: detecta arquivo Python atual, cria
   configuração de debug on-the-fly sem exigir `launch.json`
2. **Inline Variable Values** — exibir valores de variáveis diretamente na
   linha de código durante sessão de debug (via `InlineValuesProvider`)
3. **Keybindings PyCharm** — mapear atalhos familiares (F8=step over,
   F7=step into, Shift+F8=step out, Alt+F9=run to cursor)

### Should Have
4. **Exception Breakpoints UI** — panel melhorado para gerenciar quais
   exceções pausam a execução
5. **Debug Current File** — botão/comando na barra de status e no editor
   para iniciar debug do arquivo aberto sem configuração

### Could Have
6. **Watch Expression** — adicionar expressões ao watch via seleção de texto
   (Ctrl+Shift+F8 style)
7. **Variable Quick View** — hover sobre variável durante debug mostra valor
   expandido (similar ao PyCharm tooltip)

### Won't Have (v1)
- Smart Step Into (análise de bytecode — v2)
- Toolbar flutuante reposicionável (limitação da Extension API — v2)
- Remote debug UI (fora de escopo)
- Memory view (fora de escopo)

## Stack Técnico

- **Linguagem:** TypeScript 5.x
- **API:** vscode Extension API (não depende de extensões MS proprietárias)
- **Debug Protocol:** DAP via `vscode.debug` namespace
- **Compatibilidade:** VSCode 1.85+, VSCodium, Open VSX Registry
- **Build:** esbuild (bundle leve, sem webpack)
- **Testes:** @vscode/test-electron

## Restrições

- Não substituir nem forkar o `debugpy` — orquestrar por cima
- Não depender da extensão Python da Microsoft (ms-python.python) como
  dependência obrigatória — recomendada mas não required
- Compatible com Open VSX para usuários VSCodium

## Definition of Done da v1

- [ ] Quick Debug funciona em arquivo `.py` sem `launch.json`
- [ ] Inline values aparecem durante sessão de debug ativa
- [ ] Keybindings PyCharm configurados e documentados
- [ ] Publicado no VSCode Marketplace e Open VSX
- [ ] README com GIF demonstrativo de cada feature

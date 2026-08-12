---
name: code-to-canvas-capture
description: Configurar e operar o fluxo oficial Figma Code to Canvas para páginas web locais. Usar quando o usuário pedir para abrir um link localhost no Figma, iniciar uma sessão manual de captura, converter uma interface executada no navegador em layers editáveis, capturar uma tela inteira ou selecionar um componente para um arquivo Figma Design.
---

# Code to Canvas Capture

Abrir uma aplicação web local com a toolbar oficial do Figma Code to Canvas, automatizando configuração, execução, instrumentação, captura e limpeza.

## Entradas

Obter do pedido ou descobrir automaticamente:

- URL local ou diretório do projeto;
- arquivo Figma Design de destino, quando já existir;
- nome do novo arquivo, quando for necessário criá-lo.

Aceitar URLs em `localhost`, `127.0.0.1`, `0.0.0.0`, `[::1]` ou `*.local`.

## Fluxo

1. Inspecionar o repositório sem refatorar:
   - identificar framework, lockfile, package manager e script de desenvolvimento;
   - preservar alterações preexistentes e registrar `git status`;
   - reutilizar dependências instaladas.
2. Verificar o Figma MCP com `codex mcp list`.
3. Se necessário, executar:

   ```sh
   codex mcp add figma --url https://mcp.figma.com/mcp
   codex mcp login figma
   ```

4. Parar somente quando houver OAuth, escolha entre vários times/organizações ou reinício obrigatório do Codex. Explicar exatamente o que clicar e o resultado esperado.
5. Confirmar que a sessão expõe `generate_figma_design`. Nunca fingir que a ferramenta existe.
6. Iniciar ou reutilizar o servidor local e confirmar HTTP 200.
7. Usar o arquivo Figma Design fornecido. Se não houver:
   - chamar `whoami`;
   - escolher automaticamente quando existir apenas um plano;
   - pedir escolha quando existirem vários planos;
   - carregar a orientação oficial `figma-create-new-file` e criar um Design file nos Drafts.
8. Carregar a orientação oficial `figma-generate-design`.
9. Chamar `generate_figma_design` sem `captureId` para obter o ID e a URL instrumentada.
10. Para localhost, adicionar temporariamente ao HTML de entrada:

    ```html
    <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
    ```

11. Abrir automaticamente a URL instrumentada indicada pela ferramenta. Não pedir que o usuário execute comandos.
12. Consultar o mesmo `captureId` a cada cinco segundos até `completed`.
13. Deixar a janela e o servidor abertos para uma sessão manual e orientar:
    - navegar normalmente até a tela;
    - clicar **Entire screen** para capturar a tela completa;
    - clicar **Select element** e depois no elemento para capturar um componente;
    - repetir quantas vezes precisar;
    - responder **terminei** ao final.
14. Quando o usuário disser que terminou:
    - remover integralmente a tag temporária;
    - encerrar somente os processos iniciados por esta execução;
    - remover arquivos temporários;
    - executar `git status`;
    - não deixar alterações indesejadas.

## Regras

- Usar somente o MCP remoto oficial: `https://mcp.figma.com/mcp`.
- Usar especificamente `generate_figma_design` para Code to Canvas.
- Cada captura requer um `captureId` exclusivo.
- Capturar no mesmo arquivo enquanto o usuário não pedir outro.
- Não adicionar dependências permanentes, rotas temporárias ou mudanças funcionais.
- Preferir seletores semânticos estáveis para componentes.
- Não encerrar navegadores ou processos que já existiam antes da execução.
- Informar que Code to Canvas gera frames e layers editáveis, mas não converte automaticamente tudo em Figma Components/variants.
- Manter a instrumentação enquanto a sessão manual estiver ativa; restaurar o HTML apenas no encerramento.

## Exemplos de chamada

- `Use $code-to-canvas-capture em http://localhost:5173/ e envie para este arquivo Figma: <URL>.`
- `Use $code-to-canvas-capture neste projeto e crie um novo arquivo nos meus Drafts.`
- `Use $code-to-canvas-capture para abrir uma sessão manual; quando eu disser terminei, limpe tudo.`

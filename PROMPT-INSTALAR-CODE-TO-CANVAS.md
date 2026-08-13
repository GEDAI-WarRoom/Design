# Prompt para instalar e usar Code to Canvas

Copie e envie o texto abaixo para a IA no outro computador:

```text
Configure neste computador o fluxo oficial Figma Code to Canvas e faça sozinho tudo que puder.

O repositório contém a skill em:
codex-skills/code-to-canvas-capture

Tarefas:
1. Instale essa skill em ~/.codex/skills/code-to-canvas-capture para que o Codex possa descobri-la.
2. Verifique o Figma MCP com:
   codex mcp list
3. Se ainda não existir, configure o servidor remoto oficial:
   codex mcp add figma --url https://mcp.figma.com/mcp
4. Se necessário, autentique:
   codex mcp login figma
5. Confirme que a configuração foi salva e que a ferramenta generate_figma_design está realmente disponível.
6. Se for necessário reiniciar o Codex para carregar o MCP ou a skill, pare e me diga exatamente como reiniciar.
7. Depois do reinício, use $code-to-canvas-capture no link local que eu fornecer.

Automatize instalação, comandos, servidor local, instrumentação temporária, abertura do navegador e limpeza. Só pare para OAuth, autorização no navegador, escolha entre times do Figma ou reinício obrigatório.

Não faça commit, push, upgrade de dependências ou alterações permanentes no projeto.
```

Depois da instalação, uma chamada típica é:

```text
Use $code-to-canvas-capture em http://localhost:5173/ e envie as capturas para este arquivo Figma Design: <COLE_A_URL_DO_FIGMA>.
```

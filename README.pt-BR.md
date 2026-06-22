# Decisa AI Tools

[English](README.md) · **Português (BR)** · [Español](README.es.md)

Integrações que conectam o [Decisa](https://decisa.ai) — um sistema operacional de
publicidade (Gestão de Campanhas + Atribuição) — a agentes e assistentes de IA para
programação.

O Decisa expõe ~250 ferramentas via [Model Context Protocol](https://modelcontextprotocol.io)
em `https://mcp.decisa.ai`. É bastante superfície, e os agentes costumam se perder:
ferramenta errada, ordem errada, sem modelo de domínio. Este repositório entrega a
**conexão mais a orientação** para que um agente saiba usar o Decisa com segurança
desde o início.

## O que tem aqui

| Caminho | O que é | Funciona em |
|---------|---------|-------------|
| [`plugins/decisa/`](plugins/decisa) | Plugin do Claude Code: servidor MCP do Decisa + skills de uso | Claude Code |
| `cursor/` | *(planejado)* Regras do Cursor + config MCP | Cursor |
| `chatgpt/` | *(planejado)* Guia de conector / GPT | ChatGPT |

O servidor MCP em si funciona em **qualquer** cliente MCP. Este repositório existe
para deixar cada cliente *bom* em usá-lo.

## Claude Code: instalação

```
/plugin marketplace add decisa-ai/ai-tools
/plugin install decisa@decisa-ai
```

Isso te dá, em um único passo:

- **A conexão MCP do Decisa** (`https://mcp.decisa.ai`) — faça login com OAuth quando
  solicitado (`/mcp` → Decisa → Authenticate).
- **Skills** que carregam automaticamente quando relevantes:
  - **decisa-orientation** — leia primeiro: descoberta de workspace, gating de
    capacidade, escopos de leitura vs escrita e os modelos de domínio centrais.
  - **changeset-safety** — o fluxo propor → revisar → aprovar → aplicar → auditar
    para qualquer mudança que gaste dinheiro ou toque o estado ao vivo da plataforma
    de anúncios.
  - **roas-investigation** — a escada de diagnóstico somente leitura para "por que
    esta campanha está perdendo dinheiro / por que o ROAS diverge da plataforma?"
  - **campaign-launch** — construa uma campanha Google/Meta/TikTok de cima para
    baixo, com gasto ativado apenas pelo fluxo de changeset.
  - **attribution-setup** — links UTM, pixel, mapeamentos de eventos, gatilhos de
    conversão e os passos de verificação que provam que os dados estão fluindo.
  - **signals-diagnostics** — triagem somente leitura quando o rastreamento parece
    quebrado: isole se os eventos não estão chegando, estão sem mapeamento ou não
    estão sendo entregues.
  - **audit-and-optimize** — o loop do advisor: ler achados de auditoria/sinais →
    explicar → rascunhar a correção como changeset → aplicar com segurança.
  - **automations** — o motor de regras: sugestões, templates e regras que propõem
    mudanças em rascunho para revisão (nunca gastam de forma autônoma).
  - **funnels** — construa e diagnostique funis de conversão; descubra onde os
    usuários abandonam.

### Primeira chamada, toda sessão

O Decisa roda em **modo de conta**: uma conexão abrange todos os seus workspaces.
Sempre chame `list_workspaces` primeiro e depois passe `workspace_id` em todas as
demais ferramentas. A skill de orientação cobre o resto.

## Usar qualquer cliente MCP (sem plugin)

Aponte seu cliente para o servidor remoto:

```json
{
  "mcpServers": {
    "decisa": { "type": "http", "url": "https://mcp.decisa.ai" }
  }
}
```

Autentique via OAuth quando solicitado. Você não terá as skills incluídas (elas são
um recurso do Claude Code), mas todas as ferramentas do Decisa estarão disponíveis.

## Docs

- Guias de produto e API: https://docs.decisa.ai
- No agente: chame a ferramenta `get_decisa_docs`.

## Licença

MIT — veja [LICENSE](LICENSE).

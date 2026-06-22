# Decisa AI Tools

**English** · [Português (BR)](README.pt-BR.md) · [Español](README.es.md)

Integrations that connect [Decisa](https://decisa.ai) — an advertising operating
system (Campaign Management + Attribution) — to AI coding agents and assistants.

Decisa exposes ~250 tools over the [Model Context Protocol](https://modelcontextprotocol.io)
at `https://mcp.decisa.ai`. That's a lot of surface, and agents tend to flounder:
wrong tool, wrong order, no domain model. This repo ships the **connection plus the
guidance** so an agent knows how to use Decisa safely out of the box.

## What's here

| Path | What it is | Works in |
|------|------------|----------|
| [`plugins/decisa/`](plugins/decisa) | Claude Code plugin: Decisa MCP server + usage skills | Claude Code |
| [`cursor/`](cursor) | Cursor Rules + MCP config | Cursor |
| [`chatgpt/`](chatgpt) | Custom-connector setup guide (Developer mode) | ChatGPT |

The MCP server itself works in **any** MCP client. This repo is about making each
client *good* at using it.

## Claude Code: install

```
/plugin marketplace add decisa-ai/ai-tools
/plugin install decisa@decisa-ai
```

That gives you, in one step:

- **The Decisa MCP connection** (`https://mcp.decisa.ai`) — sign in with OAuth when
  prompted (`/mcp` → Decisa → Authenticate).
- **Skills** that load automatically when relevant:
  - **decisa-orientation** — read first: workspace discovery, capability gating,
    read vs write scopes, and the core domain models.
  - **changeset-safety** — the propose → review → approve → apply → audit flow for
    any change that spends money or touches live ad-platform state.
  - **roas-investigation** — the read-only diagnostic ladder for "why is this
    campaign losing money / why does ROAS disagree with the platform?"
  - **campaign-launch** — build a Google/Meta/TikTok campaign top-down, with spend
    turned on only through the changeset flow.
  - **attribution-setup** — UTM links, pixel, event mappings, conversion triggers,
    and the verification steps that prove data is flowing.
  - **signals-diagnostics** — read-only triage when tracking looks broken: isolate
    whether events aren't arriving, are unmapped, or aren't being delivered.
  - **audit-and-optimize** — the advisor loop: read audit findings/signals →
    explain → draft the fix as a changeset → apply safely.
  - **automations** — the rules engine: suggestions, templates, and rules that
    propose draft changes for review (never spend autonomously).
  - **funnels** — build and diagnose conversion funnels; find where users drop off.

### First call, every session

Decisa runs in **account mode**: one connection spans all your workspaces. Always
call `list_workspaces` first, then pass `workspace_id` on every other tool. The
orientation skill covers the rest.

## Cursor: install

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=decisa&config=eyJ1cmwiOiJodHRwczovL21jcC5kZWNpc2EuYWkifQ==)

One click adds the Decisa MCP server; authenticate via OAuth in **Settings → MCP**.
GitHub strips `cursor://` links, so if the button does nothing, copy
[`cursor/mcp.json`](cursor/mcp.json) into `.cursor/mcp.json` instead.

For the guidance layer, copy the [`cursor/rules/`](cursor/rules) `.mdc` files (the same
skills, ported to Cursor Rules) into your project's `.cursor/rules/`. Full steps:
[`cursor/README.md`](cursor/README.md).

## ChatGPT: install

ChatGPT connects via a **custom connector** (Developer mode). There's no config file
— you paste the URL and sign in:

1. **Settings → Connectors**, turn on **Developer mode**.
2. **Add custom connector**, paste `https://mcp.decisa.ai`, and save.
3. Approve the Decisa sign-in when the browser opens, then enable the **Decisa**
   connector in a chat.

Needs a paid ChatGPT plan (Plus, Pro, Business, or Enterprise). ChatGPT has no
skill/rules layer, so ask the agent to call `get_decisa_docs` first for orientation.
Full steps: [`chatgpt/README.md`](chatgpt/README.md).

## Use any MCP client (no plugin)

Point your client at the remote server:

```json
{
  "mcpServers": {
    "decisa": { "type": "http", "url": "https://mcp.decisa.ai" }
  }
}
```

Authenticate via OAuth when prompted. You won't get the bundled skills (those are a
Claude Code feature), but every Decisa tool is available.

## Docs

- Product & API guides: https://docs.decisa.ai
- In-agent: call the `get_decisa_docs` tool.

## License

MIT — see [LICENSE](LICENSE).

# Decisa AI Tools

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
| `cursor/` | *(planned)* Cursor rules + MCP config | Cursor |
| `chatgpt/` | *(planned)* Connector / GPT setup guide | ChatGPT |

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

### First call, every session

Decisa runs in **account mode**: one connection spans all your workspaces. Always
call `list_workspaces` first, then pass `workspace_id` on every other tool. The
orientation skill covers the rest.

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

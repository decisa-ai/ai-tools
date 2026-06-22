# Decisa for Cursor

Two pieces, same idea as the Claude Code plugin: the **MCP connection** plus the
**guidance** (Cursor Rules, the analog of Claude Code skills).

Cursor has no plugin marketplace that bundles both, so this is a copy-from-source
setup: add the MCP server once, then drop the rules into your project.

## 1. Add the MCP server

### One click

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=decisa&config=eyJ1cmwiOiJodHRwczovL21jcC5kZWNpc2EuYWkifQ==)

If the button doesn't open Cursor (e.g. you're reading this on GitHub, which strips
`cursor://` links), use the manual config below.

### Manual

Copy [`mcp.json`](mcp.json) into `.cursor/mcp.json` in your project (or merge it into
`~/.cursor/mcp.json` to enable it globally):

```json
{
  "mcpServers": {
    "decisa": { "url": "https://mcp.decisa.ai" }
  }
}
```

Then open **Cursor → Settings → MCP**, find **decisa**, and authenticate. Decisa uses
OAuth with dynamic client registration, so there's nothing to paste — the browser
flow handles it. No `type` field is needed; the `url` marks it as a remote server.

## 2. Add the rules

The [`rules/`](rules) folder holds nine `.mdc` rules — the same guidance as the Claude
Code skills, so Cursor's agent knows how to drive the ~250 Decisa tools safely.

Copy them into your project:

```bash
mkdir -p .cursor/rules
cp path/to/ai-tools/cursor/rules/*.mdc .cursor/rules/
```

They're **Agent Requested** rules (`alwaysApply: false`): Cursor pulls in the right
one based on what you're doing, from its `description`. Start with
`decisa-orientation` — it's the one to read first.

| Rule | When it applies |
|------|-----------------|
| `decisa-orientation` | Read first: workspace discovery, capability gating, read vs write scopes, core domain models. |
| `changeset-safety` | Any change that spends money or touches live ad-platform state: propose → review → approve → apply → audit. |
| `roas-investigation` | "Why is this campaign losing money / why does ROAS disagree with the platform?" (read-only). |
| `campaign-launch` | Build a Google/Meta/TikTok campaign top-down; spend on only via the changeset flow. |
| `attribution-setup` | UTM links, pixel, event mappings, conversion triggers, and the verification steps. |
| `signals-diagnostics` | Read-only triage when tracking looks broken. |
| `audit-and-optimize` | The advisor loop: read findings/signals → explain → draft the fix → apply. |
| `automations` | The rules engine: suggestions, templates, rules that propose drafts (never spend autonomously). |
| `funnels` | Build and diagnose conversion funnels; find where users drop off. |

## First call, every session

Decisa runs in **account mode**: one connection spans all your workspaces. Always
call `list_workspaces` first, then pass `workspace_id` on every other tool. The
orientation rule covers the rest.

## Docs

- Product & API guides: https://docs.decisa.ai
- In-agent: call the `get_decisa_docs` tool.

# Decisa for ChatGPT

ChatGPT talks to Decisa through a **custom connector** — a remote MCP server you add
once in ChatGPT's settings. There's no config file and no API key: you paste the
Decisa connection URL and sign in with OAuth in the browser.

Unlike the Claude Code plugin and Cursor rules, there's no guidance layer to bundle
here — ChatGPT has no skill/rules system. The connector gives the agent every Decisa
tool; for orientation, ask it to call `get_decisa_docs` at the start of a session.

## Requirements

- A paid ChatGPT plan (**Plus, Pro, Business, or Enterprise**). Custom connectors
  aren't on the free tier.
- **Developer mode** enabled. The non-developer "connectors" path only supports the
  deep-research shape — a server that exposes `search` + `fetch` tools. Decisa
  exposes its full ~250-tool surface instead, so it needs Developer mode's full
  read+write connector support.
- On Business/Enterprise, a workspace admin must allow custom connectors first.

## Add the connector

1. Open **Settings → Connectors** in ChatGPT.
2. Turn on **Developer mode** (Settings → Connectors → Advanced → Developer mode).
3. Choose **Add custom connector** and paste the Decisa server URL:

   ```
   https://mcp.decisa.ai
   ```

4. Save. ChatGPT registers itself (dynamic client registration) and opens a Decisa
   sign-in in your browser. Approve access once — nothing to paste, no token to copy.
5. In a chat, open the tools/compose menu and enable the **Decisa** connector.

## First call, every session

Decisa runs in **account mode**: one connection spans all your workspaces. Always ask
it to call `list_workspaces` first; it then passes `workspace_id` on every other
tool. Anything that spends money or touches live ad-platform state goes through
Decisa's draft → review → apply flow — the assistant proposes, you approve.

## No bundled skills — prime it yourself

ChatGPT has no skill/rules layer to drop in, so the agent doesn't get the orientation
guidance automatically. Two ways to compensate:

- Ask it to call `get_decisa_docs` at the start of a session.
- Paste the orientation guidance from a [Cursor rule](../cursor/rules) into your
  first message if you want the agent primed up front.

Every Decisa tool is available regardless.

## Heads-up

Developer mode connectors can read and write, so ChatGPT shows a prompt-injection
warning. That's expected for any write-capable connector; Decisa's own rails — read
vs write scopes, the changeset approval flow, per-workspace confirmation on account
mode — still apply on top.

## Docs

- Product & API guides: https://docs.decisa.ai
- In-agent: call the `get_decisa_docs` tool.

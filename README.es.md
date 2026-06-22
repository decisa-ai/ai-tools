# Decisa AI Tools

[English](README.md) · [Português (BR)](README.pt-BR.md) · **Español**

Integraciones que conectan [Decisa](https://decisa.ai) — un sistema operativo de
publicidad (Gestión de Campañas + Atribución) — con agentes y asistentes de IA para
programación.

Decisa expone ~250 herramientas a través del [Model Context Protocol](https://modelcontextprotocol.io)
en `https://mcp.decisa.ai`. Es mucha superficie, y los agentes suelen perderse:
herramienta equivocada, orden equivocado, sin modelo de dominio. Este repositorio
entrega la **conexión más la guía** para que un agente sepa usar Decisa de forma
segura desde el primer momento.

## Qué hay aquí

| Ruta | Qué es | Funciona en |
|------|--------|-------------|
| [`plugins/decisa/`](plugins/decisa) | Plugin de Claude Code: servidor MCP de Decisa + skills de uso | Claude Code |
| [`cursor/`](cursor) | Reglas de Cursor + config MCP | Cursor |
| `chatgpt/` | *(planeado)* Guía de conector / GPT | ChatGPT |

El servidor MCP en sí funciona en **cualquier** cliente MCP. Este repositorio existe
para que cada cliente sea *bueno* usándolo.

## Claude Code: instalación

```
/plugin marketplace add decisa-ai/ai-tools
/plugin install decisa@decisa-ai
```

Eso te da, en un solo paso:

- **La conexión MCP de Decisa** (`https://mcp.decisa.ai`) — inicia sesión con OAuth
  cuando se te solicite (`/mcp` → Decisa → Authenticate).
- **Skills** que se cargan automáticamente cuando son relevantes:
  - **decisa-orientation** — léela primero: descubrimiento de workspace, gating de
    capacidades, ámbitos de lectura vs escritura y los modelos de dominio centrales.
  - **changeset-safety** — el flujo proponer → revisar → aprobar → aplicar → auditar
    para cualquier cambio que gaste dinero o toque el estado en vivo de la plataforma
    de anuncios.
  - **roas-investigation** — la escalera de diagnóstico de solo lectura para "¿por
    qué esta campaña está perdiendo dinero / por qué el ROAS no coincide con la
    plataforma?"
  - **campaign-launch** — construye una campaña de Google/Meta/TikTok de arriba hacia
    abajo, con el gasto activado solo mediante el flujo de changeset.
  - **attribution-setup** — enlaces UTM, píxel, mapeos de eventos, disparadores de
    conversión y los pasos de verificación que prueban que los datos están fluyendo.
  - **signals-diagnostics** — triaje de solo lectura cuando el rastreo parece roto:
    aísla si los eventos no llegan, no están mapeados o no se están entregando.
  - **audit-and-optimize** — el bucle del advisor: leer hallazgos de auditoría/señales
    → explicar → redactar la corrección como changeset → aplicar con seguridad.
  - **automations** — el motor de reglas: sugerencias, plantillas y reglas que
    proponen cambios en borrador para revisión (nunca gastan de forma autónoma).
  - **funnels** — construye y diagnostica embudos de conversión; encuentra dónde
    abandonan los usuarios.

### Primera llamada, cada sesión

Decisa funciona en **modo cuenta**: una conexión abarca todos tus workspaces. Llama
siempre a `list_workspaces` primero y luego pasa `workspace_id` en todas las demás
herramientas. La skill de orientación cubre el resto.

## Cursor: instalación

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=decisa&config=eyJ1cmwiOiJodHRwczovL21jcC5kZWNpc2EuYWkifQ==)

Un clic agrega el servidor MCP de Decisa; autentícate vía OAuth en **Settings → MCP**.
GitHub elimina los enlaces `cursor://`, así que si el botón no hace nada, copia
[`cursor/mcp.json`](cursor/mcp.json) en `.cursor/mcp.json`.

Para la capa de guía, copia los archivos `.mdc` de [`cursor/rules/`](cursor/rules)
(las mismas skills, portadas a Reglas de Cursor) en el `.cursor/rules/` de tu proyecto.
Pasos completos: [`cursor/README.md`](cursor/README.md).

## Usar cualquier cliente MCP (sin plugin)

Apunta tu cliente al servidor remoto:

```json
{
  "mcpServers": {
    "decisa": { "type": "http", "url": "https://mcp.decisa.ai" }
  }
}
```

Autentícate vía OAuth cuando se te solicite. No tendrás las skills incluidas (son una
función de Claude Code), pero todas las herramientas de Decisa están disponibles.

## Docs

- Guías de producto y API: https://docs.decisa.ai
- En el agente: llama a la herramienta `get_decisa_docs`.

## Licencia

MIT — consulta [LICENSE](LICENSE).

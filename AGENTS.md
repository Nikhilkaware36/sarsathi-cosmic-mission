<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Cinematic experience
- Keep cinematic timing in a pure TypeScript timeline with millisecond boundaries; one monotonic clock controls the intro so rerenders and slow rendering cannot change scene durations.
- Keep the persistent R3F scene separate from scene typography, and gate Canvas rendering with ClientOnly; this preserves SSR and prevents canvas resets.
- Use hosted asset pointers for Earth textures and NASA's Landsat model, and retain their license credits; runtime assets must not depend on external source hosts.
- Pause the cinematic elapsed-time accumulator and R3F rendering while the tab is hidden; this preserves visible scene durations without background rendering.
- Keep mission sections in individual content routes sharing MissionDashboard; navigation must work on direct loads and preserve a single presentation shell.
- Keep generated geography and conceptual analysis in ScienceMap, explicitly distinct from connected observational data; this prevents simulated outputs being interpreted as findings.

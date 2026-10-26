# Blog Marhalah

Remix application with Sanity Content Lake for published articles and an embedded Sanity Studio.

## Requirements

- Node.js 20 or newer
- pnpm
- Access to the Sanity project `vb4eh60i` to edit or import content

Copy `.env.example` to `.env` for local configuration. The public project ID, dataset, and API version may be used by the browser; do not prefix `SANITY_API_TOKEN` with `VITE_`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SANITY_PROJECT_ID` / `VITE_SANITY_PROJECT_ID` | No | Defaults to `vb4eh60i`. |
| `SANITY_DATASET` / `VITE_SANITY_DATASET` | No | Defaults to `production`. |
| `SANITY_API_VERSION` / `VITE_SANITY_API_VERSION` | No | Defaults to the stable API version `2025-02-19`. |
| `SANITY_API_TOKEN` | Only for migration | Server-side token with permission to create documents and upload assets. Never expose it to client builds. |

## Run the application and Studio

```sh
pnpm install
pnpm dev
```

Open the site at `http://localhost:5173` and the Sanity Studio at `/admin`. Sanity handles editor authentication; users need access to the configured Sanity project. For a separately hosted local Studio, run `pnpm studio:dev`.

The embedded Studio is part of the Remix application and is deployed with it on Netlify. No separate Studio deployment is required. To host a separate Sanity Studio, configure its URL in the Sanity project and deploy it with `pnpm exec sanity deploy`.

## Content model

The `post` schema is registered in `app/sanity.config.ts`. It preserves the existing Markdown article body, public legacy URL identifier, category, byline, tags, cover/gallery images and SEO fields. Image fields include required alternative text; external image URLs remain supported for legacy sources.

Public pages query only published Sanity documents with a publication date that is not in the future. Queries use the read-only public client and the `production` dataset. The article routes remain `/post/:id`, and migrated documents retain the source filename as `legacyId`.

## Import existing Markdown

The existing source is `content/posts/*.md`. Review the target dataset before importing. The migration is additive: it uses stable IDs and skips documents that already match by legacy ID or slug. It does not replace or delete existing documents. Local image files referenced by the front matter are uploaded to Sanity when present; missing paths are retained as URLs and reported as warnings.

1. Set `SANITY_API_TOKEN` in a private local environment (or the deployment shell) using a project token authorized to create documents and upload assets. Do not commit the token.
2. Confirm `SANITY_DATASET=production`, then run:

   ```sh
   pnpm migrate:content
   ```

3. Review the per-document JSON report and verify imported articles in Studio. Failed records are reported and cause a non-zero exit code. Re-running the command skips matching documents.

This command writes to the configured Sanity dataset; it is not part of the normal build or deployment.

## Checks and deployment

```sh
pnpm typecheck
pnpm build
```

Netlify builds with `pnpm run build` and publishes `build/client`. Set the public Sanity configuration variables in the Netlify environment if using values other than the defaults. Keep write tokens out of frontend and public build variables.

Previewing drafts is not enabled on public routes. Editors can preview drafts inside Studio; any future website preview mode should use a server-only token and authenticated preview session.

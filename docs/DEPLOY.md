# Deploying the site

This is a GitHub user site. The repository name is `PrasadGanesh.github.io`, so GitHub Pages serves it at the domain root. The Astro `base` path stays `/`. There is no custom domain.

The live origin is `siteOrigin` in `site-origin.mjs`. Astro uses it for canonical URLs, Open Graph URLs, and the sitemap. It is `https://prasadganesh.github.io`.

## One-time step

The repository owner has to switch the Pages source once:

1. Open the repository on GitHub.
2. Go to **Settings → Pages → Build and deployment → Source**.
3. Choose **GitHub Actions**.

No secret is required. Until that source is selected, Pages still publishes the files on `master` (the Astro project, not the built site). The deploy and preview workflows detect `build_type != workflow` and skip `actions/deploy-pages` instead of failing. The pull-request comment says the same thing.

After the switch, the next push to `master` publishes the built site. You can also run the **Deploy** workflow by hand.

If a preview publish fails while pushing the `gh-pages-previews` branch with a permissions error, set **Settings → Actions → General → Workflow permissions** to **Read and write permissions**. The workflows already request the token scopes they need. This second change is only for a repository policy that blocks those scopes.

## Production

`.github/workflows/deploy.yml` runs on every push to `master`.

1. `npm ci` and `npm run build` write the static site to `dist/`.
2. The workflow copies `dist/` to the Pages artifact. It also copies any `pr-<number>/` directories stored on the `gh-pages-previews` branch, so a production deploy does not delete open previews.
3. `actions/upload-pages-artifact` and `actions/deploy-pages` publish that artifact.

The artifact root is the site root. A `CNAME` file in the artifact is removed on purpose. With GitHub Actions as the source, a `CNAME` file does not attach a domain, and this site does not have one.

## URLs that keep working

`public/` is copied into `dist/` unchanged, and `dist/` is published at `/`.

| URL | What it is |
| --- | --- |
| `/` | Current homepage |
| `/generic.html`, `/elements.html`, `/blog/indexblog.html` | Meta refresh back to `/` |
| `/blog/pages/referenceforcpalgo.html` | Preserved algorithm notes |
| `/SunDayNights.jpg`, `/favicon.ico`, `/images/…` | Files from the previous site |

`/blog/assets/…` stays in place because the notes page links to it with a relative path. The old HTML5UP `/assets/` directory is not in `public/`, so those template URLs are not part of this site.

`robots.txt` allows `/` and disallows `/pr-`, which is the preview prefix.

## Pull request previews

A preview is a second copy of the built site at:

`https://prasadganesh.github.io/pr-<number>/`

Example: pull request 12 is `https://prasadganesh.github.io/pr-12/`.

No paid host and no extra secret are used. Previews are folders on the same Pages site.

1. `.github/workflows/preview.yml` builds the pull request, rewrites root-relative links and the site origin so they start with `/pr-<number>/`, and uploads the result. It also posts or updates a comment with the preview URL. The comment is marked `<!-- pages-preview -->` so later runs edit the same comment.
2. `.github/workflows/preview-publish.yml` runs after that workflow, from the workflow file on `master`. It stores the build in `pr-<number>/` on the `gh-pages-previews` branch, rebuilds production from `master`, and deploys both together with `actions/deploy-pages`. Closing the pull request deletes that directory on the next publish.
3. Preview HTML is `noindex`. The root `robots.txt` disallows `/pr-`.

The publish workflow is the file on `master`. It does not run for this pull request until the workflow has been merged to `master`. Fork pull requests are not published, because that would put someone else's HTML on the public site.

The comment still appears as soon as the preview workflow runs. If the Pages source is not GitHub Actions yet, the comment gives the settings path above and the URL is not live.

`gh-pages-previews` is storage. GitHub does not serve that branch. User sites cannot publish a second branch, and `actions/deploy-pages` replaces the whole site, so production and previews are uploaded as one artifact.

## Checks on pull requests

`.github/workflows/ci.yml` runs on every pull request:

- `npm run check` (`astro check`)
- `npm run build` and `npm run budget`
- The preserved URLs above are present, and the built homepage and sitemap use `https://prasadganesh.github.io`
- The preview rewriter prefixes a copy and leaves the production `dist/` on `/`
- [lychee](https://github.com/lycheeverse/lychee) checks links in `dist/`. Same-site URLs are read from `dist/` instead of the live host. LinkedIn and Medium are excluded in `.lychee.toml` because those hosts block anonymous checkers.
- Lighthouse CI records a mobile run and does not fail the job

## Custom domain later

Nothing here attaches a domain. When you have one:

1. Change `siteOrigin` in `site-origin.mjs` to `https://example.com` with no trailing slash. Canonical, Open Graph, sitemap, and preview links follow that value. Leave the Astro base path unset so it stays `/`.
2. Point the same origin at the static files that Astro does not rewrite:
   - `public/robots.txt` (`Sitemap:`)
   - `public/generic.html`, `public/elements.html`, and `public/blog/indexblog.html` (canonical)
   - `public/blog/pages/referenceforcpalgo.html` (`og:image` and `og:url`)
   The link checker remap follows `site-origin.mjs`. The preserved HTML files above do not.
3. In the DNS host, before or with the GitHub setting:
   - **Subdomain** such as `www.example.com`: CNAME to `prasadganesh.github.io`.
   - **Apex** such as `example.com`: A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Optional AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`. An ALIAS or ANAME to `prasadganesh.github.io` can replace the A records when the DNS host supports it.
4. Open **Settings → Pages → Custom domain**, enter the domain, and save. After DNS resolves and GitHub issues the certificate, turn on **Enforce HTTPS**.

Do not add a `public/CNAME` file. With Source set to GitHub Actions, GitHub ignores a CNAME file in the published site, and the assemble step deletes one if it appears. The custom-domain field in Pages settings is the switch. The DNS record for a subdomain is the CNAME.

Previews stay at `/pr-<number>/` on whatever origin `siteOrigin` names. After the domain is attached, pull request 12 is `https://example.com/pr-12/`.

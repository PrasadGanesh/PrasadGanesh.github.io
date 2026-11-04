# Ganesh Prasad

Static portfolio. Astro builds the site published to GitHub Pages. See [docs/DEPLOY.md](docs/DEPLOY.md).

```bash
npm ci
npm run dev
npm run build
npm run preview
```

## Where to edit

- Visual tokens (color, type, space, motion): `src/styles/tokens.css`
- Case studies: `src/content/case-studies/`
- Essays: `src/content/essays/`
- Profile links: `src/data/site.ts`
- Live demo widget: `public/widget/` (`soiling-widget.js`, `soiling-widget.css`, `data.json`)
- Hero flow: `src/components/SystemFlow.astro`
- Palette: `src/styles/tokens.css` is the B2 handoff (dark and light). Fraunces and Inter are self-hosted subsets. The header sun/moon toggle stores the choice in `localStorage`. With no saved choice, the boot script follows `prefers-color-scheme`.

## Checks

`npm run budget` fails when homepage JavaScript exceeds 50KB gzip. Pull requests run `astro check`, the production build, a link check, and Lighthouse CI. Lighthouse assertions are warnings and do not fail the job.

## Old URLs

`/generic.html`, `/elements.html`, and `/blog/indexblog.html` redirect home. `/blog/pages/referenceforcpalgo.html` is the preserved algorithm-notes page. Images, the favicon, and `SunDayNights.jpg` stay at their previous paths.

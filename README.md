# Ganesh Prasad

Static portfolio. Astro builds a GitHub Pages-ready `dist/` directory. This repo does not deploy; publishing `dist/` is handled separately.

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
- Themes: `data-theme="b"` (night-sky editorial, current) or `data-theme="a"` (control-room console) in `src/layouts/Base.astro`. Colours are drafts in `src/styles/tokens.css`.

The live demo loads the widget with a plain `<script is:inline>`. Its colours read the tokens in `src/styles/tokens.css`.

## Checks

`npm run budget` fails when homepage JavaScript exceeds 50KB gzip. Pull requests also run a link check and Lighthouse CI. Lighthouse assertions are warnings and do not fail the job.

## Old URLs

`/generic.html`, `/elements.html`, and `/blog/indexblog.html` redirect home. `/blog/pages/referenceforcpalgo.html` is the preserved algorithm-notes page. Images, the favicon, and `SunDayNights.jpg` stay at their previous paths.

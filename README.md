# NeoSignal — Premium Telegram Channel Hub

A fast, single-page, static website for showcasing Telegram channels — built with
plain HTML, CSS, and JavaScript. No frameworks, no build tools, no backend,
no database. Works out of the box on GitHub Pages.

## Files

```
index.html   → page structure, SEO/Open Graph tags, favicon
style.css    → all styling (cyberpunk dark theme, glassmorphism, animations)
script.js    → channel data, category filter logic, particle background, UI behavior
README.md    → this file
```

---

## Editing your channel cards

Open **`script.js`** and find the `CHANNELS` array near the top. Each channel
is one object in the array:

```js
{
  name: "CineVault 4K",
  description: "Fresh movie drops in 4K/1080p with fast, direct download links.",
  image: "",                 // URL or path to a logo image, e.g. "assets/cine.png"
  members: "128K",           // any display string: "890", "12.4K", "1.2M"
  link: "https://t.me/",     // your real Telegram invite link
  category: "movies",        // must match a category id below
},
```

**To add a channel:** copy an existing object, paste it inside the array
(before the closing `];`), and edit the fields.

**To remove a channel:** delete its whole `{ ... },` block.

**To change the image:** set `image` to a URL (e.g. `"https://.../logo.png"`)
or a local path (e.g. `"assets/mychannel.png"` — put the file in an `assets/`
folder next to `index.html`). If you leave `image: ""`, a placeholder icon is
shown automatically.

### Categories

Categories are defined separately in the `CATEGORIES` array, just below
`CHANNELS`:

```js
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" },
  { id: "anime", label: "Anime" },
  { id: "games", label: "Games" },
  { id: "education", label: "Education" },
  { id: "others", label: "Others" },
];
```

To add a new category, add a `{ id: "...", label: "..." }` entry here, then
use that same `id` as the `category` value on any channel. The filter bar
updates automatically — no other code needs to change.

---

## Customizing the look

All colors, fonts, and spacing live at the top of **`style.css`** under
`:root`:

```css
:root {
  --bg: #0b0b0b;        /* page background */
  --gold: #ffd700;      /* primary neon accent */
  --blue: #00c8ff;      /* secondary neon accent */
  ...
}
```

Change these values to re-theme the whole site consistently.

### Logo & favicon

- The header/footer logo is a plain circular div with a letter in it
  (`.logo-ring` in `index.html`). Replace the `<span class="logo-glyph">N</span>`
  with an `<img>` tag if you have a real logo image.
- The favicon is an inline SVG data URI in the `<head>` of `index.html`
  (search for `rel="icon"`). Replace it with a link to your own favicon file,
  e.g. `<link rel="icon" href="assets/favicon.png" />`.

### Open Graph preview image

For link previews (Discord, Twitter, WhatsApp, etc.), update the `og:image`
and `twitter:image` tags in `index.html` to point at a real image
(1200×630px recommended), and update `og:url` / `canonical` to your live URL
once deployed.

---

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Add all four files (`index.html`, `style.css`, `script.js`, `README.md`)
   to the repository root — or to a `/docs` folder if you prefer.
3. Commit and push:
   ```bash
   git init
   git add .
   git commit -m "Initial NeoSignal site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
4. On GitHub, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Select the **`main`** branch and the **`/ (root)`** folder (or `/docs` if
   that's where you put the files), then click **Save**.
7. GitHub will publish your site at:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```
   It usually takes 30–60 seconds for the first deploy to go live.

No further configuration is needed — the site has no server, no API, and no
build step, so every push to the branch you selected will update the live
site automatically.

---

## Notes

- All channel/category data lives in plain JavaScript arrays in `script.js`,
  so anyone comfortable editing text can maintain the site — no coding
  framework knowledge required.
- The animated background is a lightweight `<canvas>` particle system with
  no external libraries.
- The site respects `prefers-reduced-motion` for visitors who've asked their
  OS/browser to minimize animation.
- Fonts (`Orbitron`, `Rajdhani`) load from Google Fonts via a `<link>` tag —
  if you need a fully offline/self-hosted version, download the font files
  and update the `@font-face`/`<link>` references accordingly.

# Client Work

A small portfolio of front-end design pieces. Each is self-contained — open the
HTML files directly in a browser (no build step, no server).

**Live preview:** [xzycd.github.io/client-work](https://xzycd.github.io/client-work/)

The root portfolio index uses `landing.css` and `landing.js` for its responsive
project chapters, custom previews, viewport reveals, pointer depth, active-work
counter, and reduced-motion behavior.

## Projects

### `spatial-field/`
Interactive creative-direction instrument built with native HTML, CSS, JavaScript,
and Three.js. Visitors shape a live spatial object through Direction, Structure,
Build, and Delivery, then copy the resulting recipe or export a still.

- [`index.html`](https://xzycd.github.io/client-work/spatial-field/) - live page
- `field.js` - WebGL scene, topology changes, material system, and export logic
- `styles.css` - responsive interface, light and dark themes, and reduced-motion treatment
- `assets/` - generated material studies used across the experience and as a static fallback

### `meridian-studio/`
Editorial-brutalist landing page for a fictional independent design studio.
High-contrast Didone display (Fraunces) on warm paper, one vermilion accent,
a numbered work index with hover interaction.

- [`index.html`](https://xzycd.github.io/client-work/meridian-studio/) — live page
- `DESIGN-DNA.md` — the locked art-direction spec (type, colour, motion, rules)

### `aether-retreats/`
Cinematic landing page for a architectural-retreat brand, in three
scroll treatments built around one AI-generated 4K hero and a motion clip.

- [`cinematic.html`](https://xzycd.github.io/client-work/aether-retreats/cinematic.html) — full-screen video background, **auto-plays on load** (start here to see motion)
- [`scroll-sequence.html`](https://xzycd.github.io/client-work/aether-retreats/scroll-sequence.html) — Apple-style **scroll-scrubbed frame sequence**: scroll to advance the scene frame by frame. Self-contained (71 frames embedded).
- [`parallax.html`](https://xzycd.github.io/client-work/aether-retreats/parallax.html) — CSS scroll effects: hero zoom, pinned narrative, horizontal gallery
- `assets/hero.jpg` — 4K hero still (optimised)
- `assets/motion.mp4` — 5s cinematic clip (source of the frame sequence)

### `_tools/`
- `build_sequence.py` — extracts frames from `motion.mp4` and bakes the
  self-contained scroll-sequence + cinematic HTML files.

## Notes
- Typography loads from Google Fonts (Fraunces, Cormorant Garamond, Jost, Archivo, IBM Plex Mono, Martian Mono).
- All pages respect `prefers-reduced-motion` and re-compose for mobile.
- Imagery was generated with an AI image/video model; treat as mockup assets.

## Browser tip
`scroll-sequence.html` does **not** play by itself — you scroll to drive it.
For local `file://` viewing, Chrome is the most permissive with the embedded media.

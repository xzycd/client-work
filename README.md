# Client Work

A small portfolio of front-end design pieces. Each is self-contained — open the
HTML files directly in a browser (no build step, no server).

## Projects

### `meridian-studio/`
Editorial-brutalist landing page for a fictional independent design studio.
High-contrast Didone display (Fraunces) on warm paper, one vermilion accent,
a numbered work index with hover interaction.

- `index.html` — the page
- `DESIGN-DNA.md` — the locked art-direction spec (type, colour, motion, rules)

### `aether-retreats/`
Cinematic landing page for a architectural-retreat brand, in three
scroll treatments built around one AI-generated 4K hero and a motion clip.

- `cinematic.html` — full-screen video background, **auto-plays on load** (start here to see motion)
- `scroll-sequence.html` — Apple-style **scroll-scrubbed frame sequence**: scroll to advance the scene frame by frame. Self-contained (71 frames embedded).
- `parallax.html` — CSS scroll effects: hero zoom, pinned narrative, horizontal gallery
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

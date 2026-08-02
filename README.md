# Client Work

A small portfolio of front-end design pieces. Each is self-contained — open the
HTML files directly in a browser (no build step, no server).

**Live preview:** [xzycd.github.io/client-work](https://xzycd.github.io/client-work/)

The root portfolio index uses `landing.css` and `landing.js` for its kinetic
"Live Work" hero, responsive canvas signal field, interactive five-project
index, custom previews, scroll choreography, pointer depth, page transitions,
active-work counter, and reduced-motion behavior.

## Projects

### `spatial-field/`
Interactive creative-direction instrument built with native HTML, CSS, JavaScript,
and Three.js. Visitors shape a live spatial object through Direction, Structure,
Build, and Delivery, then copy the resulting recipe or export a still.

- [`index.html`](https://xzycd.github.io/client-work/spatial-field/) - live page
- `field.js` - WebGL scene, topology changes, material system, and export logic
- `styles.css` - responsive interface, light and dark themes, and reduced-motion treatment
- `assets/` - generated material studies used across the experience and as a static fallback

### `haul-type/`
Specimen page for HAUL, a variable grotesque. Bone ground, true black, one hot
magenta. The hero word is fitted to the measure and both axes are driven by scroll,
so it starts compressed and heavy and opens out wide and light as you move. Below
that: a weight waterfall, a live tester with width and weight sliders, a clickable
character set, and nine named styles that load themselves into the tester.

- [`index.html`](https://xzycd.github.io/client-work/haul-type/) — live page
- `DESIGN-DNA.md` — the art-direction spec, including why two earlier versions of
  this slot were scrapped

HAUL is not a real typeface; the page is set in Archivo, which stands in for it.

### `acid/`
A single-colour system delivered as its own specification. `#D6FF00` covers the
whole surface and black does the reading; there is no third value. Black masses
rise through the page on scroll and the type reverses itself along the moving
edge — it is painted once in the colour and composited in `difference`, so over
the colour it resolves to black and over black it resolves to the colour.

Every figure on the page is measured in the browser at runtime rather than typed
in: hex, RGB, linear sRGB, HSL, OKLCh, relative luminance, and the WCAG contrast
ratios. The contrast instrument drives lightness and hue in OKLCh with chroma
pinned to the sRGB gamut edge, re-drenches the entire document live, and says so
when the value you land on stops passing.

- [`index.html`](https://xzycd.github.io/client-work/acid/) — live page

### `aether-retreats/`
Cinematic landing page for a architectural-retreat brand, in three
scroll treatments built around one AI-generated 4K hero and a motion clip.

- [`cinematic.html`](https://xzycd.github.io/client-work/aether-retreats/cinematic.html) — full-screen video background, **auto-plays on load** (start here to see motion)
- [`scroll-sequence.html`](https://xzycd.github.io/client-work/aether-retreats/scroll-sequence.html) — Apple-style **scroll-scrubbed frame sequence**: scroll to advance the scene frame by frame. Self-contained (71 frames embedded).
- [`parallax.html`](https://xzycd.github.io/client-work/aether-retreats/parallax.html) — CSS scroll effects: hero zoom, pinned narrative, horizontal gallery. Still live, but no longer one of the five on the index; `acid/` took that slot.
- `assets/hero.jpg` — 4K hero still (optimised)
- `assets/motion.mp4` — 5s cinematic clip (source of the frame sequence)

### `_tools/`
- `build_sequence.py` — extracts frames from `motion.mp4` and bakes the
  self-contained scroll-sequence + cinematic HTML files.

## Notes
- Typography loads from Google Fonts (Fraunces, Cormorant Garamond, Jost, Archivo, Chivo, IBM Plex Mono, Martian Mono).
- All pages respect `prefers-reduced-motion` and re-compose for mobile.
- Imagery was generated with an AI image/video model; treat as mockup assets.

## Browser tip
`scroll-sequence.html` does **not** play by itself — you scroll to drive it.
For local `file://` viewing, Chrome is the most permissive with the embedded media.

## License

This is publicly viewable, source-available portfolio work, not open-source
software. All rights are reserved: reuse, copying, modification, redistribution,
and deployment are not permitted without prior written permission. See
[`LICENSE.md`](LICENSE.md) for the full terms. Third-party components remain
subject to their respective licenses.

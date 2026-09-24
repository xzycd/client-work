# Client Work

A small portfolio of front-end design pieces. Each is self-contained — open the
HTML files directly in a browser (no build step, no server).

**Live preview:** [xzycd.github.io/client-work](https://xzycd.github.io/client-work/)

The root index (`index.html`, `landing.css`, `landing.js`) is a neutral grey
page whose only colour comes from the work. The top is a strip of six plates:
one opens wide and the strip cycles through them, and hovering or focusing a
plate takes over. The six-bar mark in the header tracks which piece is in view, and
each term in the opening sentence opens its own plate.
Below the strip, each piece has a preview built from its own page, and clicking
through wipes to that page's ground colour before it loads. Brand decisions and
their reasons are in [`DESIGN-DNA.md`](DESIGN-DNA.md).

The first edition of the index (July 2026: dark, kinetic "Live Work" hero) is
kept at [`v1/`](https://xzycd.github.io/client-work/v1/) and linked from the
header.

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
Cinematic landing page for an architectural-retreat brand, in three
scroll treatments built around one AI-generated 4K hero and a motion clip.

- [`cinematic.html`](https://xzycd.github.io/client-work/aether-retreats/cinematic.html) — full-screen video background, **auto-plays on load** (start here to see motion; it stays paused for visitors who prefer reduced motion)
- [`scroll-sequence.html`](https://xzycd.github.io/client-work/aether-retreats/scroll-sequence.html) — Apple-style **scroll-scrubbed frame sequence**: scroll to advance the scene frame by frame. Self-contained (71 frames embedded).
- [`parallax.html`](https://xzycd.github.io/client-work/aether-retreats/parallax.html) — CSS scroll effects: hero zoom, pinned narrative, horizontal gallery. Still live, but no longer on the index; `acid/` took that slot.
- `assets/hero.jpg` — 4K hero still (optimised)
- `assets/motion.mp4` — 5s cinematic clip (source of the frame sequence)
- `assets/sequence-end.jpg` — last-light frame of the clip, used as the index poster for the sequence

### `low-water/`
Identity for Low Water, a fictional oyster farm in Eastport, Maine, that can only
work when the tide is out. The page is a tide gauge. The real water level at
Eastport is predicted in the browser, and everything below the waterline is
redrawn in kelp and set in italic, the way charts letter the sea. A seven-day
dial lets you drag the tide forward. Below it are the week's low waters, a
harvest tag printed with the curve of the day you land on, and the three rules
of the identity.

- [`index.html`](https://xzycd.github.io/client-work/low-water/) — live page
- `DESIGN-DNA.md` — the brand rules and how the tide is computed and checked

The prediction uses 31 of NOAA's harmonic constituents for Eastport (station
8410140). Checked against NOAA's published high and low waters for September to
December 2026, the largest error was 4 minutes and 9 cm.

### `_tools/`
- `build_sequence.py` — extracts frames from `motion.mp4` and bakes the
  self-contained scroll-sequence + cinematic HTML files. Change the page
  templates here as well as in the baked files.

## Notes
- Typography loads from Google Fonts (Host Grotesk, Cormorant Garamond, Jost, Archivo, Chivo, Martian Mono, DM Mono, Manrope, Fragment Mono) and Fontshare (Boska, Zodiak).
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

# Client Work

A small portfolio of front-end design pieces. Each is self-contained — open the
HTML files directly in a browser (no build step, no server).

**Live preview:** [xzycd.github.io/client-work](https://xzycd.github.io/client-work/)

The root index (`index.html`, `landing.css`, `landing.js`) is a neutral grey
page whose only colour comes from the work. The top is a strip of eight plates:
one opens wide and the strip cycles through them, and hovering or focusing a
plate takes over. The eight-bar mark in the header tracks which piece is in view, and
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
magenta. The hero word is fitted to the measure and you move it by hand: pull the
word, or drag a puck across a plot of the design space where the nine named styles
sit as points. Let go and it carries on and settles on the style the flick was
heading for. Below that: a weight waterfall, a live tester on its own plot, a
clickable character set, and the nine styles, which send the tester to themselves.

- [`index.html`](https://xzycd.github.io/client-work/haul-type/) — live page
- `DESIGN-DNA.md` — the art-direction spec, including why two earlier versions of
  this slot were scrapped

HAUL is not a real typeface; the page is set in Archivo, which stands in for it.

### `acid/`
A single-colour system delivered as its own specification. `#D6FF00` covers the
whole surface and black does the reading; there is no third value. Black masses
rise through the page on scroll, the black slab in the hero can be grabbed and
thrown, and the type reverses itself along every moving edge — it is painted once
in the colour and composited in `difference`, so over the colour it resolves to
black and over black it resolves to the colour.

Every figure on the page is measured in the browser at runtime rather than typed
in: hex, RGB, linear sRGB, HSL, OKLCh, relative luminance, and the WCAG contrast
ratios. The contrast instrument drives lightness and hue in OKLCh with chroma
pinned to the sRGB gamut edge (hue is a tape you can spin), re-drenches the
entire document live, and says so when the value you land on stops passing.

- [`index.html`](https://xzycd.github.io/client-work/acid/) — live page

### `nebelmeer/`
A made-up studio that builds a few houses above the sea of fog in Valais. It was
called Aether until 2026-11-24, when it got a specific name and stopped inlining
its media.

- [`scroll-sequence.html`](https://xzycd.github.io/client-work/nebelmeer/scroll-sequence.html) — the dawn film scrubbed by scroll, 61 frames blended through `shared/scrub-film.js`
- [`cinematic.html`](https://xzycd.github.io/client-work/nebelmeer/cinematic.html) — the same film full screen; it autoplays unless the visitor prefers reduced motion
- [`parallax.html`](https://xzycd.github.io/client-work/nebelmeer/parallax.html) — CSS scroll effects; not linked from the index
- `assets/dawn.mp4` — the 5 s film (0.6 MB); `assets/first.webp` — its first frame; `assets/hero.jpg`/`.webp` — the 4K hero still
- `DESIGN-DNA.md`

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

### `sakai/`
An amber workshop in Nida that starts on a fly in polished Baltic amber. Scrolling
melts the stone back into pine resin, shows the drop closing over the fly, and
lands on the beach where the piece washed up, with a counter rolling from today
to 44,000,000 years ago and back. On a desktop a loupe follows the pointer over
the specimen. Sakai is made up.

- [`index.html`](https://xzycd.github.io/client-work/sakai/) — live page
- `sakai.js` — the timeline, the counter, the loupe and the sun flare into the shore
- `frames/` — 2 × 61 WebP frames; `img/` — 2400 px stills, a 2688 px still for the loupe, the index preview loop
- `DESIGN-DNA.md`, `media/look.md`, `media/manifest.json`

### `shared/`
- `scrub-film.js` — the frame loader and canvas painter behind Sakai and Suodis:
  loads frames coarse to fine, six at a time, fits them to the screen, blends
  between neighbours and draws the 2400 px still over the first frames of a shot.

### `suodis/`
A smoke sauna on a frozen lake in Dzūkija, Lithuania, told as one scroll. Four
short films play under the scroll on a canvas: smoke leaving the walls, the soot
room, water on the stones, the ice hole. You enter through the lit window, and a
thermometer on the right goes from −14 °C outside to 86 °C inside and down to
+1 °C in the lake. Suodis is made up.

- [`index.html`](https://xzycd.github.io/client-work/suodis/) — live page
- `suodis.js` — the timeline, the gauge, the three transitions and the optional sound loop
- `frames/` — 4 × 61 WebP frames at 1280 px; `img/` — 2400 px stills and the index preview loop
- `DESIGN-DNA.md` — brand rules; `media/look.md` and `media/manifest.json` — shot direction, models and prompts


### `small-mercy/`
A hot sauce page with one stove dial and no images. Turning the dial heats the
page from cream to almost black, melts the name into drips, swaps between three
sauces and, at the top, pops the bottle's cap. Small Mercy is made up.

- [`index.html`](https://xzycd.github.io/client-work/small-mercy/) — live page
- `mercy.js` — heat, colour, the melt filter, the drips and the dial
- `DESIGN-DNA.md`


## Notes
- Typography loads from Google Fonts (Host Grotesk, Shrikhand, Schibsted Grotesk, Cormorant Garamond, Jost, Archivo, Chivo, Martian Mono, DM Mono, Manrope, Fragment Mono) and Fontshare (Boska, Zodiak).
- All pages respect `prefers-reduced-motion` and re-compose for mobile.
- Imagery was generated with an AI image/video model; treat as mockup assets.

## Browser tip
For local `file://` viewing, Chrome is the most permissive with the embedded media.

## License

This is publicly viewable, source-available portfolio work, not open-source
software. All rights are reserved: reuse, copying, modification, redistribution,
and deployment are not permitted without prior written permission. See
[`LICENSE.md`](LICENSE.md) for the full terms. Third-party components remain
subject to their respective licenses.

# DESIGN DNA — MERIDIAN

Spec piece. Fictional independent design studio, treated as a real client brief.

## Why this was rebuilt

The first version was editorial-brutalist: Fraunces display on warm paper, IBM Plex
Mono labels, hairline rules, numbered section markers, one vermilion accent, and no
imagery at all. It was made to avoid the obvious AI landing page — dark hero, gradient
blob, centered sans, three icon cards — and it did avoid that one. Then it landed in
the next reflex down, which by 2026 is more saturated than the thing it was dodging:
display serif plus small mono labels plus ruled separators plus monochrome restraint.
Fraunces and IBM Plex Mono are both training-data defaults. A warm near-white body is
the default "tasteful" background. And a studio portfolio with zero images reads as
unfinished, not restrained.

So the lane changed, not just the palette.

## North star

A press check. The moment a designer stands at the machine with the printer, pulls a
sheet, and looks at it under a loupe before committing to 40,000 more. Ink, not paper.
The work is the subject; the page is the light on it.

## Colour

Committed strategy. One saturated colour carries the two ends of the page.

    --ink        oklch(0.168 0.024 264)   wet-ink black, blue cast
    --ink-raised oklch(0.221 0.026 264)   hovered row
    --ink-line   oklch(0.322 0.030 264)   hairlines
    --blue       oklch(0.430 0.232 267)   THE colour — drenches hero and contact
    --blue-deep  oklch(0.318 0.176 267)   CTA label, shadow hue
    --blue-line  oklch(0.560 0.190 267)   active accents
    --chalk      oklch(0.972 0.006 264)   type on ink
    --chalk-dim  oklch(0.780 0.016 264)   secondary type on ink

No warm neutrals anywhere. The off-whites carry a faint blue cast, never a warm one.
Measured contrast: body on ink 9.6:1, body on blue 8.5:1, dimmed labels on blue 5.8:1.
All above 4.5:1.

Art direction changes by section on purpose: blue drench at the hero, ink through the
work and practice, blue drench again at the contact. Energy rises toward the one thing
we want the visitor to do.

## Typography

Schibsted Grotesk, variable, 400 to 900. One family, doing everything.

A studio that draws typefaces should be able to hold a page with a single family and
real weight contrast rather than reaching for a second one. Display is 900 at
clamp(2.5rem, 6.4vw, 6rem), tracking -0.035em, leading 0.98. Body is 400 at 16 to 18px,
measure capped around 52ch.

Tabular figures are scoped to the clocks and project numbers only. Setting them on
`body` also gives commas and periods digit-width advances, which renders as a stray
space before every comma — it cost about 13px across a short line before it was caught.

## Space and shape

Max width 1480. Gutter clamp(20px, 5vw, 72px). Radius 0 everywhere. Hairline rules at
`--ink-line`. Work rows alternate image side for rhythm rather than stacking into a
card grid. The practice statement is sticky so the long service list does not strand a
column of empty space beside it.

## Imagery

Six licensed photographs, all from print production: a four-colour tint chart under a
loupe, a concrete institution, folded black paper, a type specimen spread, letterpress
sorts, a Pantone fan. Every CDN URL requests an explicit crop so the delivered file
matches the declared width and height and the CSS box — no layout shift from images.

At rest each project plate is washed to one colour (`mix-blend-mode: color` at 0.74).
That single treatment is what makes six unrelated stock photographs read as one
art-directed set instead of six scraped images. Touch keeps the wash at 0.58, since
there is no hover to trade it for.

## Motion — dial 1, calm

Portfolio and premium sit at calm, not full send. Restraint is the arousal here.

**The signature, one only:** hovering a work row lifts the ink. The colour wash fades
out, a squeegee travels the plate left to right, the image scales 1.055, the row
raises, the project name goes blue. It is a proof being pulled to full colour, and it
delivers exactly what the click promises.

Everything else is floor: hover, press and focus-visible states on every interactive
element; staggered reveals grouped per list at 70ms; a halftone screen over the hero at
0.10 opacity, felt rather than seen. Only `transform` and `opacity` are animated, plus
`box-shadow` on the single CTA so the surface physically depresses on press.

Reveals are strictly additive. Nothing is hidden until JS has confirmed it is running,
the document is visible, and the element started below the fold — and everything is
released the moment the page is backgrounded, printed, or unloaded. The first build got
this wrong and rendered blank in a hidden tab, which is also what a crawler sees.

## Voice

Plain, specific, occasionally blunt. Numbers instead of adjectives: 240 components,
840 glyphs, 900 stores, four or five clients a year, two working days. The studio is
allowed an opinion ("Most brand systems fall apart in implementation") and allowed to
undercut itself ("Not out of principle. There are six of us"). No aphorisms, no
negative parallelism, no rule-of-three cadence, no "considered objects."

## Banned in this project

Warm paper or cream grounds · Fraunces, Cormorant, Playfair, IBM Plex, Space Grotesk,
Inter, DM anything · mono as decoration · numbered eyebrows above every section ·
repeated uppercase tracked kickers · display type above 6rem · tracking tighter than
-0.04em · icon card trios · gradient text · glassmorphism · custom cursors that hide
the real one · zero imagery · manufactured urgency.

# DESIGN DNA — HAUL

A specimen page for a variable typeface. Spec piece: HAUL is not a real
release, and the page is set in Archivo, which stands in for it.

## What this replaced, and why

This slot held two earlier designs. Both failed, and the reasons are worth keeping.

**Version one** was editorial-brutalist: Fraunces on warm paper, mono labels,
numbered section markers, no images. It was built to avoid the obvious AI landing
page and it did — then landed in the next reflex down, which is now the more
saturated one. Fraunces and IBM Plex Mono are training-data defaults. A warm
near-white body is the default "tasteful" ground.

**Version two** moved to an ink-black studio page with a reflex-blue drench and
stock photography. Better craft, same underlying problem: it was still a fictional
studio with invented client names — Meridian, Halcyon, Atlas, Northwind, Superbloom
— and that naming layer is one of the loudest tells there is. Current trend reporting
also lists stock hero photography and static typography as dated, and the page leaned
on both.

So the third version drops the fake studio entirely. No invented brand, no invented
clients, no photography. A typeface specimen needs none of it: the letterforms are
the content, and the genre runs on almost no prose.

## Colour

    --bone     #F2F2F0   ground, chroma 0 — deliberately not warm cream
    --black    #0A0A0A   type
    --mag      #FF2E88   fields, fills, focus rings, hovers
    --mag-ink  #D6006A   the same accent, darkened for small text
    --dim      #5F5F5C   secondary labels

Two magentas, for one measured reason. `#FF2E88` on bone is **3.12:1**, which fails
an 11px label. `#D6006A` measures **4.61:1** and carries all small accent text.
The bright one only ever sits against black, or carries black on top of it — black
on magenta is 5.66:1. Black on bone is 17.66:1; dim on bone is 5.72:1.

The accent shouts exactly once, in the closing field. Everywhere else it is a
1px rule, a slider thumb, or a fill.

## Typography

Archivo, variable, width 62–125 × weight 100–900. One family, nothing else — which
is the only honest choice for a page whose subject is a typeface.

Metadata is set in the same family at 11px, 600 weight, 0.13em tracking. No monospace:
mono here would be costume, and the family already has the range.

## The signature

The page is a map of its own design space. Width runs across, weight runs up, and
the nine named styles sit on it as points where they really are. That plot is the
specimen's one control, and it appears twice: under the hero word and under the
tester.

Until 2026-11-24 the hero axes were driven by scroll. That made the word move, but
the reader never touched it. Now the word is held, not watched:

- **Grab the word and pull.** Sideways is width, up is weight. The value moves by
  how far the pointer moves from where it grabbed, so nothing jumps on contact.
  Touch screens skip this, because a vertical drag on the word would fight the page
  scroll; there the plot below does the job.
- **Or drag the puck across the plot.** Same physics, absolute position.
- **Letting go hands the hand's velocity to two springs,** one per axis, so a
  diagonal flick keeps both speeds. The release point is projected forward with the
  same exponential decay scrolling uses, and the puck settles on the named style
  nearest where the flick was heading. Overshoot only after a throw; a slow release
  settles critically damped.
- **Past an axis limit the puck rubber-bands.** The type itself stays clamped to
  the real axis range.
- **While held, the outline behind the word is the style you will land on,** drawn
  at its own fitted size and turned magenta, with its name under the word. At rest
  it shows the far corner of the space, as before.
- **Two ordinary range inputs sit under each plot,** visually hidden. Keyboard and
  screen-reader users get width and weight as sliders with spoken style names.

Fitting matters more than it sounds. The size is recomputed from the measured text so
the word sits exactly edge to edge whatever the axes are doing — a condensed cut
therefore stands tall and a wide cut sits short, both full-bleed. Every (element,
width, weight) triple is measured once at a reference size and cached as a ratio pair.
The stage is held at the height of the tallest cut, so the plot under the hand never
moves while the word changes. A height cap sits alongside the width fit, so a short
landscape window cannot push the plot off screen.

## Motion

Pointer-driven axes on the hero and the tester. Hover morphs on the waterfall, the
glyph grid, and the styles table, and pointing at a style sends the tester's puck
there on a spring. Staggered reveals on the waterfall only. One load moment: the word
springs from Extended Light to Compressed Black once the font lands. Right angles,
1px rules, and no shadows anywhere — sharp geometry reads as engineered rather than
generated, which is the point.

Reveals are strictly additive: nothing is hidden until JS confirms it is running, the
document is visible, and the element started below the fold — and everything is
released the instant the page is backgrounded, printed, or unloaded. That release
writes inline styles with transitions off, because transitions freeze while a document
is hidden, which is the exact moment the release fires. An earlier build got this wrong
and rendered blank in a background tab.

Under reduced motion there is no load move and no spring: the word sits at Compressed
Black, and drags and keys land instantly.

## Interaction

The tester is an editable line over its own plot. Glyphs are buttons that load into
it; style rows send its puck to their point on hover, focus, or tap, and the row for
the current style stays lit. Paste is coerced to plain text and capped; Enter is
swallowed so the line stays a line.

## Banned in this project

Warm paper or cream grounds · invented studio and client names · stock photography ·
Fraunces, Cormorant, Playfair, IBM Plex, Space Grotesk, Inter, DM anything · monospace
as decoration · dot lattices and halftone grids · numbered eyebrows on every section ·
rounded corners · drop shadows · gradient text · glassmorphism · prose where a specimen
would do.

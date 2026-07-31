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

The hero word is fitted to the measure and both axes are driven by scroll. It starts
compressed and heavy and opens out wide and light as you move, with the pointer adding
a nudge on top so it is alive before you scroll at all.

Fitting matters more than it sounds. The size is recomputed from the measured text so
the word sits exactly edge to edge whatever the axes are doing — a condensed cut
therefore stands tall and a wide cut sits short, both full-bleed. Measuring text forces
layout, so every (element, width, weight) triple is measured once at a reference size
and cached as a width/height ratio pair; after that the scroll loop is pure arithmetic
and never touches layout. The cache clears on resize, and the fit re-runs once the
webfont actually lands.

A height cap sits alongside the width fit, so a short landscape window cannot push the
axis readout off screen.

## Motion

Scroll-driven axes on the hero. Hover morphs on the waterfall, the glyph grid, and the
styles table. Sliders drive the tester live. Staggered reveals on the waterfall only.
Right angles, 1px rules, and no shadows anywhere — sharp geometry reads as engineered
rather than generated, which is the point.

Reveals are strictly additive: nothing is hidden until JS confirms it is running, the
document is visible, and the element started below the fold — and everything is
released the instant the page is backgrounded, printed, or unloaded. That release
writes inline styles with transitions off, because transitions freeze while a document
is hidden, which is the exact moment the release fires. An earlier build got this wrong
and rendered blank in a background tab.

Under reduced motion the hero settles at one fixed, handsome position rather than
animating, and every transition collapses.

## Interaction

The tester is the centre of the page: an editable line plus width and weight sliders.
Glyphs are buttons that load into it; style rows load their own axis pair on hover,
focus, or tap. Paste is coerced to plain text and capped; Enter is swallowed so the
line stays a line.

## Banned in this project

Warm paper or cream grounds · invented studio and client names · stock photography ·
Fraunces, Cormorant, Playfair, IBM Plex, Space Grotesk, Inter, DM anything · monospace
as decoration · dot lattices and halftone grids · numbered eyebrows on every section ·
rounded corners · drop shadows · gradient text · glassmorphism · prose where a specimen
would do.

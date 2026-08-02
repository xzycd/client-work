# DESIGN DNA — ACID

A specification for a single-colour system, written as the thing it specifies.
The page is the colour; the document is the deliverable.

## Why this genre, and not a brand

This slot held Aether Parallax, which is still live at
`aether-retreats/parallax.html` and simply no longer one of the five on the
index.

The brief was a full acid drench: one saturated colour owning the entire
surface, type reversed out in black, the most aggressive option available. The
obvious way to build that is to invent a client for it — a festival, an energy
drink, a sneaker drop — because those are the accounts that commission drenched
pages. That is exactly the mistake [`../haul-type/DESIGN-DNA.md`](../haul-type/DESIGN-DNA.md)
records: the version of the HAUL slot before it was scrapped for being a
fictional studio with invented client names, which is one of the loudest tells
there is.

So there is no client here and nothing invented. A colour handover is a real
deliverable that real studios ship, it needs no brand attached, and a drench is
the honest way to present one, because the subject and the treatment are the
same object. Everything stated is either a fact about colour reproduction or a
number the page measures on itself.

## Colour

    --acid  #D6FF00   the surface
    --ink   #000000   type and masses

Two values, no third. Measured:

    #D6FF00 on #000000   18.16 : 1
    #D6FF00 on #FFFFFF    1.16 : 1
    #D6FF00 at 40% over white, on white    1.08 : 1

Black is pure `#000000` rather than the softer near-black used elsewhere in this
repo, because the reversal below is arithmetic and only lands exactly at zero.

There is no dimming and no tinting anywhere in the stylesheet. No `rgba()` on
type, no `opacity` for secondary text, no `color-mix`. Each would introduce a
third value and contradict the page's own argument, so hierarchy is carried
entirely by size, weight, and position. Rules are 1px and full strength.

This also rules out the usual escape hatch: inside a `difference` group, an
element at 50% alpha over the colour resolves to `acid × 0.5`, which is a muddy
olive rather than a tint. The constraint is enforced by the technique, not just
by discipline.

## Typography

Chivo, variable 300–900, for everything. Martian Mono at 400 and 600 for
measured values only, where it is doing a job rather than dressing up as
technical.

Chivo, not Archivo: the HAUL specimen next door is set in Archivo, and two
pieces in a five-piece index should not share a face. Chivo is a neutral
industrial grotesque that goes properly heavy, which is what a black hero word
on a fluorescent ground needs.

The hero word is fitted to the measure with a height cap alongside it
(`min(38.4vw, 50svh, 40rem)`), so a short landscape window cannot push the
readout and the scroll cue below the fold. Same problem and same fix as HAUL.

## The signature

Type is painted **once**, in `--acid`, and composited with
`mix-blend-mode: difference` against a black layer:

    over --acid   →  |acid − acid|  =  #000000
    over #000000  →  |0 − acid|     =  --acid

So the type reverses itself along a hard edge, pixel-exactly, and the black is
the only thing that ever moves. In the hero a black band sweeps across on scroll;
in the ink sections the black rises from the bottom as the section comes into
place, and the copy flips line by line as it passes.

Two properties of this are worth keeping:

**It survives the dial.** Both grounds resolve from the same custom property, so
when the instrument re-drenches the page the reversal stays correct at every
value without a single extra line.

**An isolated group needs a real backdrop.** `isolation: isolate` with a
transparent background gives `difference` nothing to work against, and the type
composites away to the ground it is sitting on — the whole hero rendered blank
the first time. Every blend group sets its own `background`.

The fixed rail is deliberately **not** blended. A difference-composited bar
cannot occlude what scrolls beneath it; it XORs with it, and body text ghosts
through as inverted shapes. Fixed chrome has to be opaque, so the rail commits
to one state.

## The instrument

Lightness and hue in OKLCh, with chroma pushed to the sRGB gamut edge by binary
search so every dial position is a fully saturated drench and never a pastel.
Dragging re-drenches the whole document, and the page reports what that did to
it.

Dial resolution is 0.001 L and 0.25° of hue, which is fine enough that the spec
value is exactly representable: L 0.937 / H 120.75 lands on `#D6FF00` on the
nose. At integer resolution it landed on `#D7FF3D` instead, and "return to spec"
that returns to nearly-the-spec is worse than no button.

Every figure on the page — hex, RGB, linear sRGB, HSL, OKLCh, relative
luminance, both contrast ratios, the screened-back ratio — is computed at
runtime from the value actually being painted. The static text in the markup is
the same set of numbers, so a render with no script tells the truth too.

The out-of-spec banner is the one thing painted outside the two-value system:
black on white, 21:1. An escape hatch rendered in the colour the visitor has
just broken is not an escape hatch.

## Motion

Arousal is set one notch below maximum: the aggression lives in the colour and
the reversal, not in bounce. Ease-out curves throughout, no overshoot, no
elastic, no celebration.

Reveals are additive, following the rule this repo learned the hard way: nothing
is hidden until script confirms it is running, the document is visible, and the
element started below the fold. Everything is released the moment the page is
backgrounded, printed, or unloaded, and that release writes inline styles with
transitions off, because transitions freeze while a document is hidden.

The tide needs no such guard. Its CSS default is the finished state, and because
`difference` always resolves to one of the two values, a section is legible at
every position the black can occupy.

Under reduced motion the black parks and the sections are simply solid. The
copy was rewritten so it never claims the reader has watched anything move.

## Banned in this project

Invented clients, brands, studios, or testimonials · photography · gradients ·
a third value in any form, including tints, screens, and opacity on type ·
rounded corners · drop shadows · glassmorphism · gradient text · monospace as
decoration rather than as data · tiny uppercase tracked eyebrows above every
section · numbered section markers used as scaffolding · Archivo, and the
Inter / Space Grotesk / IBM Plex / Fraunces / Cormorant family of
training-data defaults.

# DESIGN DNA — the index

The root page (`index.html`, `landing.css`, `landing.js`). It shows five pieces
and should look like none of them.

## What it replaced, and why

The previous index was a "Live Work" hero with kinetic letters, a canvas signal
field, a reticle cursor, a scroll-progress bar and a blinking green "All systems
online" dot. Every one of those is a stock HUD trope, and together they make a
page look generated. They also competed with the work: five pieces with strong
colours of their own sat under an index that had its own motion system.

All of it is gone. The index now does three things: it names the five pieces,
shows them, and gets out of the way on click.

## Colour

    --ground  #d9d9d5   neutral grey, no warmth, no tint
    --ink     #121211   13.24 : 1 on ground
    --ink-2   #3f3f3b    7.47 : 1
    --ink-3   #585854    5.05 : 1   smallest text, still AA

There is no accent. ACID is `#D6FF00`, FIELD has an orange rim light, and HAUL
has one magenta. Any accent on the index would argue with one of them. Grey is
the one ground all five read cleanly on, and it is the only choice that makes
the colophon line true: the only colour on the page is the work's own.

## Type

- **Boska** (Indian Type Foundry, served by Fontshare), variable 200–900 with
  an italic. Statement, titles and the transition label. It is narrow and high
  contrast with a sharp italic, so large settings stay light without looking
  thin. Newsreader held this role first and was replaced on 2026-09-23: side
  by side with nine other serifs at the real statement size, it read as the
  default editorial serif.
- **Host Grotesk** for everything functional: specs, captions, the header.

Neither font appears in any of the five pieces, so the index never looks like
a sixth piece.

Statement weight is 300, and 340 under 720px, where Boska's hairlines thin out
on 1× screens. Title tracking stops at `-0.012em`, because anything tighter
makes the "Fi" in *Field* collide.

## The mark is the index

The logo is five bars, and one of them is wide. It is the strip in miniature:
the wide bar is whichever piece is open or in view, and the header repeats that
piece's number and name. The favicon is the same five bars with the first one
open. There is no separate logotype to maintain.

## The strip

The first screen is five plates in a row. One is open (`flex-grow: 3.6`); the
others stay narrow and slightly desaturated. With a fine pointer the strip
cycles every 3.6 s until someone hovers or focuses a plate, then hands control
over, and it resumes when they leave. On a phone it becomes a swipe row of
equal plates with scroll snap, because opening on hover makes no sense there.

The plates are the pieces themselves: real stills for FIELD and the Aether
films, and CSS-drawn HAUL and ACID set in the same faces those pages use. A
plate caption drops its name when the plate is too narrow to hold it cleanly,
so nothing is ever truncated to "H…".

## Honest copy

Every figure on the index is checked against the piece it describes. The
sequence is 71 frames because the file embeds 71. The ACID ratio is 18.16 : 1
because that page measures 18.16 : 1. Plate copy is taken from the pages, not
written for the index. If a piece changes, the index changes with it.

## Transition

Clicking a piece wipes up a panel in that page's own ground colour, with its
name set in Boska, then navigates. The next page therefore arrives into
its own colour rather than cutting from grey. FIELD has a light theme, so it
also carries a light ground and uses it when the visitor prefers light.
Modified clicks, and visitors with reduced motion, get plain navigation.

## Motion

One material carries all of it: things arrive as a wipe from below. On load,
the statement rises out of a mask line by line, then the five plates wipe up
one after another, 85 ms apart, so the strip draws itself the way the mark
reads. The edition button fills from below on hover. Clicking a piece wipes
the destination ground up over the page.

Allowed besides that: the strip cycling, a reveal on first view, a few pixels
of scroll parallax on the copy, and a pointer shift on previews. Not allowed:
motion that runs without a reason, anything that blinks, and anything that
suggests the page is a live system. Under `prefers-reduced-motion` all of it
stops and everything is visible at once.

Measured on 2026-09-23 in headless Chromium at 1440×900: plate switches and
scrolling ran at a 16.7 ms p95 frame time, with no frame over 25 ms.

## First edition

The index this one replaced is kept at `v1/`, linked from the header as
"First edition" and wiping to its near-black ground on the way in. It keeps
its own look: dark ground, orange accent, Archivo and DM Mono. Only its facts
and its floor were fixed:

- The status dot is gone, and the edition date is there instead.
- The sequence is 71 frames, and its preview copy comes from the real page.
- The cinematic chip shows the real 5 s loop instead of a made-up timecode.
- No text is smaller than 11px. On a phone, the "Open" chip no longer covers
  the preview copy.

## Constraint

Every piece, the index included, opens as a plain file with no build step and
no server.

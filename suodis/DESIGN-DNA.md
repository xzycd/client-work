# DESIGN DNA — Suodis

A made-up smoke sauna on a frozen lake in Dzūkija, southern Lithuania. The page
is one session from outside to the ice hole, and scroll moves you through it.

## The idea

A smoke sauna has no chimney. The stove is fired for hours, the smoke leaves
through the walls, and the room keeps the heat and the soot. That gives the page
its order: smoke outside, soot inside, steam on the stones, cold water after.
The thermometer is the instrument. It reads −14 °C on the ice, climbs to 86 °C
as you pass through the window, holds there through the steam, and drops to
+1 °C in the lake.

## Colour

    --night  #0d1017   ground before and after the film
    --soot   #0e0c0b   inside the sauna
    --lamp   #f2994a   the one lit window: the mark, the chapter numbers, the heat
    --steam  #ece9e4   the white the steam turns into

The lamp colour is taken from the window in the stills, so it is the only warm
light in the cold shots. It is not Low Water's buoy orange (`#ff5a26`); keep it
yellower than that. The gauge numeral is the one place colour moves: it goes
from ice blue (`rgb(205,216,230)`) at 0 °C and below to the lamp at 80 °C.

While the steam fills the frame, the ink turns dark (`#16120f`) and the veil
drops, so captions stay readable on white.

## Type

- **Gloock** for the wordmark, chapter names and the gauge numeral. It is a heavy,
  high-contrast serif with soft joins, so at 20vw it looks cut from wood rather
  than printed, and its numerals carry the gauge without needing a mono.
- **Hanken Grotesk** for everything small. Labels are 11px uppercase at 0.16em.

Chapter names are Lithuanian (*Lauke, Suodžiai, Garas, Eketė*) with the English
under them. Both fonts carry the latin-ext glyphs those words need.

## The mark

A square window with four panes, in lamp colour. It is the window you go through
at the end of chapter one, and the favicon is the same square.

## Motion

Scroll is the playhead for four 5 s films at 12 fps (61 frames each). The canvas
blends each frame into the next by how far the scroll sits between them, and the
scroll value is eased (0.14 per frame), so it glides without hijacking the
scrollbar. Each chapter opens on its 2400 px still and dissolves into the film over
the first 7% of the chapter, so the first thing you see is sharp.

Three transitions, one per threshold:

- **The window.** The last exterior frame zooms into the lit window and the room
  opens out of it as a growing square with a lamp-coloured edge. The square is the
  mark.
- **The stones.** The room pushes toward the stove while the stones close-up comes
  in under a warm flash.
- **The thaw.** The steam goes fully white, then the lake comes up out of the
  white with a slight settle.

The wordmark leaves as smoke: each letter lifts, drifts and blurs a little more
than the one before it. Film grain sits over everything at 13%.

Under `prefers-reduced-motion`: no frames are loaded, each chapter shows its
still, transitions are hard cuts, the wordmark only fades, and the grain stops.

## Shots

Stills: GPT Image 2.6 Flare at medium, 2k. Films: Seedance 2.0 Mini, 720p, 5 s,
started from those stills. No people anywhere, which keeps hands and bodies
from breaking and keeps the sauna shots clear of the nsfw filter. Prompts, job ids
and the look are in `media/`.

## Honest copy

The sauna, its prices and its season are made up, and the footer says so along
with the fact that the images are generated. The temperatures are plausible for a
smoke sauna and for water under lake ice; they are not measurements.

## Constraint

Opens as a plain file. Frames are separate WebP files loaded six at a time, the
first film first; about 10 MB in total.

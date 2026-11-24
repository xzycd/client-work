# DESIGN DNA — Sakai

A made-up amber workshop in Nida, on the Curonian Spit. The page starts on one
specimen, a fly in Baltic amber, and scroll takes it back to the day it was caught.

## The idea

Amber is time you can hold. The page runs that time backwards and forwards once:
the polished stone melts back into pine resin, the fly is alive on the bark, the
drop closes over it, and then the sun flares into today's beach where storms wash
amber up. The counter is the instrument: a rolling odometer that runs from 0 to
44,000,000 years ago through the morph, holds through the trap, and runs back to
today through the flare.

## Colour

    --black  #0a0705   the black behind the specimen, and the ground
    --amber  #f0a020   the mark, selection, focus
    --honey  #f6c66a   labels, the counter's unit, the sun bloom
    --bone   #f1e8d8   text

Everything warm comes from the stone. There is no cool colour on the page except
what the beach photo brings.

## Type

- **Sentient** (Fontshare), light, for the headline, the chapter titles and the
  counter. Only the wordmark is italic, the way a specimen name is on its card;
  italic display headings everywhere else would read as a stock editorial look.
- **Spline Sans Mono** for every label: the specimen line, the header, the
  workshop terms. Museum labels are typed, so the small text is mono.

## The mark

An amber drop with a dark dot inside it: resin with something caught in it.

## Motion

Two films scrubbed by scroll: a Kling 3.0 Omni first-and-last-frame morph from
the stone to the living fly, and a Seedance 2.0 Mini shot of the resin closing
over it. Both are 61 frames at 12 fps, drawn by `shared/scrub-film.js`, blended
frame to frame and eased at 0.14 per frame like Suodis.

- **The morph** only works because the second still was generated with the first
  as a composition reference: the fly sits in the same place at the same size in
  both, so the film can keep it fixed while the world changes around it.
- **The flare.** The sun in the forest shot blooms (screen blend) until the frame
  is warm white, then the shore comes up out of it with a slight settle.
- **The shore** is a still pushed in toward the piece of amber in the seaweed.
- **The loupe.** On a fine pointer, a 220 px lens follows the pointer over the
  opening specimen and shows the 2688 px still at 1.8×. It hides once you scroll.
- **The counter** rolls each digit; a digit turns over only in the last 4% of the
  one below it, the way a mechanical counter does. Leading zeros stay at 16%.

Under `prefers-reduced-motion`: no frames load, each chapter shows its still,
transitions cut, no loupe, no grain.

## Honest copy

Sakai, its address and its terms are made up, and the footer says so along with
the fact that the images are generated. 44 million years is the usual age given
for Baltic amber. The specimen line (11 × 6 mm) describes the made-up piece.

## Constraint

Opens as a plain file. About 9 MB of frames, loaded coarse to fine so scrubbing
works before every frame has arrived.

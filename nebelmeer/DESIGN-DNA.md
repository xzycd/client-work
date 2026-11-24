# DESIGN DNA — Nebelmeer

A made-up studio that builds fewer than four houses a year in Valais, above the
*Nebelmeer*, the sea of fog that fills Swiss valleys on winter mornings. The name
replaced "Aether" on 2026-11-24: a word for exactly what the film shows, where the
old one could have named any product.

## Look

Kept as it was: near-black `#0e0d0c`, cream `#ede6d8`, one dawn orange
`#e39a4a` that only touches the italic words. Cormorant Garamond light for
display, Jost for text, Martian Mono for small capitals. The wordmark is
spaced capitals at 0.38em.

## What changed on 2026-11-24

- The scroll page embedded 71 JPEG frames as base64 (4.4 MB of HTML), and the
  film page embedded its video (3.0 MB). Nothing showed until all of it arrived.
  Both now load files: the first frame paints at once, frames arrive coarse to
  fine through `shared/scrub-film.js` and blend into each other, and the film
  page streams a 0.6 MB re-encode with the hero still as its poster.
- The percentage loader, the top progress bar, the frame bar and the kicker
  labels above the headline are gone.
- The enquiry link was a mailto to a made-up address; it now opens the film.
  The footer says the studio is made up.
- `_tools/build_sequence.py`, which baked the inline pages, is removed.

## Constraint

Every page opens as a plain file.

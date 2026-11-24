# DESIGN DNA — Small Mercy

A made-up hot sauce with three bottles and one stove dial. The page has no
images and no video: the bottle, the dial and the melting name are SVG, and the
only script is `mercy.js` (about 9 KB).

## The dial is the page

Heat runs from 0 to 1 and everything reads from it:

- The ground goes cream `#f4eee1` → peach `#ffc27a` → orange `#ff6a2a` →
  red `#c8150c` → almost black `#2b0606`. Ink flips from `#1c120e` to
  `#fff1e6` when the ground's luminance drops under 0.18, the point where
  both inks have the same contrast.
- The sauce in the bottle goes green to amber to red.
- The tier changes at thirds: Mild Mercy (jalapeño, €8), Some Mercy
  (habanero, €9), No Mercy (Carolina Reaper, €11).
- Past 0.45 the buy button sweats. Past 0.8 the bottle shivers. Past 0.97 the
  cap comes off.

## The melt

The name is live `<text>` in Shrikhand with drips placed under each letter
from `getExtentOfChar`, so the drips land on the real glyph bottoms. One filter
melts both: fractal noise feeds a displacement map, a blur softens it, and an
alpha threshold (`22a − 9`) turns the blur back into hard liquid edges. Heat
drives the displacement (up to 38) and the blur (up to 7). Under 0.05 the filter
is removed so the type renders crisp.

The index uses a frozen copy of the melted name at heat 0.75, inlined as a
symbol with the same filter, so the plate and the preview need no script.

## Type

Shrikhand for the name, tier names and headings. Schibsted Grotesk for
everything else. One face does the shouting.

## Motion

Reduced motion keeps the colour, the melt and the drip lengths, and drops the
wobble, the falling drops, the shiver and the sweat.

## Constraint

Opens as a plain file. Shrikhand and Schibsted Grotesk come from Google Fonts.

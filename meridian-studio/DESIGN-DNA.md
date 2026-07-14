# DESIGN DNA — MERIDIAN (independent design studio)

## North star
An editorial-brutalist studio site that reads like a printed design annual, not a
website. Confidence through restraint: enormous display type, hairline rules, a
strict grid deliberately broken, and one hot accent. It rejects the AI landing-page
mode — dark hero, gradient blob, centered sans headline, three icon cards.

## Typography
Display: Fraunces (opsz), 700/900, tight leading (0.92), used at clamp(3rem, 9vw, 9rem).
Body: Archivo, 400/500, line-height 1.55, measure ~60ch.
Labels/index: IBM Plex Mono, 500, uppercase, letter-spacing 0.12em.
Scale: mono labels 12–13px · body 16–18px · display 48–150px.

## Color
Base (paper):   #EEE9DE   warm bone
Surface:        #E5DFD1   slightly deeper panel
Ink:            #17150F   near-black, warm
Muted ink:      #6B6558
Accent (ONE):   #E4442B   vermilion — the ONLY UI accent: outlined hero word, index
                          hover numerals, cursor dot, links. Never a fill wash.
Project swatches (content, not UI accent): muted per-project marks revealed on index
hover — forest #2F5D50, navy #254AA5, ochre #C9992B, plum #8A3B86. Deliberately
desaturated to sit inside the paper world; they read as archival project colors, not
a second accent. This is a sanctioned exception to "one color," scoped to the hover
swatch only. Collapse them all to vermilion if maximum restraint is wanted.
Policy: light/paper only. No dark mode for this piece.

## Space & shape
Grid: 12 col, 88px max side margin on desktop; content hangs asymmetrically (work
index is full-bleed rows, hero copy sits on cols 1–8).
Spacing scale: 8 / 16 / 24 / 40 / 64 / 112 / 180.
Density: airy at the top, dense in the index. Radius: 0 everywhere (sharp). Rules: 1px ink.

## Materials & atmosphere
Flat paper. Subtle film grain overlay at 3% opacity. Hairline 1px ink rules divide
every section. Tinted shadow only on the hover swatch (rgba vermilion). No blur, no glass.

## Motion
Easing cubic-bezier(0.16,1,0.3,1). Durations 500–900ms. One orchestrated moment:
staggered mask-reveal of the hero display lines on load. Index rows shift + reveal a
color swatch on hover. Custom vermilion cursor dot with slight lag. Respect
prefers-reduced-motion: all transforms → instant, reveals become simple fades.

## Signature move
The numbered editorial index: every section marked 01–06 in mono with a hairline rule,
and the hero's final word set in vermilion OUTLINE (stroke, no fill). Guard this — it is
the one thing a viewer remembers.

## Voice
Terse, confident, lower-drama. "Independent design practice." "Selected work, 2019—."
Microcopy in mono, sentence fragments, no exclamation, no emoji.

## Banned in this project
Purple/blue gradients · centered hero · Inter/Roboto/Helvetica/Space Grotesk · icon
card trios · rounded corners · glassmorphism · marquee strips · drop shadows on text ·
more than one accent color.

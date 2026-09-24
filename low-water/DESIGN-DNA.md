# DESIGN DNA — Low Water

Identity for a fictional oyster farm in Eastport, Maine. The farm is invented.
The tide it runs on is real.

## The idea

An oyster farm on a big tide can only be worked when the flats are uncovered,
about ninety minutes either side of low water. Low water comes roughly fifty
minutes later every day, so the farm keeps the moon's hours, not the clock's.
The identity is built from that one fact. The tide sets the logo, the page and
the tag on every bag.

## Three rules

1. **Upright above the water, italic below.** Nautical charts letter land
   features upright and water features in italic. Here anything the water
   covers is redrawn in italic, the name included. When the waterline crosses
   the name it cuts every letter, so each one is upright above the line and
   italic below it.
2. **The mark is the day's tide.** There is no fixed logo file. The mark is the
   curve of the current day at Eastport, so it changes every morning.
3. **Flats, kelp and one buoy.** Mud when the water is out, kelp when it is in.
   Buoy orange marks "now" and is used for nothing else.

## Colour

    --flats  #C6BCA9   the ground, the mudflat
    --ink    #1C1A16    9.24 : 1 on flats
    --ink-2  #4A453B    5.06 : 1 on flats
    --kelp   #123029   the water
    --wet    #B9D1C4    8.77 : 1 on kelp
    --wet-2  #86A698    5.35 : 1 on kelp
    --tag    #EBE3CF   the harvest tag card, printed in kelp at 11.09 : 1
    --buoy   #FF5A26   now; never used for text

## Type

- **Zodiak** (Fontshare), variable 100–900 with an italic. The wordmark and all
  display type. Its italic is sharp enough that the swap at the waterline reads
  as deliberate, not as a glitch.
- **Fragment Mono** for every figure: heights, times, coordinates.

The index uses neither font except to draw this piece's own plate.

## The page

- **The gauge.** The first screen is a tide staff. The ground is the flats, and
  kelp fills it from below to the height of the water at Eastport right now,
  on a scale from −1.3 m to 7.6 m above chart datum. The dry layer is copied once
  into a wet layer, which is clipped to the waterline and set in italic. The copy
  is `inert` and hidden from assistive tech. A float rides the surface with the
  height and what the water is doing next. On arrival the water rises from the
  bottom of the staff to the present level.
- **The dial.** Seven days of tide as a single curve. Drag it, or use the arrow
  keys (Shift for six hours, Page Up and Page Down for a day, Esc to go back to
  now), and the water, the float and the tag all follow. It is an ARIA slider
  with a spoken value such as "Thu 24 Sept, 01:00 EDT, 2.63 metres, falling".
- **The hours.** The week's low waters, with each day's curve and the working
  windows shaded. The line above the table works out how much later today's low
  water is than yesterday's.
- **The tag.** A harvest tag printed with the day's curve and the low water it
  was picked on. It swings slightly when the day changes.
- **The system.** Below the fold the page is under water, so every heading there
  is italic.

## The tide, and how it was checked

Heights come from a harmonic prediction in the browser. There is no network
call and no data file. The page embeds 31 of the 34 harmonic constituents NOAA
publishes for Eastport (station 8410140, metric, phases on Greenwich). The three
left out (S1, M1, R2) add up to 2 cm. The rest of the method:

- Astronomical arguments come from the mean longitudes of the moon, sun, lunar
  perigee, lunar node and solar perigee.
- Nodal corrections use the standard series in the lunar node for M2, O1, K1,
  K2, J1 and OO1. Compound tides take powers and products of those.
- The datum offset is MSL − MLLW = 4.420 − 1.462 = 2.958 m, from NOAA's datums
  for the station.

It was checked on 2026-09-24 against NOAA's own predictions for the station:

- all 472 highs and lows from September to December 2026: largest timing error
  4 minutes, largest height error 9 cm;
- March 2030 highs and lows: 2 minutes, 6 cm;
- 6-minute heights for 24–30 September 2026: RMS 3 cm, largest error 5 cm.

The footer states this, with the dates, so the claim can be checked.

Times are shown in Eastport's own zone (America/New_York), with EDT or EST
written out.

## Constraint

One file, openable directly. No build step, no server, no data fetch.

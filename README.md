# TIKUS: Hidden Evidence

HTML5 Canvas hidden-object prototype.

## Run locally

Open this folder in VS Code and use Live Server on `index.html`.

## Assets

Put room backgrounds in:

```text
assets/rooms/
```

Put clue props in:

```text
assets/clues/
```

## Debug keys

- `H` = show/hide clue hitboxes
- `Z` = show/hide placement zones

## Placement logic

Clues no longer randomise across the whole room. Randomised clues only appear inside matching `placementZones` in `data.js`.

Adjust placement zone rectangles in `data.js` until they line up with tables, floors, counters, chairs, or sofas in your room backgrounds.

# TIKUS: Hidden Evidence

HTML5 hidden-object game prototype for desktop and mobile browser.

## Tech stack

- HTML5
- CSS
- Vanilla JavaScript ES6
- HTML5 Canvas API
- No game engines
- No build tools
- No external libraries

## Files

- `index.html` — page structure and UI overlays
- `style.css` — fullscreen layout, HUD, footer clue list, report overlay
- `data.js` — level data, clue names, clue coordinates, scoring settings
- `game.js` — canvas rendering, timer, score, clue detection, effects
- `assets/rooms/` — add final room background PNGs here
- `assets/clues/` — add isolated transparent clue PNGs here
- `assets/characters/` — add character art later
- `assets/ui/` — add logo and UI art later
- `assets/audio/` — add sounds later

## How to run

Open `index.html` in a browser.

For best results, use VS Code with a simple local server extension, because browsers may block local image loading from `file://` paths.

## Next step

Add these files:

- `assets/rooms/sitting-room.png`
- `assets/rooms/kitchen.png`

Then add clue PNGs matching the filenames in `data.js`.

If images are missing, the game shows placeholder boxes so you can still test clicking, scoring, timer, report, dust, flicker, and hint wiggle.

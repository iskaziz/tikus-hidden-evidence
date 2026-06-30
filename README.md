# TIKUS: Hidden Evidence — Current Files Updated Build

This build was generated from the current uploaded files:

- index.html
- style.css
- data.js
- game.js

Updates:
- Removed the mouse feature completely.
- Removed the wrong-click feature completely.
- Doubled the Feisk logo size.
- Increased intro character scale.
- Strengthened ambient lights and dust for all six levels.
- Added fallback ambient effects so rooms still show ambience if ambient data is missing.
- Added rotated placement-zone support in editor mode.
- Zone mode: use [ and ] to rotate selected zone.
- Existing zone resize controls remain active.

Editor note:
- In Zone Mode, [ / ] now rotate the selected zone.
- Rotated zones are drawn rotated and can be clicked using rotated hit detection.
- Rotated zones export with `rotation`.


## Logo and level name overlay update

Changes:
- Removed the visible “TIKUS: Hidden Evidence” title beside the Feisk logo.
- Kept only the Feisk logo on a slightly opaque top-left overlay.
- Moved the level name to a bottom-right overlay.
- The level name overlay overlaps the canvas/footer area.
- Increased level name text size slightly.
- Level name is now displayed in all caps.


## Level name clipping fix

The bottom-right level name overlay is now fixed relative to the viewport instead of being clipped inside the canvas frame. It overlaps the bottom of the game area and the footer.

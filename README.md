# TIKUS: Hidden Evidence — Expanded Zone Editor Build

This build keeps the edited Entry Hall, Grand Sitting Room, and Dining Room data, then adds starter data for the missing mansion rooms.

## Controls

- E: Toggle editor mode. Exiting opens export panel.
- 1: Clue edit mode.
- 2: Zone edit mode. Zones are not automatically shown in clue editor mode.
- Z: Toggle placement zone visibility manually.
- H: Toggle hitboxes.
- Click/drag: Move selected clue or zone.
- Arrow keys: Nudge selected item.
- Shift + arrows: Nudge selected item by 10px.
- - / =: Resize selected item.
- [ / ]: Rotate selected clue.
- N: Create new zone in zone mode.
- T: Cycle selected zone type.
- Delete: Delete selected zone.
- R: Toggle selected clue randomize true/false.
- X: Export full updated data.js.
- S: Save browser draft to localStorage.
- L: Load browser draft from localStorage.

## Important

The browser cannot directly overwrite your local source file. Use the export panel to copy or download the updated `data.js`, then replace the file in VS Code.

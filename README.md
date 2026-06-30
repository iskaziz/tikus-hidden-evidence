# TIKUS: Hidden Evidence — Landscape Mobile Fullscreen Build

This build keeps the editor tools and updates the gameplay layout for mobile:

- Mobile devices get a landscape-first fullscreen prompt.
- Tap **Enter Full Screen**, then rotate the phone sideways.
- In mobile landscape, the level fills the screen.
- The clue list is a horizontal footer at the bottom of the level.
- Score and wrong clicks are shown as a small top-right overlay.
- The old side clue list is removed.

Some mobile browsers do not allow websites to force rotation automatically. If rotation lock is blocked, tap **Enter Full Screen** and rotate the phone manually.

## Room backgrounds

Place 1280 × 720 room backgrounds in:

```text
assets/rooms/
```

Expected room filenames:

```text
entry_hall_bg.png
grand_sitting_room_bg.png
dining_room_bg.png
telephone_nook_bg.png
orchid_room_bg.png
orchid_ensuite_bg.png
kitchen_bg.png
office_study_bg.png
steam_room_bg.png
work_area_bg.png
```

## Editor controls

```text
E        Toggle editor mode. Exiting opens export panel.
1        Clue edit mode
2        Zone edit mode
Click    Select clue or zone
Drag     Move selected item
- / =    Resize selected item
[ / ]    Rotate selected clue
N        Create new zone
T        Cycle zone type
Delete   Delete selected zone
R        Toggle clue randomize true/false
X        Export full updated data.js
S        Save browser draft
L        Load browser draft
H        Toggle hitboxes
Z        Toggle placement zones
```

## Timer

This build includes a 20-second timer for each room. The timer appears in the top-right stats overlay.

To change the duration, edit `data.js`:

```js
timerDurationSeconds: 20
```

The timer pauses while Editor Mode or the export panel is open.


## Audio cues

This build includes local WAV audio files in `assets/audio/`:

- `clue_twang.wav` plays when a clue is found.
- `level_complete_chime.wav` plays when a level is completed successfully.
- `time_up_buzzer.wav` plays when the timer reaches zero before all clues are found.

Browsers require a user interaction before playing audio, so the game unlocks sound on the first click, tap, key press, or fullscreen/rotate button tap.


## UI update

The clue footer now sits directly beneath the 16:9 game level instead of overlaying the canvas. This keeps the room/map fully visible while preserving the horizontal clue list on desktop and mobile.


## Logo placement

The top-left level title overlay now expects this logo file:

```text
assets/ui/Feisk Logo.png
```

Use that exact filename, including the space and capital letters, or update the `src` in `index.html`.
The logo is styled to match the visual height of the game title text.


## Logo size update

The Feisk logo has been enlarged. It now uses:

```css
height: clamp(1.8rem, 4vw, 3rem);
```

Mobile uses a smaller responsive size so it does not cover the play area.


## Fun features added

This build adds:
- Room intro card before the timer starts.
- Hint button with limited hints per level.
- Wrong-click red flash and feedback toast.
- Combo scoring for quick accurate clue finding.
- Time bonus and star rating on level completion.
- Evidence report after each completed room.
- Final evidence board after all rooms.
- Small optional mouse distraction bonus.
- Existing clue click, level-complete, and time-up sounds remain included.

Timer begins only after pressing **Start Search** on the room intro card.


## Found evidence popup update

When a clue is found, the confirmation now appears as a dedicated **Found evidence** popup at the bottom-right of the game level. It fades away automatically and reappears for each newly found clue.


## Restart from beginning

After the final level is completed and the Investigation Complete screen appears, the final action button now says **Start From Beginning**. Pressing it resets completion tracking and returns to the first room.


## Hidden editor access

Editor controls are hidden by default. To unlock Editor Mode:

1. Click/tap the Feisk logo in the top-left 3 times.
2. Enter code `0707` on the keypad.
3. Editor Mode opens.

The **E** key now exits Editor Mode only after it has been unlocked; it no longer opens the editor directly.


## Mobile responsiveness update

This build adds two mobile play options:

1. **Landscape Fullscreen** — uses fullscreen on the full app shell instead of only the canvas, so overlays such as the keypad can remain visible.
2. **Portrait Pan Mode** — keeps the phone in portrait and lets the player pan/scroll across the 1280×720 room.

Other mobile fixes:
- Evidence report and final evidence board are now scrollable.
- Completion overlays have mobile max-height and internal scrolling.
- The hidden editor keypad now appears above the game UI and is not trapped behind the fullscreen canvas.


## Six-room story pass

The game has been reduced to 6 rooms with 6 clues per room:

1. Grand Sitting Room
2. Dining Room
3. Orchid Room
4. Orchid En-Suite
5. Kitchen
6. Garden

Removed rooms:
- Entry Hall
- Telephone Nook
- Office Study
- Steam Room
- Work Area

Office Study has been replaced with Garden using `assets/rooms/garden_bg.png`.

## Timer update

Timer settings are now:

```js
timerDurationSeconds: 25,
clueTimeBonusSeconds: 3
```

Each clue found adds 3 seconds to the current room timer and displays the bonus in the bottom-right Found Evidence popup.

## Story logic summary

- Grand Sitting Room: family performance, private drinks, and staged behaviour.
- Dining Room: seating order, tea, panic, and destroyed correspondence.
- Orchid Room: garden-side route, plants, tools, and chemical access.
- Orchid En-Suite: clean-up, medicine, mud transfer, and an unknown vial.
- Kitchen: service route, deliveries, ingredients, accounts, and timing.
- Garden: escape route, blackmail motive, hidden records, and cover-up tools.


## Clean hover build update

Changes:
- Removed Portrait Pan Mode. Mobile now uses the landscape/fullscreen flow only.
- Removed the hint feature and all hint UI.
- Added a soft glow when the player hovers over a clickable clue on desktop.
- Kept the 6-room / 6-clue structure.
- Kept the 25-second timer and +3 seconds per clue found.
- Kept hidden editor access through triple-clicking the Feisk logo and entering `0707`.
- Tidied the mobile/fullscreen logic by removing unused portrait-pan code paths.


## Main menu update

This build adds a starting menu before gameplay begins.

Menu options:
- **Start Game** begins from the first room.
- **Choose Levels** is locked until the player completes all levels.
- After all levels are completed, the menu shows the player's current high score.
- Level-select unlock and high score are saved in `localStorage`.

Scoring:
- A run score is accumulated as each completed room score is banked.
- At the end of all rooms, the run score is compared against the saved high score.


## End menu level select update

The main menu now only starts the game. Level selection has been moved to the Investigation Complete end menu.

After all levels are completed:
- **Choose Levels** appears on the end menu.
- Pressing it opens the completed level list.
- The player can replay any room from there.
- The main menu still shows the high score after completion.


## Editor visual controls update

Editor Mode now supports per-clue visual tuning:

- **O / P**: decrease / increase opacity
- **K / L**: decrease / increase saturation
- **B / V**: decrease / increase brightness

These values are rendered live on Canvas and exported into `data.js` for each clue:

```js
opacity: 0.85,
saturation: 0.9,
brightness: 0.95
```

Zone resizing has also been expanded:

- Existing **- / =** still scales the selected item.
- In Zone Mode, **Alt/Option + Arrow Keys** resize the selected zone width/height.
- Mobile/editor buttons now include Zone W-/W+/H-/H+ controls.

This helps clues blend better with room lighting without editing the PNG files.


## Character intro popup update

This build adds isolated character PNGs and displays them in the room intro popup.

New character assets:

```text
assets/characters/character_banana_man.png
assets/characters/character_black_shirt_man.png
assets/characters/character_kebaya_woman.png
assets/characters/character_bald_man.png
assets/characters/character_headwrap_woman.png
```

Each level now supports:

```js
introCharacterImage
introCharacterName
introCharacterLine
```

The character images are preloaded with the rest of the game assets and shown before the timer starts.


## Speech bubble / timer update

Changes in this build:
- Removed the end-of-level time bonus scoring.
- Timer remains 25 seconds for levels 1-3.
- Levels 4-6 now use 20 seconds via per-level `timerDurationSeconds`.
- The +3 seconds per clue found remains active.
- Removed the clue hover glow.
- Character intro dialogue now appears inside a speech bubble.
- Only two intro characters are reused across the six levels.


## Corner character intro update

The room intro no longer uses a centered card/box overlay. The intro character is enlarged and anchored to the bottom-left corner of the game level, with the speech bubble and Start Search button placed beside the character.


## Speech bubble position refinement

The intro speech panel has been moved higher and closer to the character's head. The speech bubble tail now points from the bubble toward the character more directly.

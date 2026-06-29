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

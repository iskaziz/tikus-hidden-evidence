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

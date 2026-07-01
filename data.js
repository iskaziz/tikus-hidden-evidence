const GAME_DATA = {
  canvas: { width: 1920, height: 1080 },
  timerSeconds: 30,
  scoring: {
    clue: 10,
    timeBonus: 2,
    missingPenalty: 2
  },
  clues: {
    knife: { label: "Knife", asset: "assets/clues/knife.png" },
    keris: { label: "Keris", asset: "assets/clues/keris.png" },
    handgun: { label: "Handgun", asset: "assets/clues/handgun.png" },
    metal_pipe: { label: "Metal Pipe", asset: "assets/clues/metal_pipe.png" },
    old_telephone_cord: { label: "Old Telephone Cord", asset: "assets/clues/old_telephone_cord.png" },
    candlestick: { label: "Candlestick", asset: "assets/clues/candlestick.png" }
  },
  characters: [
    { id: "sarong_man", asset: "assets/characters/sarong_man.png", alt: "Sarong man" },
    { id: "black_tshirt_man", asset: "assets/characters/black_tshirt_man.png", alt: "Black T-shirt man" },
    { id: "boho_woman", asset: "assets/characters/boho_woman.png", alt: "Boho woman" },
    { id: "bald_man", asset: "assets/characters/bald_man.png", alt: "Bald man" },
    { id: "headphones_woman", asset: "assets/characters/headphones_woman.png", alt: "Headphones woman" },
    { id: "elder_woman", asset: "assets/characters/elder_woman.png", alt: "Elder woman" },
    { id: "elder_man", asset: "assets/characters/elder_man.png", alt: "Elder man" }
  ],
  levels: [
    {
      id: "kitchen",
      name: "KITCHEN",
      background: "assets/rooms/kitchen_bg.png",
      startTitle: "Kitchen: Something in the shadows",
      startMessage: "The rain keeps the retreat sealed in. Search Mimi's kitchen for six suspicious objects before the trail goes cold.",
      completeTitle: "Kitchen Evidence Report",
      clues: [
        { id: "knife", center: { x: 670, y: 455 }, bbox: { x: 582, y: 371, w: 175, h: 167 }, rotation: -14, size: 145, opacity: 1, note: "rear counter under the cabinet light" },
        { id: "keris", center: { x: 1110, y: 860 }, bbox: { x: 1013, y: 759, w: 194, h: 201 }, rotation: 26, size: 155, opacity: 1, note: "mosaic floor near the doorway shadow" },
        { id: "handgun", center: { x: 895, y: 685 }, bbox: { x: 829, y: 621, w: 132, h: 127 }, rotation: -7, size: 118, opacity: 1, note: "under the rear table edge" },
        { id: "metal_pipe", center: { x: 1605, y: 700 }, bbox: { x: 1495, y: 611, w: 220, h: 178 }, rotation: 17, size: 190, opacity: 1, note: "along the stainless sink line" },
        { id: "old_telephone_cord", center: { x: 118, y: 350 }, bbox: { x: 35, y: 281, w: 166, h: 137 }, rotation: -8, size: 150, opacity: 1, note: "blended with the left wall wires" },
        { id: "candlestick", center: { x: 930, y: 320 }, bbox: { x: 898, y: 259, w: 64, h: 122 }, rotation: 1, size: 120, opacity: 1, note: "tucked near the cabinet and fridge" }
      ]
    },
    {
      id: "sitting_room",
      name: "SITTING ROOM",
      background: "assets/rooms/sitting_room_bg.png",
      startTitle: "Sitting Room: The house remembers",
      startMessage: "The old bungalow feels calm, but every corner has a secret. Find the remaining evidence before the room turns against you.",
      completeTitle: "Sitting Room Evidence Report",
      clues: [
        { id: "knife", center: { x: 1085, y: 800 }, bbox: { x: 999, y: 716, w: 171, h: 167 }, rotation: -21, size: 135, opacity: 1, note: "low on the red rug under the coffee table" },
        { id: "keris", center: { x: 1515, y: 240 }, bbox: { x: 1403, y: 130, w: 223, h: 219 }, rotation: -53, size: 165, opacity: 1, note: "following the stair and railing shadows" },
        { id: "handgun", center: { x: 1655, y: 742 }, bbox: { x: 1589, y: 678, w: 132, h: 127 }, rotation: -7, size: 118, opacity: 1, note: "near the right armchair floor shadow" },
        { id: "metal_pipe", center: { x: 1395, y: 310 }, bbox: { x: 1295, y: 219, w: 199, h: 181 }, rotation: 31, size: 165, opacity: 1, note: "parallel with the staircase structure" },
        { id: "old_telephone_cord", center: { x: 520, y: 832 }, bbox: { x: 440, y: 763, w: 160, h: 138 }, rotation: 12, size: 140, opacity: 1, note: "coiled near sofa legs" },
        { id: "candlestick", center: { x: 170, y: 592 }, bbox: { x: 136, y: 530, w: 68, h: 124 }, rotation: -3, size: 120, opacity: 1, note: "on the left console table" }
      ]
    }
  ]
};

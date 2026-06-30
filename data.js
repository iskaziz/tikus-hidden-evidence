/*
  TIKUS: Hidden Evidence
  data.js

  Eye-level hidden-object prototype.
  Clean two-level build:
  - Sitting Room
  - Kitchen
*/

const GAME_DATA = {
  settings: {
    gameTitle: "TIKUS: Hidden Evidence",
    baseWidth: 1280,
    baseHeight: 720,
    timerDurationSeconds: 25,
    clueScale: 1,
    scorePerClue: 100,
    editorAccessCode: "0707"
  },

  characters: [
    {
      id: "nervous_guest",
      name: "The Nervous Guest",
      image: "assets/characters/character_banana_man.png",
      lines: [
        "The room is watching us back.",
        "I swear that object was not there before.",
        "Look carefully. Someone wanted this to be found."
      ]
    },
    {
      id: "watchful_host",
      name: "The Watchful Host",
      image: "assets/characters/character_kebaya_woman.png",
      lines: [
        "This house keeps old secrets in plain sight.",
        "Do not trust the neatness. It is usually staged.",
        "Evidence has a way of glowing when the guilty panic."
      ]
    }
  ],

  levels: [
    {
      id: "sitting_room",
      name: "Sitting Room",
      roomImage: "assets/rooms/sitting_room_bg.png",
      introText: "Search the sitting room for weapons and suspicious objects before time runs out.",
      ambient: {
        lights: [
          { id: "sitting_lamp_glow", x: 300, y: 180, radius: 360, color: "rgba(255,205,120,0.30)", flickerAmount: 0.10, speed: 1.5 },
          { id: "sitting_window_haze", x: 930, y: 210, radius: 420, color: "rgba(190,210,255,0.14)", flickerAmount: 0.04, speed: 0.8 }
        ],
        dust: { enabled: true, count: 70, speed: 14, opacity: 0.28, drift: 16 }
      },
      clues: [
        { id: "keris", name: "Keris", image: "assets/clues/keris.png", x: 312, y: 486, width: 120, height: 42, rotation: -12 },
        { id: "handgun", name: "Handgun", image: "assets/clues/handgun.png", x: 738, y: 512, width: 96, height: 58, rotation: 7 },
        { id: "telephone_cord", name: "Telephone Cord", image: "assets/clues/telephone_cord.png", x: 950, y: 330, width: 130, height: 70, rotation: 0 },
        { id: "candlestick", name: "Candlestick", image: "assets/clues/candlestick.png", x: 575, y: 270, width: 56, height: 128, rotation: -3 }
      ]
    },
    {
      id: "kitchen",
      name: "Kitchen",
      roomImage: "assets/rooms/kitchen_bg.png",
      introText: "Search the kitchen for improvised weapons and signs of a hurried cover-up.",
      ambient: {
        lights: [
          { id: "kitchen_fluorescent", x: 640, y: 115, radius: 470, color: "rgba(220,245,255,0.32)", flickerAmount: 0.18, speed: 3.8 },
          { id: "kitchen_counter_glow", x: 760, y: 390, radius: 310, color: "rgba(255,230,170,0.18)", flickerAmount: 0.06, speed: 1.1 }
        ],
        dust: { enabled: true, count: 60, speed: 13, opacity: 0.26, drift: 14 }
      },
      clues: [
        { id: "knife", name: "Knife", image: "assets/clues/knife.png", x: 470, y: 420, width: 112, height: 36, rotation: -8 },
        { id: "metal_pipe", name: "Metal Pipe", image: "assets/clues/metal_pipe.png", x: 850, y: 560, width: 150, height: 42, rotation: 12 },
        { id: "candlestick", name: "Candlestick", image: "assets/clues/candlestick.png", x: 1015, y: 318, width: 56, height: 128, rotation: 5 },
        { id: "telephone_cord", name: "Telephone Cord", image: "assets/clues/telephone_cord.png", x: 250, y: 545, width: 130, height: 70, rotation: -18 }
      ]
    }
  ]
};

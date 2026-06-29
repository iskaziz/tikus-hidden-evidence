/*
  TIKUS: Hidden Evidence
  data.js

  World-logic randomisation version.

  Rules:
  - All coordinates use a fixed 1280 x 720 canvas space.
  - clueScale reduces all clue images and hitboxes.
  - Randomised clues only appear inside matching placement zones.
  - Fixed clues use authored x/y coordinates.
*/

const GAME_DATA = {
  settings: {
    gameTitle: "TIKUS: Hidden Evidence",
    baseWidth: 1280,
    baseHeight: 720,

    // 20% smaller clues
    clueScale: 0.8,

    // Global randomisation switch
    randomizeClueLocations: true
  },

  levels: [
    {
      id: "entry_hall",
      name: "Entry Hall",
      roomImage: "assets/rooms/entry_hall_bg.png",
      introText: "The entry hall is quiet, but several things are out of place.",

      placementZones: [
        {
          id: "entry_floor_left",
          label: "Floor near entrance",
          type: "floor",
          x: 95,
          y: 535,
          width: 260,
          height: 115
        },
        {
          id: "entry_floor_center",
          label: "Central floor",
          type: "floor",
          x: 430,
          y: 565,
          width: 370,
          height: 100
        },
        {
          id: "entry_floor_right",
          label: "Floor near skirting",
          type: "floor",
          x: 880,
          y: 570,
          width: 260,
          height: 85
        },
        {
          id: "entry_console_table",
          label: "Console table",
          type: "table",
          x: 705,
          y: 355,
          width: 255,
          height: 90
        },
        {
          id: "entry_chair_or_bench",
          label: "Chair or bench area",
          type: "chair",
          x: 120,
          y: 440,
          width: 190,
          height: 95
        },
        {
          id: "entry_reception_counter",
          label: "Reception counter",
          type: "counter",
          x: 780,
          y: 390,
          width: 240,
          height: 80
        }
      ],

      clues: [
        {
          id: "entry_jacket_cap",
          name: "Jacket and Cap",
          image: "assets/clues/entry_jacket_cap.png",
          randomize: true,
          placementTypes: ["floor", "chair"],
          x: 110,
          y: 455,
          width: 120,
          height: 95,
          description: "A hastily abandoned jacket and cap near the entrance."
        },
        {
          id: "brass_key",
          name: "Brass Key",
          image: "assets/clues/brass_key.png",
          randomize: true,
          placementTypes: ["floor", "table", "counter"],
          x: 925,
          y: 610,
          width: 70,
          height: 38,
          description: "A small brass key hidden near the skirting."
        },
        {
          id: "muddy_formal_footprint",
          name: "Muddy Formal Footprint",
          image: "assets/clues/muddy_formal_footprint.png",
          randomize: true,
          placementTypes: ["floor"],
          x: 545,
          y: 615,
          width: 130,
          height: 55,
          description: "A formal shoe print carrying mud from outside."
        },
        {
          id: "guest_registration_folder",
          name: "Guest Registration Folder",
          image: "assets/clues/guest_registration_folder.png",
          randomize: true,
          placementTypes: ["table", "counter"],
          x: 760,
          y: 400,
          width: 105,
          height: 75,
          description: "A guest folder left open at a suspicious page."
        },
        {
          id: "broken_vintage_wristwatch",
          name: "Broken Vintage Wristwatch",
          image: "assets/clues/broken_vintage_wristwatch.png",
          randomize: true,
          placementTypes: ["floor", "table", "counter"],
          x: 360,
          y: 560,
          width: 75,
          height: 55,
          description: "A cracked wristwatch stopped after a violent impact."
        }
      ]
    },

    {
      id: "grand_sitting_room",
      name: "Grand Sitting Room",
      roomImage: "assets/rooms/grand_sitting_room_bg.png",
      introText: "The grand sitting room looks composed, but the evidence is staged too neatly.",

      placementZones: [
        {
          id: "sitting_floor_left",
          label: "Floor beside sofa",
          type: "floor",
          x: 145,
          y: 560,
          width: 250,
          height: 85
        },
        {
          id: "sitting_floor_center",
          label: "Central rug floor",
          type: "floor",
          x: 470,
          y: 575,
          width: 360,
          height: 85
        },
        {
          id: "sitting_floor_right",
          label: "Floor near sideboard",
          type: "floor",
          x: 890,
          y: 555,
          width: 250,
          height: 90
        },
        {
          id: "sitting_coffee_table",
          label: "Coffee table",
          type: "table",
          x: 515,
          y: 465,
          width: 280,
          height: 105
        },
        {
          id: "sitting_side_table_left",
          label: "Left side table",
          type: "table",
          x: 345,
          y: 430,
          width: 145,
          height: 85
        },
        {
          id: "sitting_sideboard",
          label: "Sideboard surface",
          type: "counter",
          x: 895,
          y: 380,
          width: 250,
          height: 85
        },
        {
          id: "sitting_sofa",
          label: "Sofa cushion area",
          type: "sofa",
          x: 250,
          y: 390,
          width: 280,
          height: 95
        }
      ],

      clues: [
        {
          id: "framed_family_photograph",
          name: "Framed Family Photograph",
          image: "assets/clues/framed_family_photograph.png",
          randomize: true,
          placementTypes: ["table", "counter"],
          x: 150,
          y: 275,
          width: 95,
          height: 80,
          description: "A family photograph turned slightly away from the room."
        },
        {
          id: "cluedo_board_game",
          name: "Cluedo Board Game",
          image: "assets/clues/cluedo_board_game.png",
          randomize: true,
          placementTypes: ["table", "floor"],
          x: 560,
          y: 515,
          width: 155,
          height: 105,
          description: "A murder mystery game left mid-play."
        },
        {
          id: "chess_board_midgame",
          name: "Chess Board Midgame",
          image: "assets/clues/chess_board_midgame.png",
          randomize: true,
          placementTypes: ["table"],
          x: 790,
          y: 470,
          width: 120,
          height: 90,
          description: "The chess pieces suggest someone left in a hurry."
        },
        {
          id: "silver_serving_tray",
          name: "Silver Serving Tray",
          image: "assets/clues/silver_serving_tray.png",
          randomize: true,
          placementTypes: ["table", "counter"],
          x: 980,
          y: 420,
          width: 130,
          height: 70,
          description: "A polished serving tray with smudged handling marks."
        },
        {
          id: "private_lounge_matchbox",
          name: "Private Lounge Matchbox",
          image: "assets/clues/private_lounge_matchbox.png",
          randomize: true,
          placementTypes: ["table", "sofa", "floor"],
          x: 430,
          y: 610,
          width: 70,
          height: 45,
          description: "A matchbox from a private lounge."
        },
        {
          id: "lipstick_crystal_glass",
          name: "Lipstick Crystal Glass",
          image: "assets/clues/lipstick_crystal_glass.png",
          randomize: true,
          placementTypes: ["table", "counter"],
          x: 675,
          y: 395,
          width: 55,
          height: 80,
          description: "A crystal glass marked with lipstick."
        }
      ]
    },

    {
      id: "dining_room",
      name: "Dining Room",
      roomImage: "assets/rooms/dining_room_bg.png",
      introText: "Dinner was interrupted, but nobody agrees on when.",

      placementZones: [
        {
          id: "dining_table_left",
          label: "Left dining table surface",
          type: "table",
          x: 330,
          y: 360,
          width: 270,
          height: 110
        },
        {
          id: "dining_table_center",
          label: "Central dining table surface",
          type: "table",
          x: 550,
          y: 405,
          width: 300,
          height: 125
        },
        {
          id: "dining_table_right",
          label: "Right dining table surface",
          type: "table",
          x: 790,
          y: 370,
          width: 260,
          height: 120
        },
        {
          id: "dining_floor_left",
          label: "Floor beside dining chairs",
          type: "floor",
          x: 250,
          y: 555,
          width: 260,
          height: 95
        },
        {
          id: "dining_floor_center",
          label: "Floor below table",
          type: "floor",
          x: 535,
          y: 585,
          width: 300,
          height: 80
        },
        {
          id: "dining_floor_right",
          label: "Floor near cabinet",
          type: "floor",
          x: 900,
          y: 545,
          width: 240,
          height: 105
        },
        {
          id: "dining_sideboard",
          label: "Dining sideboard",
          type: "counter",
          x: 930,
          y: 365,
          width: 220,
          height: 85
        }
      ],

      clues: [
        {
          id: "dining_place_cards",
          name: "Dining Place Cards",
          image: "assets/clues/dining_place_cards.png",
          randomize: true,
          placementTypes: ["table"],
          x: 500,
          y: 400,
          width: 120,
          height: 65,
          description: "Place cards arranged in a strangely deliberate order."
        },
        {
          id: "broken_peranakan_teacup",
          name: "Broken Peranakan Teacup",
          image: "assets/clues/broken_peranakan_teacup.png",
          randomize: true,
          placementTypes: ["table", "floor"],
          x: 690,
          y: 520,
          width: 95,
          height: 65,
          description: "A shattered teacup with a familiar pattern."
        },
        {
          id: "half_empty_teacup",
          name: "Half-Empty Teacup",
          image: "assets/clues/half_empty_teacup.png",
          randomize: true,
          placementTypes: ["table", "counter"],
          x: 810,
          y: 430,
          width: 75,
          height: 60,
          description: "A teacup left half-finished."
        },
        {
          id: "bloody_handkerchief",
          name: "Bloody Handkerchief",
          image: "assets/clues/bloody_handkerchief.png",
          randomize: true,
          placementTypes: ["floor", "table"],
          x: 350,
          y: 590,
          width: 95,
          height: 55,
          description: "A folded handkerchief stained with blood."
        },
        {
          id: "candlestick_weapon",
          name: "Candlestick Weapon",
          image: "assets/clues/candlestick_weapon.png",
          randomize: true,
          placementTypes: ["table", "counter", "floor"],
          x: 1030,
          y: 510,
          width: 80,
          height: 115,
          description: "A heavy candlestick that looks recently handled."
        }
      ]
    }
  ]
};

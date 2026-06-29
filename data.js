/*
  TIKUS: Hidden Evidence
  data.js

  Exported from the in-game editor on 6/29/2026, 5:49:13 PM.
*/

const GAME_DATA = {
  settings: {
    gameTitle: "TIKUS: Hidden Evidence",
    baseWidth: 1280,
    baseHeight: 720,
    clueScale: 0.8,
    randomizeClueLocations: false,
    timerDurationSeconds: 20
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
          randomize: false,
          placementTypes: [
            "floor",
            "chair"
          ],
          x: 139,
          y: 482,
          width: 113,
          height: 89,
          rotation: -15,
          description: "A hastily abandoned jacket and cap near the entrance."
        },
        {
          id: "brass_key",
          name: "Brass Key",
          image: "assets/clues/brass_key.png",
          randomize: false,
          placementTypes: [
            "floor",
            "table",
            "counter"
          ],
          x: 908,
          y: 227,
          width: 50,
          height: 29,
          rotation: -10,
          description: "A small brass key hidden near the skirting."
        },
        {
          id: "muddy_formal_footprint",
          name: "Muddy Formal Footprint",
          image: "assets/clues/muddy_formal_footprint.png",
          randomize: false,
          placementTypes: [
            "floor"
          ],
          x: 299,
          y: 688,
          width: 96,
          height: 40,
          rotation: 135,
          description: "A formal shoe print carrying mud from outside."
        },
        {
          id: "guest_registration_folder",
          name: "Guest Registration Folder",
          image: "assets/clues/guest_registration_folder.png",
          randomize: false,
          placementTypes: [
            "table",
            "counter"
          ],
          x: 672,
          y: 134,
          width: 66,
          height: 48,
          rotation: 0,
          description: "A guest folder left open at a suspicious page."
        },
        {
          id: "broken_vintage_wristwatch",
          name: "Broken Vintage Wristwatch",
          image: "assets/clues/broken_vintage_wristwatch.png",
          randomize: false,
          placementTypes: [
            "floor",
            "table",
            "counter"
          ],
          x: 277,
          y: 298,
          width: 75,
          height: 55,
          rotation: 0,
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
          randomize: false,
          placementTypes: [
            "table",
            "counter"
          ],
          x: 666,
          y: 467,
          width: 60,
          height: 51,
          rotation: 0,
          description: "A family photograph turned slightly away from the room."
        },
        {
          id: "cluedo_board_game",
          name: "Cluedo Board Game",
          image: "assets/clues/cluedo_board_game.png",
          randomize: false,
          placementTypes: [
            "table",
            "floor"
          ],
          x: 220,
          y: 232,
          width: 93,
          height: 63,
          rotation: 0,
          description: "A murder mystery game left mid-play."
        },
        {
          id: "chess_board_midgame",
          name: "Chess Board Midgame",
          image: "assets/clues/chess_board_midgame.png",
          randomize: false,
          placementTypes: [
            "table"
          ],
          x: 794,
          y: 192,
          width: 56,
          height: 43,
          rotation: 10,
          description: "The chess pieces suggest someone left in a hurry."
        },
        {
          id: "silver_serving_tray",
          name: "Silver Serving Tray",
          image: "assets/clues/silver_serving_tray.png",
          randomize: false,
          placementTypes: [
            "table",
            "counter"
          ],
          x: 109,
          y: 378,
          width: 106,
          height: 58,
          rotation: 0,
          description: "A polished serving tray with smudged handling marks."
        },
        {
          id: "private_lounge_matchbox",
          name: "Private Lounge Matchbox",
          image: "assets/clues/private_lounge_matchbox.png",
          randomize: false,
          placementTypes: [
            "table",
            "sofa",
            "floor"
          ],
          x: 943,
          y: 681,
          width: 55,
          height: 35,
          rotation: -15,
          description: "A matchbox from a private lounge."
        },
        {
          id: "lipstick_crystal_glass",
          name: "Lipstick Crystal Glass",
          image: "assets/clues/lipstick_crystal_glass.png",
          randomize: false,
          placementTypes: [
            "table",
            "counter"
          ],
          x: 551,
          y: 100,
          width: 26,
          height: 35,
          rotation: 0,
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
          randomize: false,
          placementTypes: [
            "table"
          ],
          x: 716,
          y: 294,
          width: 73,
          height: 39,
          rotation: 0,
          description: "Place cards arranged in a strangely deliberate order."
        },
        {
          id: "broken_peranakan_teacup",
          name: "Broken Peranakan Teacup",
          image: "assets/clues/broken_peranakan_teacup.png",
          randomize: false,
          placementTypes: [
            "table",
            "floor"
          ],
          x: 594,
          y: 680,
          width: 66,
          height: 46,
          rotation: 0,
          description: "A shattered teacup with a familiar pattern."
        },
        {
          id: "half_empty_teacup",
          name: "Half-Empty Teacup",
          image: "assets/clues/half_empty_teacup.png",
          randomize: false,
          placementTypes: [
            "table",
            "counter"
          ],
          x: 406,
          y: 419,
          width: 35,
          height: 30,
          rotation: 0,
          description: "A teacup left half-finished."
        },
        {
          id: "bloody_handkerchief",
          name: "Bloody Handkerchief",
          image: "assets/clues/bloody_handkerchief.png",
          randomize: false,
          placementTypes: [
            "floor",
            "table"
          ],
          x: 134,
          y: 288,
          width: 53,
          height: 31,
          rotation: 0,
          description: "A folded handkerchief stained with blood."
        },
        {
          id: "candlestick_weapon",
          name: "Candlestick Weapon",
          image: "assets/clues/candlestick_weapon.png",
          randomize: false,
          placementTypes: [
            "table",
            "counter",
            "floor"
          ],
          x: 1016,
          y: 335,
          width: 40,
          height: 59,
          rotation: 0,
          description: "A heavy candlestick that looks recently handled."
        }
      ]
    }
,
    {
      id: "telephone_nook",
      name: "Telephone Nook",
      roomImage: "assets/rooms/telephone_nook_bg.png",
      introText: "The quiet telephone nook carries the kind of silence that has been arranged.",
      placementZones: [
        { id: "telephone_wall_panel", label: "Telephone wall panel", type: "wall", x: 755, y: 205, width: 210, height: 165 },
        { id: "telephone_side_table", label: "Telephone side table", type: "table", x: 720, y: 395, width: 240, height: 105 },
        { id: "telephone_floor_left", label: "Floor beside nook", type: "floor", x: 520, y: 565, width: 220, height: 80 },
        { id: "telephone_floor_right", label: "Floor below telephone", type: "floor", x: 785, y: 575, width: 260, height: 75 },
        { id: "telephone_shelf", label: "Small shelf", type: "shelf", x: 885, y: 320, width: 175, height: 65 }
      ],
      clues: [
        { id: "cut_telephone_cord", name: "Cut Telephone Cord", image: "assets/clues/cut_telephone_cord.png", randomize: false, placementTypes: ["wall"], x: 825, y: 300, width: 95, height: 60, rotation: 0, description: "The cord has been cut cleanly, not torn." },
        { id: "telephone_cut_wire", name: "Telephone Cut Wire", image: "assets/clues/telephone_cut_wire.png", randomize: false, placementTypes: ["wall"], x: 880, y: 270, width: 95, height: 65, rotation: 0, description: "A wire hidden behind the telephone plate has been severed." },
        { id: "telephone_receiver", name: "Telephone Receiver", image: "assets/clues/telephone_receiver.png", randomize: false, placementTypes: ["table", "wall"], x: 790, y: 405, width: 115, height: 55, rotation: -8, description: "The receiver was left off the hook." },
        { id: "bluetooth_radio_speaker", name: "Bluetooth Radio Speaker", image: "assets/clues/bluetooth_radio_speaker.png", randomize: false, placementTypes: ["table", "floor", "shelf"], x: 935, y: 415, width: 90, height: 65, rotation: 0, description: "A modern speaker hidden among old fixtures." }
      ]
    },
    {
      id: "orchid_room",
      name: "Orchid Room",
      roomImage: "assets/rooms/orchid_room_bg.png",
      introText: "The orchids look pampered, except where someone has disturbed them.",
      placementZones: [
        { id: "orchid_potting_bench", label: "Potting bench", type: "table", x: 300, y: 355, width: 310, height: 105 },
        { id: "orchid_shelf_left", label: "Left orchid shelf", type: "shelf", x: 125, y: 285, width: 235, height: 85 },
        { id: "orchid_shelf_right", label: "Right orchid shelf", type: "shelf", x: 820, y: 295, width: 260, height: 90 },
        { id: "orchid_floor_left", label: "Floor between pots", type: "floor", x: 145, y: 565, width: 260, height: 95 },
        { id: "orchid_floor_center", label: "Central tile floor", type: "floor", x: 470, y: 585, width: 335, height: 80 },
        { id: "orchid_floor_right", label: "Floor near glass doors", type: "floor", x: 865, y: 560, width: 245, height: 95 }
      ],
      clues: [
        { id: "broken_orchid_pot", name: "Broken Orchid Pot", image: "assets/clues/broken_orchid_pot.png", randomize: false, placementTypes: ["floor"], x: 260, y: 590, width: 105, height: 80, rotation: 0, description: "A broken orchid pot with fresh soil scattered nearby." },
        { id: "orchid_label_stakes", name: "Orchid Label Stakes", image: "assets/clues/orchid_label_stakes.png", randomize: false, placementTypes: ["table", "shelf", "floor"], x: 440, y: 385, width: 90, height: 55, rotation: 0, description: "Plant labels have been removed and rearranged." },
        { id: "orchid_petals", name: "Orchid Petals", image: "assets/clues/orchid_petals.png", randomize: false, placementTypes: ["floor", "table"], x: 530, y: 620, width: 95, height: 45, rotation: -10, description: "Loose petals mark a path across the floor." },
        { id: "greenhouse_pruning_shears", name: "Pruning Shears", image: "assets/clues/greenhouse_pruning_shears.png", randomize: false, placementTypes: ["table", "floor"], x: 355, y: 410, width: 105, height: 65, rotation: 12, description: "Sharp pruning shears left open." },
        { id: "fertiliser_bottle", name: "Fertiliser Bottle", image: "assets/clues/fertiliser_bottle.png", randomize: false, placementTypes: ["table", "shelf", "floor"], x: 895, y: 335, width: 60, height: 95, rotation: 0, description: "A bottle from the orchid supplies, used recently." }
      ]
    },
    {
      id: "orchid_ensuite",
      name: "Orchid En-Suite",
      roomImage: "assets/rooms/orchid_ensuite_bg.png",
      introText: "The en-suite is too clean in some places and not clean enough in others.",
      placementZones: [
        { id: "ensuite_sink_counter", label: "Sink counter", type: "counter", x: 610, y: 345, width: 260, height: 90 },
        { id: "ensuite_medicine_wall", label: "Medicine cabinet wall", type: "wall", x: 700, y: 190, width: 170, height: 140 },
        { id: "ensuite_towel_shelf", label: "Towel shelf", type: "shelf", x: 225, y: 330, width: 220, height: 95 },
        { id: "ensuite_floor_left", label: "Wet floor left", type: "floor", x: 270, y: 570, width: 250, height: 85 },
        { id: "ensuite_floor_center", label: "Bathroom floor", type: "floor", x: 560, y: 585, width: 300, height: 80 },
        { id: "ensuite_floor_right", label: "Floor near cabinet", type: "floor", x: 900, y: 555, width: 220, height: 90 }
      ],
      clues: [
        { id: "ensuite_medicine_cabinet", name: "Medicine Cabinet", image: "assets/clues/ensuite_medicine_cabinet.png", randomize: false, placementTypes: ["wall"], x: 720, y: 200, width: 120, height: 130, rotation: 0, description: "The medicine cabinet has been opened and searched." },
        { id: "ensuite_towel_bundle", name: "Towel Bundle", image: "assets/clues/ensuite_towel_bundle.png", randomize: false, placementTypes: ["floor", "shelf"], x: 330, y: 570, width: 120, height: 70, rotation: -5, description: "A bundled towel, damp and hastily folded." },
        { id: "medicine_bottle", name: "Medicine Bottle", image: "assets/clues/medicine_bottle.png", randomize: false, placementTypes: ["counter", "floor", "shelf"], x: 675, y: 370, width: 55, height: 90, rotation: 0, description: "A small bottle with the label turned away." },
        { id: "muddy_slipper", name: "Muddy Slipper", image: "assets/clues/muddy_slipper.png", randomize: false, placementTypes: ["floor"], x: 910, y: 600, width: 110, height: 55, rotation: 8, description: "A slipper carrying garden mud into the bathroom." },
        { id: "wellness_massage_oil_bottle", name: "Massage Oil Bottle", image: "assets/clues/wellness_massage_oil_bottle.png", randomize: false, placementTypes: ["counter", "shelf", "floor"], x: 770, y: 365, width: 55, height: 95, rotation: 0, description: "A wellness oil bottle with greasy fingerprints." }
      ]
    },
    {
      id: "kitchen",
      name: "Kitchen",
      roomImage: "assets/rooms/kitchen_bg.png",
      introText: "The kitchen staff know where everything belongs. These things do not.",
      placementZones: [
        { id: "kitchen_main_counter", label: "Main counter", type: "counter", x: 385, y: 360, width: 360, height: 110 },
        { id: "kitchen_back_counter", label: "Back counter", type: "counter", x: 780, y: 330, width: 300, height: 95 },
        { id: "kitchen_prep_table", label: "Prep table", type: "table", x: 470, y: 500, width: 300, height: 100 },
        { id: "kitchen_floor_left", label: "Kitchen floor left", type: "floor", x: 190, y: 585, width: 260, height: 85 },
        { id: "kitchen_floor_center", label: "Kitchen floor center", type: "floor", x: 535, y: 615, width: 330, height: 75 },
        { id: "kitchen_floor_right", label: "Kitchen floor right", type: "floor", x: 910, y: 575, width: 230, height: 90 },
        { id: "kitchen_shelf", label: "Kitchen shelf", type: "shelf", x: 245, y: 265, width: 280, height: 80 }
      ],
      clues: [
        { id: "kitchen_hidden_parcel", name: "Hidden Parcel", image: "assets/clues/kitchen_hidden_parcel.png", randomize: false, placementTypes: ["counter", "floor", "shelf"], x: 250, y: 585, width: 120, height: 70, rotation: 0, description: "A wrapped parcel tucked out of sight." },
        { id: "kitchen_knife_block", name: "Knife Block", image: "assets/clues/kitchen_knife_block.png", randomize: false, placementTypes: ["counter"], x: 820, y: 335, width: 95, height: 115, rotation: 0, description: "A knife block with one slot suspiciously empty." },
        { id: "kitchen_spice_tins", name: "Spice Tins", image: "assets/clues/kitchen_spice_tins.png", randomize: false, placementTypes: ["counter", "shelf"], x: 450, y: 365, width: 120, height: 70, rotation: 0, description: "A cluster of spice tins arranged to hide something." },
        { id: "dark_glass_vial", name: "Dark Glass Vial", image: "assets/clues/dark_glass_vial.png", randomize: false, placementTypes: ["counter", "table", "floor"], x: 625, y: 520, width: 45, height: 85, rotation: -8, description: "A small dark vial that does not belong in the kitchen." }
      ]
    },
    {
      id: "office_study",
      name: "Office Study",
      roomImage: "assets/rooms/office_study_bg.png",
      introText: "The study keeps the family's secrets in drawers, folders, and waste paper.",
      placementZones: [
        { id: "office_desk", label: "Main desk", type: "table", x: 455, y: 380, width: 360, height: 135 },
        { id: "office_side_table", label: "Side table", type: "table", x: 870, y: 410, width: 210, height: 90 },
        { id: "office_bookshelf", label: "Bookshelf", type: "shelf", x: 135, y: 230, width: 255, height: 140 },
        { id: "office_wall_notice", label: "Wall notice area", type: "wall", x: 800, y: 190, width: 260, height: 140 },
        { id: "office_floor_left", label: "Floor by bookshelf", type: "floor", x: 170, y: 560, width: 270, height: 90 },
        { id: "office_floor_center", label: "Floor below desk", type: "floor", x: 510, y: 585, width: 330, height: 80 },
        { id: "office_floor_right", label: "Floor near shredder", type: "floor", x: 890, y: 560, width: 240, height: 95 }
      ],
      clues: [
        { id: "blackmail_letter", name: "Blackmail Letter", image: "assets/clues/blackmail_letter.png", randomize: false, placementTypes: ["table", "floor"], x: 520, y: 405, width: 95, height: 65, rotation: -3, description: "A threatening letter folded into thirds." },
        { id: "locked_leather_diary", name: "Locked Leather Diary", image: "assets/clues/locked_leather_diary.png", randomize: false, placementTypes: ["table", "shelf"], x: 650, y: 395, width: 110, height: 80, rotation: 0, description: "A locked diary with worn leather corners." },
        { id: "hidden_envelope", name: "Hidden Envelope", image: "assets/clues/hidden_envelope.png", randomize: false, placementTypes: ["table", "shelf", "floor"], x: 930, y: 430, width: 95, height: 55, rotation: 8, description: "An envelope tucked beneath other papers." },
        { id: "office_lab_shredder_bin", name: "Shredder Bin", image: "assets/clues/office_lab_shredder_bin.png", randomize: false, placementTypes: ["floor"], x: 950, y: 560, width: 100, height: 105, rotation: 0, description: "A shredder bin full of strips from a recent document." },
        { id: "sitting_open_booking_laptop", name: "Open Booking Laptop", image: "assets/clues/sitting_open_booking_laptop.png", randomize: false, placementTypes: ["table"], x: 720, y: 390, width: 145, height: 95, rotation: 0, description: "An open laptop showing retreat booking activity." },
        { id: "crumpled_wellness_receipt", name: "Crumpled Wellness Receipt", image: "assets/clues/crumpled_wellness_receipt.png", randomize: false, placementTypes: ["floor", "table"], x: 565, y: 595, width: 70, height: 55, rotation: -12, description: "A crumpled receipt from the wellness retreat account." }
      ]
    },
    {
      id: "steam_room",
      name: "Steam Room",
      roomImage: "assets/rooms/steam_room_bg.png",
      introText: "Heat, moisture, and panic have softened the edges of the evidence.",
      placementZones: [
        { id: "steam_control_wall", label: "Control wall", type: "wall", x: 815, y: 230, width: 220, height: 155 },
        { id: "steam_bench_left", label: "Left steam bench", type: "bench", x: 210, y: 410, width: 310, height: 105 },
        { id: "steam_bench_right", label: "Right steam bench", type: "bench", x: 730, y: 430, width: 310, height: 100 },
        { id: "steam_floor_left", label: "Wet floor left", type: "floor", x: 215, y: 565, width: 275, height: 85 },
        { id: "steam_floor_center", label: "Wet floor center", type: "floor", x: 530, y: 595, width: 290, height: 75 },
        { id: "steam_floor_right", label: "Wet floor right", type: "floor", x: 865, y: 565, width: 245, height: 90 }
      ],
      clues: [
        { id: "steam_control_panel", name: "Steam Control Panel", image: "assets/clues/steam_control_panel.png", randomize: false, placementTypes: ["wall"], x: 850, y: 245, width: 135, height: 95, rotation: 0, description: "The steam control panel has been tampered with." },
        { id: "steam_valve_wheel", name: "Steam Valve Wheel", image: "assets/clues/steam_valve_wheel.png", randomize: false, placementTypes: ["wall"], x: 980, y: 305, width: 90, height: 90, rotation: 0, description: "A valve wheel turned beyond its usual mark." },
        { id: "burnt_letter_fragment", name: "Burnt Letter Fragment", image: "assets/clues/burnt_letter_fragment.png", randomize: false, placementTypes: ["floor", "bench"], x: 560, y: 600, width: 80, height: 55, rotation: -8, description: "A damp, burnt fragment of a letter." }
      ]
    },
    {
      id: "work_area",
      name: "Work Area",
      roomImage: "assets/rooms/work_area_bg.png",
      introText: "The maintenance area reveals what the polished mansion tries to hide.",
      placementZones: [
        { id: "work_tool_table", label: "Tool table", type: "table", x: 390, y: 385, width: 360, height: 130 },
        { id: "work_paint_shelf", label: "Paint shelf", type: "shelf", x: 805, y: 310, width: 260, height: 120 },
        { id: "work_floor_left", label: "Workshop floor left", type: "floor", x: 190, y: 570, width: 270, height: 90 },
        { id: "work_floor_center", label: "Workshop floor center", type: "floor", x: 500, y: 600, width: 330, height: 80 },
        { id: "work_floor_right", label: "Workshop floor right", type: "floor", x: 880, y: 560, width: 250, height: 95 },
        { id: "work_wall_hooks", label: "Wall hooks", type: "wall", x: 185, y: 245, width: 290, height: 135 }
      ],
      clues: [
        { id: "handyman_tool_table", name: "Handyman Tool Table", image: "assets/clues/handyman_tool_table.png", randomize: false, placementTypes: ["table"], x: 440, y: 405, width: 190, height: 120, rotation: 0, description: "A tool table with one tool recently moved or missing." },
        { id: "paint_tin_brushes", name: "Paint Tin and Brushes", image: "assets/clues/paint_tin_brushes.png", randomize: false, placementTypes: ["table", "shelf", "floor"], x: 850, y: 350, width: 120, height: 100, rotation: 0, description: "Used brushes and a dented paint tin with fresh residue." },
        { id: "nineties_boom_box", name: "Nineties Boom Box", image: "assets/clues/nineties_boom_box.png", randomize: false, placementTypes: ["table", "shelf", "floor"], x: 270, y: 585, width: 145, height: 85, rotation: 0, description: "An old boom box left where maintenance staff might work." }
      ]
    }

  ]
};
/*
  TIKUS: Hidden Evidence
  data.js

  Character speech-bubble intro build.
  - Levels 1-3 use default 25 second timer
  - Levels 4-6 use 20 second timer
  - +3 seconds per clue found remains active
  - End-of-level time bonus scoring removed
*/

const GAME_DATA = {
  "settings": {
    "gameTitle": "TIKUS: Hidden Evidence",
    "baseWidth": 1280,
    "baseHeight": 720,
    "clueScale": 0.8,
    "randomizeClueLocations": false,
    "mouseBonus": 25,
    "comboWindowSeconds": 4,
    "comboBonusStep": 25,
    "wrongClickPenalty": 10,
    "timerDurationSeconds": 25,
    "clueTimeBonusSeconds": 3
  },
  "levels": [
    {
      "id": "grand_sitting_room",
      "name": "Grand Sitting Room",
      "roomImage": "assets/rooms/grand_sitting_room_bg.png",
      "introText": "The family room is staged for polite conversation, but the evidence suggests someone rehearsed a lie in plain sight.",
      "placementZones": [
        {
          "id": "sitting_sofa_left",
          "label": "Left sofa and rug",
          "type": "sofa",
          "x": 120,
          "y": 430,
          "width": 300,
          "height": 135
        },
        {
          "id": "sitting_coffee_table",
          "label": "Coffee table",
          "type": "table",
          "x": 465,
          "y": 430,
          "width": 300,
          "height": 100
        },
        {
          "id": "sitting_sideboard",
          "label": "Sideboard and cabinet",
          "type": "table",
          "x": 810,
          "y": 320,
          "width": 315,
          "height": 115
        },
        {
          "id": "sitting_floor_front",
          "label": "Front rug floor",
          "type": "floor",
          "x": 250,
          "y": 575,
          "width": 760,
          "height": 100
        },
        {
          "id": "sitting_wall_picture",
          "label": "Back wall display",
          "type": "wall",
          "x": 520,
          "y": 120,
          "width": 260,
          "height": 165
        }
      ],
      "clues": [
        {
          "id": "framed_family_photograph",
          "name": "Framed Family Photograph",
          "image": "assets/clues/framed_family_photograph.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "counter"
          ],
          "x": 666,
          "y": 467,
          "width": 60,
          "height": 51,
          "rotation": 0,
          "description": "A formal family photograph hints at old resentment beneath the retreat's polished image.",
          "suspectTag": "Family pressure"
        },
        {
          "id": "cluedo_board_game",
          "name": "Cluedo Board Game",
          "image": "assets/clues/cluedo_board_game.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "floor"
          ],
          "x": 220,
          "y": 232,
          "width": 93,
          "height": 63,
          "rotation": 0,
          "description": "The board game feels like a cruel private joke beside a real investigation.",
          "suspectTag": "Dark joke / staged game"
        },
        {
          "id": "chess_board_midgame",
          "name": "Chess Board Midgame",
          "image": "assets/clues/chess_board_midgame.png",
          "randomize": false,
          "placementTypes": [
            "table"
          ],
          "x": 794,
          "y": 192,
          "width": 56,
          "height": 43,
          "rotation": 10,
          "description": "A frozen chess position suggests strategy, patience, and someone thinking several moves ahead.",
          "suspectTag": "Calculated planning"
        },
        {
          "id": "silver_serving_tray",
          "name": "Silver Serving Tray",
          "image": "assets/clues/silver_serving_tray.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "counter"
          ],
          "x": 109,
          "y": 378,
          "width": 106,
          "height": 58,
          "rotation": 0,
          "description": "The tray connects the sitting room to food, drink, and staff movement.",
          "suspectTag": "Service route"
        },
        {
          "id": "private_lounge_matchbox",
          "name": "Private Lounge Matchbox",
          "image": "assets/clues/private_lounge_matchbox.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "sofa",
            "floor"
          ],
          "x": 943,
          "y": 681,
          "width": 55,
          "height": 35,
          "rotation": -15,
          "description": "A matchbox from a private lounge points to an off-record conversation.",
          "suspectTag": "Private meeting"
        },
        {
          "id": "lipstick_crystal_glass",
          "name": "Lipstick Crystal Glass",
          "image": "assets/clues/lipstick_crystal_glass.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "counter"
          ],
          "x": 551,
          "y": 100,
          "width": 26,
          "height": 35,
          "rotation": 0,
          "description": "Lipstick on crystal suggests someone stayed for a drink longer than they admitted.",
          "suspectTag": "Social guest"
        }
      ],
      "introCharacterImage": "assets/characters/character_banana_man.png",
      "introCharacterName": "The Nervous Guest",
      "introCharacterLine": "This room is too neat. Someone cleaned the truth before we arrived."
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "roomImage": "assets/rooms/dining_room_bg.png",
      "introText": "Dinner was supposed to be ceremonial. The table now reads like a timeline of interruption, panic, and possible poisoning.",
      "placementZones": [
        {
          "id": "dining_main_table",
          "label": "Main dining table",
          "type": "table",
          "x": 330,
          "y": 300,
          "width": 580,
          "height": 180
        },
        {
          "id": "dining_sideboard",
          "label": "Sideboard",
          "type": "table",
          "x": 860,
          "y": 300,
          "width": 260,
          "height": 110
        },
        {
          "id": "dining_floor_left",
          "label": "Floor left of table",
          "type": "floor",
          "x": 95,
          "y": 480,
          "width": 260,
          "height": 120
        },
        {
          "id": "dining_floor_front",
          "label": "Front dining floor",
          "type": "floor",
          "x": 420,
          "y": 590,
          "width": 600,
          "height": 95
        },
        {
          "id": "dining_chair_zone",
          "label": "Chair backs",
          "type": "chair",
          "x": 210,
          "y": 320,
          "width": 170,
          "height": 160
        }
      ],
      "clues": [
        {
          "id": "dining_place_cards",
          "name": "Dining Place Cards",
          "image": "assets/clues/dining_place_cards.png",
          "randomize": false,
          "placementTypes": [
            "table"
          ],
          "x": 716,
          "y": 294,
          "width": 73,
          "height": 39,
          "rotation": 0,
          "description": "The place cards reveal who sat close enough to reach the victim's setting.",
          "suspectTag": "Seating order"
        },
        {
          "id": "broken_peranakan_teacup",
          "name": "Broken Peranakan Teacup",
          "image": "assets/clues/broken_peranakan_teacup.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "floor"
          ],
          "x": 594,
          "y": 680,
          "width": 66,
          "height": 46,
          "rotation": 0,
          "description": "The broken cup suggests a sudden movement after the meal began.",
          "suspectTag": "Impact / panic"
        },
        {
          "id": "half_empty_teacup",
          "name": "Half-Empty Teacup",
          "image": "assets/clues/half_empty_teacup.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "counter"
          ],
          "x": 406,
          "y": 419,
          "width": 35,
          "height": 30,
          "rotation": 0,
          "description": "The half-empty tea is the clearest delivery route for something discreet.",
          "suspectTag": "Poison route"
        },
        {
          "id": "bloody_handkerchief",
          "name": "Bloody Handkerchief",
          "image": "assets/clues/bloody_handkerchief.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "table"
          ],
          "x": 134,
          "y": 288,
          "width": 53,
          "height": 31,
          "rotation": 0,
          "description": "The handkerchief suggests someone tried to hide blood or a small injury.",
          "suspectTag": "Concealed injury"
        },
        {
          "id": "candlestick_weapon",
          "name": "Candlestick Weapon",
          "image": "assets/clues/candlestick_weapon.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "counter",
            "floor"
          ],
          "x": 1016,
          "y": 335,
          "width": 40,
          "height": 59,
          "rotation": 0,
          "description": "The candlestick is heavy enough to matter, but obvious enough to be a decoy.",
          "suspectTag": "Improvised weapon"
        },
        {
          "id": "burnt_letter_fragment",
          "name": "Burnt Letter Fragment",
          "image": "assets/clues/burnt_letter_fragment.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "bench"
          ],
          "x": 560,
          "y": 600,
          "width": 80,
          "height": 55,
          "rotation": -8,
          "description": "A burnt fragment links the dinner to a message someone wanted erased.",
          "suspectTag": "Destroyed message"
        }
      ],
      "introCharacterImage": "assets/characters/character_kebaya_woman.png",
      "introCharacterName": "The Watchful Host",
      "introCharacterLine": "Dinner tells you everything. Who sat where. Who reached for what. Who lied."
    },
    {
      "id": "orchid_room",
      "name": "Orchid Room",
      "roomImage": "assets/rooms/orchid_room_bg.png",
      "introText": "The orchids are carefully tended, but the room holds signs of rushed movement through the retreat's quieter side.",
      "placementZones": [
        {
          "id": "orchid_potting_bench",
          "label": "Potting bench",
          "type": "table",
          "x": 650,
          "y": 360,
          "width": 350,
          "height": 125
        },
        {
          "id": "orchid_floor_left",
          "label": "Left tiled floor",
          "type": "floor",
          "x": 110,
          "y": 515,
          "width": 330,
          "height": 115
        },
        {
          "id": "orchid_floor_right",
          "label": "Right tiled floor",
          "type": "floor",
          "x": 760,
          "y": 545,
          "width": 360,
          "height": 110
        },
        {
          "id": "orchid_plant_shelf",
          "label": "Plant shelf",
          "type": "shelf",
          "x": 240,
          "y": 260,
          "width": 340,
          "height": 115
        },
        {
          "id": "orchid_wall_labels",
          "label": "Label rack",
          "type": "wall",
          "x": 810,
          "y": 205,
          "width": 250,
          "height": 130
        }
      ],
      "clues": [
        {
          "id": "broken_orchid_pot",
          "name": "Broken Orchid Pot",
          "image": "assets/clues/broken_orchid_pot.png",
          "randomize": false,
          "placementTypes": [
            "floor"
          ],
          "x": 250,
          "y": 560,
          "width": 110,
          "height": 80,
          "rotation": 10,
          "description": "A broken pot marks a hurried passage through the orchid room.",
          "suspectTag": "Disturbed route"
        },
        {
          "id": "orchid_label_stakes",
          "name": "Orchid Label Stakes",
          "image": "assets/clues/orchid_label_stakes.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "shelf",
            "floor"
          ],
          "x": 540,
          "y": 395,
          "width": 95,
          "height": 60,
          "rotation": -5,
          "description": "The label stakes imply someone moved or disguised a plant marker.",
          "suspectTag": "Hidden names"
        },
        {
          "id": "orchid_petals",
          "name": "Orchid Petals",
          "image": "assets/clues/orchid_petals.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "table"
          ],
          "x": 835,
          "y": 610,
          "width": 120,
          "height": 60,
          "rotation": 0,
          "description": "Scattered petals create a soft trail across the room.",
          "suspectTag": "Trail marker"
        },
        {
          "id": "greenhouse_pruning_shears",
          "name": "Pruning Shears",
          "image": "assets/clues/greenhouse_pruning_shears.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "floor"
          ],
          "x": 760,
          "y": 455,
          "width": 95,
          "height": 55,
          "rotation": -14,
          "description": "Pruning shears connect the room to tools that could cut, threaten, or stage evidence.",
          "suspectTag": "Sharp tool access"
        },
        {
          "id": "fertiliser_bottle",
          "name": "Fertiliser Bottle",
          "image": "assets/clues/fertiliser_bottle.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "shelf",
            "floor"
          ],
          "x": 970,
          "y": 370,
          "width": 60,
          "height": 105,
          "rotation": 0,
          "description": "The fertiliser bottle raises questions about chemicals kept near the wellness areas.",
          "suspectTag": "Chemical access"
        },
        {
          "id": "brass_key",
          "name": "Brass Key",
          "image": "assets/clues/brass_key.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "table",
            "counter"
          ],
          "x": 410,
          "y": 525,
          "width": 50,
          "height": 29,
          "rotation": -10,
          "description": "The brass key suggests someone used the garden-side route to reach a locked space.",
          "suspectTag": "Locked access"
        }
      ],
      "introCharacterImage": "assets/characters/character_banana_man.png",
      "introCharacterName": "The Nervous Guest",
      "introCharacterLine": "The orchids are quiet, but something moved through here in a hurry."
    },
    {
      "id": "orchid_ensuite",
      "name": "Orchid En-Suite",
      "roomImage": "assets/rooms/orchid_ensuite_bg.png",
      "introText": "The private bathroom feels freshly tidied, but medicine, towels, and damp traces suggest a hurried clean-up.",
      "placementZones": [
        {
          "id": "ensuite_sink_counter",
          "label": "Sink counter",
          "type": "counter",
          "x": 680,
          "y": 350,
          "width": 320,
          "height": 105
        },
        {
          "id": "ensuite_cabinet",
          "label": "Medicine cabinet",
          "type": "wall",
          "x": 725,
          "y": 175,
          "width": 230,
          "height": 150
        },
        {
          "id": "ensuite_towel_area",
          "label": "Towel area",
          "type": "table",
          "x": 190,
          "y": 330,
          "width": 270,
          "height": 120
        },
        {
          "id": "ensuite_floor",
          "label": "Bathroom floor",
          "type": "floor",
          "x": 330,
          "y": 550,
          "width": 620,
          "height": 120
        },
        {
          "id": "ensuite_shower_edge",
          "label": "Shower edge",
          "type": "floor",
          "x": 870,
          "y": 465,
          "width": 260,
          "height": 115
        }
      ],
      "clues": [
        {
          "id": "ensuite_medicine_cabinet",
          "name": "Medicine Cabinet",
          "image": "assets/clues/ensuite_medicine_cabinet.png",
          "randomize": false,
          "placementTypes": [
            "wall"
          ],
          "x": 760,
          "y": 205,
          "width": 150,
          "height": 110,
          "rotation": 0,
          "description": "The cabinet is a controlled source of pills, bottles, and private routines.",
          "suspectTag": "Medication access"
        },
        {
          "id": "ensuite_towel_bundle",
          "name": "Towel Bundle",
          "image": "assets/clues/ensuite_towel_bundle.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "shelf"
          ],
          "x": 250,
          "y": 380,
          "width": 150,
          "height": 95,
          "rotation": 0,
          "description": "The towel bundle may have absorbed water, mud, or something darker.",
          "suspectTag": "Clean-up attempt"
        },
        {
          "id": "medicine_bottle",
          "name": "Medicine Bottle",
          "image": "assets/clues/medicine_bottle.png",
          "randomize": false,
          "placementTypes": [
            "counter",
            "floor",
            "shelf"
          ],
          "x": 805,
          "y": 385,
          "width": 45,
          "height": 85,
          "rotation": 0,
          "description": "The medicine bottle ties the room to treatment schedules and dosage.",
          "suspectTag": "Wellness treatment"
        },
        {
          "id": "muddy_slipper",
          "name": "Muddy Slipper",
          "image": "assets/clues/muddy_slipper.png",
          "randomize": false,
          "placementTypes": [
            "floor"
          ],
          "x": 520,
          "y": 610,
          "width": 95,
          "height": 55,
          "rotation": 12,
          "description": "A muddy slipper brings the outside route into the bathroom.",
          "suspectTag": "Garden transfer"
        },
        {
          "id": "wellness_massage_oil_bottle",
          "name": "Massage Oil Bottle",
          "image": "assets/clues/wellness_massage_oil_bottle.png",
          "randomize": false,
          "placementTypes": [
            "counter",
            "shelf",
            "floor"
          ],
          "x": 705,
          "y": 430,
          "width": 45,
          "height": 90,
          "rotation": -5,
          "description": "Massage oil gives the wellness routine a more suspicious practical use.",
          "suspectTag": "Retreat ritual"
        },
        {
          "id": "dark_glass_vial",
          "name": "Dark Glass Vial",
          "image": "assets/clues/dark_glass_vial.png",
          "randomize": false,
          "placementTypes": [
            "counter",
            "table",
            "floor"
          ],
          "x": 920,
          "y": 520,
          "width": 45,
          "height": 85,
          "rotation": -8,
          "description": "The dark vial does not belong in a normal en-suite.",
          "suspectTag": "Unknown substance"
        }
      ],
      "introCharacterImage": "assets/characters/character_kebaya_woman.png",
      "introCharacterName": "The Watchful Host",
      "introCharacterLine": "Someone came here to wash something away. Find what they missed.",
      "timerDurationSeconds": 20
    },
    {
      "id": "kitchen",
      "name": "Kitchen",
      "roomImage": "assets/rooms/kitchen_bg.png",
      "introText": "Behind the mansion's refined service, the kitchen exposes the practical path for parcels, receipts, and tampered ingredients.",
      "placementZones": [
        {
          "id": "kitchen_counter_left",
          "label": "Left counter",
          "type": "counter",
          "x": 160,
          "y": 345,
          "width": 340,
          "height": 115
        },
        {
          "id": "kitchen_counter_right",
          "label": "Right counter",
          "type": "counter",
          "x": 720,
          "y": 335,
          "width": 360,
          "height": 120
        },
        {
          "id": "kitchen_table",
          "label": "Prep table",
          "type": "table",
          "x": 430,
          "y": 465,
          "width": 330,
          "height": 145
        },
        {
          "id": "kitchen_floor",
          "label": "Kitchen floor",
          "type": "floor",
          "x": 250,
          "y": 600,
          "width": 760,
          "height": 90
        },
        {
          "id": "kitchen_shelf",
          "label": "Back shelf",
          "type": "shelf",
          "x": 510,
          "y": 210,
          "width": 330,
          "height": 110
        }
      ],
      "clues": [
        {
          "id": "kitchen_hidden_parcel",
          "name": "Hidden Parcel",
          "image": "assets/clues/kitchen_hidden_parcel.png",
          "randomize": false,
          "placementTypes": [
            "counter",
            "floor",
            "shelf"
          ],
          "x": 295,
          "y": 555,
          "width": 130,
          "height": 85,
          "rotation": 0,
          "description": "The hidden parcel suggests something entered the retreat through service channels.",
          "suspectTag": "Secret delivery"
        },
        {
          "id": "kitchen_knife_block",
          "name": "Knife Block",
          "image": "assets/clues/kitchen_knife_block.png",
          "randomize": false,
          "placementTypes": [
            "counter"
          ],
          "x": 860,
          "y": 370,
          "width": 90,
          "height": 100,
          "rotation": 0,
          "description": "The knife block confirms easy access to sharp tools during meal preparation.",
          "suspectTag": "Weapon access"
        },
        {
          "id": "kitchen_spice_tins",
          "name": "Spice Tins",
          "image": "assets/clues/kitchen_spice_tins.png",
          "randomize": false,
          "placementTypes": [
            "counter",
            "shelf"
          ],
          "x": 530,
          "y": 255,
          "width": 140,
          "height": 75,
          "rotation": 0,
          "description": "The spice tins create a plausible place to hide or disguise a substance.",
          "suspectTag": "Ingredient tampering"
        },
        {
          "id": "crumpled_wellness_receipt",
          "name": "Crumpled Wellness Receipt",
          "image": "assets/clues/crumpled_wellness_receipt.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "table"
          ],
          "x": 565,
          "y": 595,
          "width": 70,
          "height": 55,
          "rotation": -12,
          "description": "The receipt connects kitchen supplies to the retreat's private accounts.",
          "suspectTag": "Money trail"
        },
        {
          "id": "hidden_envelope",
          "name": "Hidden Envelope",
          "image": "assets/clues/hidden_envelope.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "shelf",
            "floor"
          ],
          "x": 735,
          "y": 500,
          "width": 95,
          "height": 55,
          "rotation": 8,
          "description": "The envelope suggests someone used the kitchen as a dead-drop.",
          "suspectTag": "Secret instructions"
        },
        {
          "id": "broken_vintage_wristwatch",
          "name": "Broken Vintage Wristwatch",
          "image": "assets/clues/broken_vintage_wristwatch.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "table",
            "counter"
          ],
          "x": 420,
          "y": 430,
          "width": 75,
          "height": 55,
          "rotation": 0,
          "description": "The broken watch may fix the timing of movement through the service area.",
          "suspectTag": "Timeline clue"
        }
      ],
      "introCharacterImage": "assets/characters/character_banana_man.png",
      "introCharacterName": "The Nervous Guest",
      "introCharacterLine": "Everything passes through the kitchen eventually. Food, gossip, poison.",
      "timerDurationSeconds": 20
    },
    {
      "id": "garden",
      "name": "Garden",
      "roomImage": "assets/rooms/garden_bg.png",
      "introText": "Outside, the hillside garden offers the best route for someone trying to avoid the mansion's main rooms.",
      "placementZones": [
        {
          "id": "garden_path_left",
          "label": "Stone path left",
          "type": "floor",
          "x": 90,
          "y": 535,
          "width": 360,
          "height": 115
        },
        {
          "id": "garden_path_right",
          "label": "Stone path right",
          "type": "floor",
          "x": 720,
          "y": 545,
          "width": 420,
          "height": 120
        },
        {
          "id": "garden_bench",
          "label": "Garden bench",
          "type": "bench",
          "x": 470,
          "y": 385,
          "width": 310,
          "height": 120
        },
        {
          "id": "garden_potting_table",
          "label": "Outdoor potting table",
          "type": "table",
          "x": 835,
          "y": 330,
          "width": 280,
          "height": 125
        },
        {
          "id": "garden_bushes",
          "label": "Low bushes",
          "type": "floor",
          "x": 170,
          "y": 345,
          "width": 310,
          "height": 145
        },
        {
          "id": "garden_wall",
          "label": "Garden wall",
          "type": "wall",
          "x": 540,
          "y": 175,
          "width": 300,
          "height": 135
        }
      ],
      "clues": [
        {
          "id": "muddy_formal_footprint",
          "name": "Muddy Formal Footprint",
          "image": "assets/clues/muddy_formal_footprint.png",
          "randomize": false,
          "placementTypes": [
            "floor"
          ],
          "x": 270,
          "y": 620,
          "width": 96,
          "height": 40,
          "rotation": 135,
          "description": "A formal shoeprint in the mud suggests someone dressed for dinner went outside.",
          "suspectTag": "Outside route"
        },
        {
          "id": "entry_jacket_cap",
          "name": "Jacket and Cap",
          "image": "assets/clues/entry_jacket_cap.png",
          "randomize": false,
          "placementTypes": [
            "floor",
            "chair"
          ],
          "x": 150,
          "y": 430,
          "width": 113,
          "height": 89,
          "rotation": -15,
          "description": "The jacket and cap look like a temporary disguise abandoned in haste.",
          "suspectTag": "Discarded disguise"
        },
        {
          "id": "blackmail_letter",
          "name": "Blackmail Letter",
          "image": "assets/clues/blackmail_letter.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "floor"
          ],
          "x": 610,
          "y": 300,
          "width": 100,
          "height": 70,
          "rotation": -5,
          "description": "The blackmail letter gives someone a reason to silence the victim.",
          "suspectTag": "Motive"
        },
        {
          "id": "locked_leather_diary",
          "name": "Locked Leather Diary",
          "image": "assets/clues/locked_leather_diary.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "shelf"
          ],
          "x": 530,
          "y": 410,
          "width": 110,
          "height": 80,
          "rotation": 0,
          "description": "The locked diary suggests a hidden record of appointments, debts, or betrayals.",
          "suspectTag": "Private record"
        },
        {
          "id": "handyman_tool_table",
          "name": "Handyman Tool Table",
          "image": "assets/clues/handyman_tool_table.png",
          "randomize": false,
          "placementTypes": [
            "table"
          ],
          "x": 870,
          "y": 375,
          "width": 190,
          "height": 120,
          "rotation": 0,
          "description": "The tool table suggests practical work done outside the public rooms.",
          "suspectTag": "Cover-up tools"
        },
        {
          "id": "paint_tin_brushes",
          "name": "Paint Tin and Brushes",
          "image": "assets/clues/paint_tin_brushes.png",
          "randomize": false,
          "placementTypes": [
            "table",
            "shelf",
            "floor"
          ],
          "x": 760,
          "y": 520,
          "width": 120,
          "height": 100,
          "rotation": 0,
          "description": "Fresh paint residue suggests someone covered marks near the garden route.",
          "suspectTag": "Covered marks"
        }
      ],
      "introCharacterImage": "assets/characters/character_kebaya_woman.png",
      "introCharacterName": "The Watchful Host",
      "introCharacterLine": "Outside is where people go when they do not want to be seen.",
      "timerDurationSeconds": 20
    }
  ]
};

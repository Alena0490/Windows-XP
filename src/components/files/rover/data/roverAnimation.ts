export interface RoverAnimation {
    frames: number;
    frameTime: number;
    repeat: number | typeof Infinity;
    sound?: string;
}

export const roverAnimations: Record<string, 
RoverAnimation> = {
    // Idle variants — one is picked at random for "Do a trick"
    // Idle variants now play once each (repeat: 1) — the SearchSidebar's
    // onComplete handler then picks a different idle, so the rover keeps
    // moving AND the sound replays for each new variant.
    '1idle':  { frames: 5,  frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_000.wav'    },
    '2idle':  { frames: 17, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_000.wav'    },
    '3idle':  { frames: 31, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_000.wav'    },
    '4idle':  { frames: 13, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_Tap.wav'    },
    '5idle':  { frames: 18, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_Haf.wav'    },
    '6idle':  { frames: 10, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_Scrape.wav' },
    '7idle':  { frames: 25, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_0001.wav'   },
    '8idle':  { frames: 12, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_Lick.wav'   },
    '9idle':  { frames: 36, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_Stir.wav'   },
    '10idle': { frames: 36, frameTime: 100, repeat: 1, sound: './sounds/rover_Resources_000.wav'    },

    // Named animations
    come:      { frames: 20, frameTime: 100, repeat: 1,        sound: './sounds/rover_Resources_0001.wav'    },
    ashamed:   { frames: 27, frameTime: 100, repeat: 1,        sound: './sounds/rover_Resources_Whine.wav'   },
    haf:       { frames: 8,  frameTime: 100, repeat: 1,        sound: './sounds/rover_Resources_Haf.wav'     },
    lick:      { frames: 19, frameTime: 100, repeat: 1,        sound: './sounds/rover_Resources_Lick.wav'    },
    attention: { frames: 11, frameTime: 100, repeat: 1,        sound: './sounds/rover_Resources_Tap.wav'     },
    sleep:     { frames: 8,  frameTime: 300, repeat: Infinity, sound: './sounds/rover_Resources_Snoring.wav' },
    eat:           { frames: 77, frameTime: 100, repeat: 1        },
    exit:          { frames: 29, frameTime: 50,  repeat: 1        },
    reading:       { frames: 25, frameTime: 100, repeat: Infinity },
    tired:         { frames: 13, frameTime: 100, repeat: 1        },
    speak:         { frames: 15, frameTime: 100, repeat: Infinity },
    'start-speak': { frames: 3, frameTime: 100, repeat: 1        },
    'end-speak':   { frames: 6, frameTime: 100, repeat: 1        },

    // Sprite-only metadata — these have no PNG folder, but declaring the entry
    // lets the hook know each one's repeat behaviour for the sprite-sheet fallback.
    acknowledge:        { frames: 0, frameTime: 100, repeat: 1        },
    characterSucceeds:  { frames: 0, frameTime: 100, repeat: 1        },
    congratulate:       { frames: 0, frameTime: 100, repeat: 1        },
    cooking:            { frames: 0, frameTime: 100, repeat: 1        },
    embarrassed:        { frames: 0, frameTime: 100, repeat: 1        },
    gestureLeft:        { frames: 0, frameTime: 100, repeat: 1        },
    getAttention:       { frames: 0, frameTime: 100, repeat: 1        },
    getAttentionMinor:  { frames: 0, frameTime: 100, repeat: 1        },
    greet:              { frames: 0, frameTime: 100, repeat: 1        },
    imageSearching:     { frames: 0, frameTime: 100, repeat: 1        },
    lookUp:             { frames: 0, frameTime: 100, repeat: 1        },
    lookUpLeft:         { frames: 0, frameTime: 100, repeat: 1        },
    money:              { frames: 0, frameTime: 100, repeat: 1        },
    pleased:            { frames: 0, frameTime: 100, repeat: 1        },
    restPose:           { frames: 0, frameTime: 100, repeat: Infinity },
    searching:          { frames: 0, frameTime: 100, repeat: 1        },
    shopping:           { frames: 0, frameTime: 100, repeat: 1        },
    show:               { frames: 0, frameTime: 100, repeat: 1        },
    sports:             { frames: 0, frameTime: 100, repeat: 1        },
    surprised:          { frames: 0, frameTime: 100, repeat: 1        },
    thinking:           { frames: 0, frameTime: 100, repeat: 1        },
    travel:             { frames: 0, frameTime: 100, repeat: 1        },
    writing:            { frames: 0, frameTime: 100, repeat: 1        },
};

// Only animations that have either PNG frames OR a sprite entry — anything
// without graphics in either source would freeze the rover when picked.
export const trickAnimations = [
    '1idle', '2idle', '3idle', '4idle', '5idle',
    '6idle', '7idle', '8idle', '9idle', '10idle',
    'haf', 'lick',
    'shopping', 'sports', 'travel', 'money', 'writing', 'thinking',
];

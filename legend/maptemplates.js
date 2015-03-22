var fringeset = {
    "tree": {
        "width": 1,
        "height": 3,
        "color": "rgb(0,255,0)"
    },
    "rock": {
        "width": 1,
        "height": 1,
        "color": "rgb(105,105,105)"
    },
    "window": {
        "width": 1,
        "height": 1,
        "color": "rgb(176,196,222)"
    },
    "chair": {
        "width": 1,
        "height": 1,
        "color": "rgb(139,69,19)"
    },
    "torch": {
        "width": 1,
        "height": 1,
        "color": "rgb(255,69,0)"
    },
    "crack": {
        "width": 1,
        "height": 1,
        "color": "rgb(0,0,0)"
    }
};

var tileset = {
    "blackness": {
        "color": "rgb(25,25,25)",
        "fringelist": [],
        "prevalence": 0.0
    },
    "water": {
        "color": "rgb(0,0,205)",
        "fringelist": [],
        "prevalence": 0.0
    },
    "shallow": {
        "color": "rgb(0,255,255)",
        "fringelist": [],
        "prevalence": 0.0
    },
    "sand": {
        "color": "rgb(255,228,181)",
        "fringelist": ["rock"],
        "prevalence": 0.5
    },
    "grass": {
        "color": "rgb(50,205,50)",
        "fringelist": ["tree"],
        "prevalence": 0.25
    },
    "darkgrass": {
        "color": "rgb(34,139,34)",
        "fringelist": ["tree"],
        "prevalence": 0.5
    },
    "treegrass": {
        "color": "rgb(0,100,0)",
        "fringelist": ["tree"],
        "prevalence": 0.9
    },
    "mountain": {
        "color": "rgb(128,128,128)",
        "fringelist": ["tree"],
        "prevalence": 0.9
    },
    "housewall": {
        "color": "rgb(184,134,11)",
        "fringelist": ["window"],
        "prevalence": 0.1
    },
    "housefloor": {
        "color": "rgb(218,165,32)",
        "fringelist": ["chair"],
        "prevalence": 0.1
    },
    "cavewall": {
        "color": "rgb(139,69,19)",
        "fringelist": ["torch"],
        "prevalence": 0.1
    },
    "cavefloor": {
        "color": "rgb(222,184,135)",
        "fringelist": ["crack"],
        "prevalence": 0.1
    }
};

var maptypes = {
    "world": {
        "width": {"min": 128, "max": 128},
        "height": {"min": 128, "max": 128},
        "default": "water",
        "border": "shallow",
        "northwall": "grass",
        "southwall": "sand",
        "tileset": ["sand", "grass", "darkgrass", "treegrass"],
        "submapcount": {"min": 6, "max": 8},
        "submapset": ["town", "cave"]
    },
    "town": {
        "width": {"min": 32, "max": 64},
        "height": {"min": 32, "max": 64},
        "default": "treegrass",
        "border": "treegrass",
        "northwall": "treegrass",
        "southwall": "treegrass",
        "tileset": ["treegrass", "grass", "water"],
        "submapcount": {"min": 3, "max": 5},
        "submapset": ["house"]
    },
    "house": {
        "width": {"min": 24, "max": 48},
        "height": {"min": 32, "max": 64},
        "default": "blackness",
        "northwall": "housewall",
        "southwall": "blackness",
        "tileset": ["housefloor"],
        "submapcount": {"min": 2, "max": 4},
        "submapset": ["house"]
    },
    "cave": {
        "width": {"min": 32, "max": 128},
        "height": {"min": 32, "max": 128},
        "default": "blackness",
        "northwall": "cavewall",
        "southwall": "blackness",
        "tileset": ["cavefloor"],
        "submapcount": {"min": 3, "max": 5},
        "submapset": ["cave"]
    }
};

var doortypes = {
    "entrance": {
        color: "rgb(255, 255, 0)"
    },
    "exit": {
        color: "rgb(255, 0, 255)"
    }
};

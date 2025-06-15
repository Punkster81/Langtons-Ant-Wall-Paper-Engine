

let NumberOfAnts = 1; // Default to 1 ant

const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    count: 4
};

// Your original ant structure
let ant = {
    x: 0,
    y: 0,
    dir: Direction.UP,
    state: 0
};

// Simple list of ants
let ants = [];

// Add an ant to the list
function addAnt(x, y, dir = Direction.UP) {
    ants.push({
        x: x,
        y: y,
        dir: dir,
        state: 0
    });
}


// Get ant count
function getAntCount() {
    return ants.length;
}

// Clear all ants
function clearAnts() {
    ants = [];
}



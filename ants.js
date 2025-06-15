


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
    state: 0,
    rules: {},
    colors: []
};

// Simple list of ants
let ants = [];

// Add an ant to the list
function addAnt(x, y, dir = Direction.UP, rules = {}, colors = []) {
    ants.push({
        x: x,
        y: y,
        dir: dir,
        state: 0,
        rules: rules,
        colors: colors
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

// Create multiple ants with even spacing
function createAnts() {
    clearAnts(); // Start fresh

    if (numberOfAnts <= 0) return;

    // Calculate even spacing
    const spacing = Math.sqrt((cols * rows) / numberOfAnts);
    const antsPerRow = Math.ceil(cols / spacing);
    const antsPerCol = Math.ceil(rows / spacing);
    
    // Calculate actual spacing to center the grid
    const actualSpacingX = cols / (antsPerRow + 1);
    const actualSpacingY = rows / (antsPerCol + 1);
    
    let antCount = 0;

    let rulesColors;

    if(!properties.differentRulesPerAnt) {
        rulesColors = generateRandomRules(properties.minColors, properties.minStates);
    }

    
    for (let row = 0; row < antsPerCol && antCount < numberOfAnts; row++) {
        for (let col = 0; col < antsPerRow && antCount < numberOfAnts; col++) {
            // Calculate position (offset from top-left corner)
            const x = Math.floor((col + 1) * actualSpacingX - cols / 2);
            const y = Math.floor((row + 1) * actualSpacingY - rows / 2);
            
            
            // Each ant gets its own copy of rules and colors
            let antRules, antColors;
            if (sameRules) {
                // Use the same rules/colors for all ants
                antRules = rulesColors.rules;
                antColors = rulesColors.colors;
            } else {
                rulesColors = generateRandomRules(properties.minColors, properties.minStates);
                antRules = rulesColors.rules;
                antColors = rulesColors.colors;
            }
            
            addAnt(x, y, Direction.UP, 0, antRules, antColors);
            antCount++;
        }
    }
}

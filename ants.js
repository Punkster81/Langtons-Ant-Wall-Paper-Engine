


const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    count: 4
};

directionVectors = [
    [0, -1], // UP: Direction.UP = 0
    [1, 0],  // RIGHT: Direction.RIGHT = 1  
    [0, 1],  // DOWN: Direction.DOWN = 2
    [-1, 0]  // LEFT: Direction.LEFT = 3
];

const Turn = {
    LEFT: 'L',
    RIGHT: 'R',
    FORWARD: 'F',  // Forward 
    BACKWARD: 'B', //uturn
    STAY: 'S'
};

const moves = ['L', 'R', 'F', 'B', 'S']; // Left, Right, Straight, Back, Stay




// Your original ant structure
class Ant {
    constructor(x, y, dir, state, rules, colors) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.state = state;
        this.rules = rules;
        this.colors = colors;
    }

    // Step function: perform one ant step
    step() {

        const currentRow = grid[this.y];
        const cellColor = currentRow[this.x];

        const stateRules = this.rules[this.state]
        if (!stateRules) {
            showError(`Missing rule for state ${this.state}`);
            stopAnimation();
            return;
        }


        const rule = stateRules[cellColor] || stateRules[0];//default if ant doesnt know that color treat it as first color, always black 

        const newColor = rule.writeColor;
        if (properties.showAnt || cellColor !== newColor) { // Only update if color actually changed or if using ant, leaves after image of ants otherwise
            currentRow[this.x] = newColor;

            // Use integer pixel coordinates for better performance
            const pixelX = Math.floor(this.x * cellSize);
            const pixelY = Math.floor(this.y * cellSize);
            const pixelSize = Math.ceil(cellSize);

            ctx.fillStyle = this.colors[newColor];
            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
        }


        // Change direction
        const move = rule.move;
        let shouldMove = true;

        // Pre-calculated direction changes for better performance
        switch (move) {
            case Turn.LEFT:
                this.dir = (this.dir + 3) & 3; // Bitwise AND is faster than modulo for powers of 2
                break;
            case Turn.RIGHT:
                this.dir = (this.dir + 1) & 3;
                break;
            case Turn.BACKWARD:
                this.dir = (this.dir + 2) & 3;
                break;
            case Turn.FORWARD:
                // No direction change needed
                break;
            case Turn.STAY:
                shouldMove = false;
                break;
        }


        // Move ant
        if (shouldMove) {
            const dirVector = directionVectors[this.dir];
            this.x = (this.x + dirVector[0] + cols) % cols;
            this.y = (this.y + dirVector[1] + rows) % rows;
        }




        // Change to next state
        this.state = rule.nextState || 0;
    }

    drawAnt() {
        if (properties.showAnt && cellSize <= 1) return; // Too small to draw ant visibly
        const halfCell = cellSize * .5;

        const px = this.x * cellSize + halfCell;
        const py = this.y * cellSize + halfCell;
        const radius = halfCell;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, 6.283185307179586);//6.283185307179586 is 2*pi
        ctx.fillStyle = properties.antColor ?? '#FF0000';
        ctx.fill();
    }
};

// Simple list of ants
let ants = [];

// Add an ant to the list
function addAnt(x, y, dir = Direction.UP, rules = {}, colors = []) {
    ants.push(new Ant(x, y, dir, 0, rules, colors));
}



// Clear all ants
function clearAnts() {
    ants = [];
}


// Create multiple ants with improved row-based centering
function createAnts() {
    clearAnts(); // Start fresh

    if (numberOfAnts <= 0) return;

    // Calculate the center of the grid
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    // Special case: if only one ant, place it exactly in the center
    if (numberOfAnts === 1) {
        let sharedRulesColors = null;
        if (!properties.differentRulesPerAnt) {
            sharedRulesColors = generateRandomRules(getColorCount(), getStateCount());
            addAnt(centerX, centerY, Direction.UP, sharedRulesColors.rules, sharedRulesColors.colors);
        } else {
            const rulesColors = generateRandomRules(getColorCount(), getStateCount());
            addAnt(centerX, centerY, Direction.UP, rulesColors.rules, rulesColors.colors);
        }
        return;
    }

    // Calculate optimal row layout
    const layout = calculateRowLayout(numberOfAnts, cols, rows);

    let antCount = 0;
    let sharedRulesColors = null;

    // Generate shared rules once if all ants use the same rules
    if (!properties.differentRulesPerAnt) {
        sharedRulesColors = generateRandomRules(getColorCount(), getStateCount());
    }

    // Position ants according to the calculated layout
    for (let rowIndex = 0; rowIndex < layout.rowConfig.length && antCount < numberOfAnts; rowIndex++) {
        const antsInThisRow = layout.rowConfig[rowIndex];
        const rowY = centerY + layout.rowOffsets[rowIndex];

        // Calculate horizontal spacing for this row
        const horizontalSpacing = antsInThisRow > 1 ? Math.min(cols / (antsInThisRow + 1), cols * 0.8 / antsInThisRow) : 0;

        for (let colIndex = 0; colIndex < antsInThisRow && antCount < numberOfAnts; colIndex++) {
            let x;
            if (antsInThisRow === 1) {
                // Single ant in row - center it
                x = centerX;
            } else {
                // Multiple ants - distribute evenly
                const startX = centerX - (horizontalSpacing * (antsInThisRow - 1)) / 2;
                x = Math.floor(startX + colIndex * horizontalSpacing);
            }

            // Ensure ant stays within bounds
            x = Math.max(0, Math.min(cols - 1, x));
            const y = Math.max(0, Math.min(rows - 1, rowY));

            if (!properties.differentRulesPerAnt) {
                addAnt(x, y, Direction.UP, sharedRulesColors.rules, sharedRulesColors.colors);
            } else {
                const rulesColors = generateRandomRules(getColorCount(), getStateCount());
                addAnt(x, y, Direction.UP, rulesColors.rules, rulesColors.colors);
            }
            antCount++;
        }
    }
}

// Create multiple ants with improved row-based centering
function createAnts() {
    clearAnts(); // Start fresh

    if (numberOfAnts <= 0) return;

    // Calculate the center of the grid
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    // Special case: if only one ant, place it exactly in the center
    if (numberOfAnts === 1) {
        let sharedRulesColors = null;
        if (!properties.differentRulesPerAnt) {
            sharedRulesColors = generateRandomRules(getColorCount(), getStateCount());
            addAnt(centerX, centerY, Direction.UP, sharedRulesColors.rules, sharedRulesColors.colors);
        } else {
            const rulesColors = generateRandomRules(getColorCount(), getStateCount());
            addAnt(centerX, centerY, Direction.UP, rulesColors.rules, rulesColors.colors);
        }
        return;
    }

    // Calculate optimal row layout
    const layout = calculateRowLayout(numberOfAnts, cols, rows);

    let antCount = 0;
    let sharedRulesColors = null;

    // Generate shared rules once if all ants use the same rules
    if (!properties.differentRulesPerAnt) {
        sharedRulesColors = generateRandomRules(getColorCount(), getStateCount());
    }

    // Position ants according to the calculated layout
    for (let rowIndex = 0; rowIndex < layout.rowConfig.length && antCount < numberOfAnts; rowIndex++) {
        const antsInThisRow = layout.rowConfig[rowIndex];
        const rowY = centerY + layout.rowOffsets[rowIndex];

        // Calculate horizontal spacing for this row
        const horizontalSpacing = antsInThisRow > 1 ? Math.min(cols / (antsInThisRow + 1), cols * 0.8 / antsInThisRow) : 0;

        for (let colIndex = 0; colIndex < antsInThisRow && antCount < numberOfAnts; colIndex++) {
            let x;
            if (antsInThisRow === 1) {
                // Single ant in row - center it
                x = centerX;
            } else {
                // Multiple ants - distribute evenly
                const startX = centerX - (horizontalSpacing * (antsInThisRow - 1)) / 2;
                x = Math.floor(startX + colIndex * horizontalSpacing);
            }

            // Ensure ant stays within bounds
            x = Math.max(0, Math.min(cols - 1, x));
            const y = Math.max(0, Math.min(rows - 1, rowY));

            if (!properties.differentRulesPerAnt) {
                addAnt(x, y, Direction.UP, sharedRulesColors.rules, sharedRulesColors.colors);
            } else {
                const rulesColors = generateRandomRules(getColorCount(), getStateCount());
                addAnt(x, y, Direction.UP, rulesColors.rules, rulesColors.colors);
            }
            antCount++;
        }
    }
}

// Create ants from a predefined array of rules and colors
function createAntsFromRulesArray(rulesAndColorsArray) {
    clearAnts(); // Start fresh

    if (!rulesAndColorsArray || rulesAndColorsArray.length === 0) return;

    const numAnts = rulesAndColorsArray.length;

    // Calculate the center of the grid
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    // Special case: if only one ant, place it exactly in the center
    if (numAnts === 1) {
        const config = rulesAndColorsArray[0];
        addAnt(centerX, centerY, Direction.UP, config.rules, config.colors);
        return;
    }

    // Calculate optimal row layout for the number of ants we have
    const layout = calculateRowLayout(numAnts, cols, rows);

    let antIndex = 0;

    // Position ants according to the calculated layout
    for (let rowIndex = 0; rowIndex < layout.rowConfig.length && antIndex < numAnts; rowIndex++) {
        const antsInThisRow = layout.rowConfig[rowIndex];
        const rowY = centerY + layout.rowOffsets[rowIndex];

        // Calculate horizontal spacing for this row
        const horizontalSpacing = antsInThisRow > 1 ? Math.min(cols / (antsInThisRow + 1), cols * 0.8 / antsInThisRow) : 0;

        for (let colIndex = 0; colIndex < antsInThisRow && antIndex < numAnts; colIndex++) {
            let x;
            if (antsInThisRow === 1) {
                // Single ant in row - center it
                x = centerX;
            } else {
                // Multiple ants - distribute evenly
                const startX = centerX - (horizontalSpacing * (antsInThisRow - 1)) / 2;
                x = Math.floor(startX + colIndex * horizontalSpacing);
            }

            // Ensure ant stays within bounds
            x = Math.max(0, Math.min(cols - 1, x));
            const y = Math.max(0, Math.min(rows - 1, rowY));

            // Use the specific rules and colors for this ant
            const config = rulesAndColorsArray[antIndex];
            addAnt(x, y, Direction.UP, config.rules, config.colors);
            antIndex++;
        }
    }
}

// Recenter existing ants with improved row-based layout
function recenterAnts() {
    // If we have fewer ants than desired, create new ones
    if (ants.length < numberOfAnts) {
        let sharedRulesColors = null;

        // Generate shared rules if all ants use the same rules
        if (!properties.differentRulesPerAnt) {
            sharedRulesColors = ants[0] ? { rules: ants[0].rules, colors: ants[0].colors } : generateRandomRules(getColorCount(), getStateCount());
        }

        // Create additional ants to reach the desired number
        while (ants.length < numberOfAnts) {
            if (properties.differentRulesPerAnt || sharedRulesColors === null) {
                const rulesColors = generateRandomRules(getColorCount(), getStateCount());
                addAnt(0, 0, Direction.UP, rulesColors.rules, rulesColors.colors);
            } else {
                addAnt(0, 0, Direction.UP, sharedRulesColors.rules, sharedRulesColors.colors);
            }
        }
    }
    else if (ants.length > numberOfAnts) {
        // If we have more ants than desired, remove excess ants
        ants = ants.slice(0, numberOfAnts);
    }

    if (ants.length === 0) return; // No ants to recenter

    // Calculate the center of the grid
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    // Special case: if only one ant, place it exactly in the center
    if (ants.length === 1) {
        ants[0].x = centerX;
        ants[0].y = centerY;
        ants[0].dir = Direction.UP;
        ants[0].state = 0;
        return;
    }

    // Calculate optimal row layout
    const layout = calculateRowLayout(ants.length, cols, rows);

    let antIndex = 0;

    // Position existing ants according to the calculated layout
    for (let rowIndex = 0; rowIndex < layout.rowConfig.length && antIndex < ants.length; rowIndex++) {
        const antsInThisRow = layout.rowConfig[rowIndex];
        const rowY = centerY + layout.rowOffsets[rowIndex];

        // Calculate horizontal spacing for this row
        const horizontalSpacing = antsInThisRow > 1 ? Math.min(cols / (antsInThisRow + 1), cols * 0.8 / antsInThisRow) : 0;

        for (let colIndex = 0; colIndex < antsInThisRow && antIndex < ants.length; colIndex++) {
            let x;
            if (antsInThisRow === 1) {
                // Single ant in row - center it
                x = centerX;
            } else {
                // Multiple ants - distribute evenly
                const startX = centerX - (horizontalSpacing * (antsInThisRow - 1)) / 2;
                x = Math.floor(startX + colIndex * horizontalSpacing);
            }

            // Ensure ant stays within bounds
            x = Math.max(0, Math.min(cols - 1, x));
            const y = Math.max(0, Math.min(rows - 1, rowY));

            // Update existing ant position
            ants[antIndex].x = x;
            ants[antIndex].y = y;
            ants[antIndex].dir = Direction.UP; // Reset direction to UP
            ants[antIndex].state = 0; // Reset state to 0
            antIndex++;
        }
    }
}


// Helper function to calculate optimal row layout
function calculateRowLayout(totalAnts, gridCols, gridRows) {
    const centerY = Math.floor(gridRows / 2);

    // Determine optimal number of rows based on total ants and grid dimensions
    let numRows = Math.min(Math.ceil(Math.sqrt(totalAnts)), Math.floor(gridRows * 0.8));
    numRows = Math.max(1, numRows); // At least one row

    // Distribute ants across rows as evenly as possible
    const baseAntsPerRow = Math.floor(totalAnts / numRows);
    const extraAnts = totalAnts % numRows;

    const rowConfig = [];
    for (let i = 0; i < numRows; i++) {
        // Distribute extra ants to middle rows first
        const middleRow = Math.floor(numRows / 2);
        const distanceFromMiddle = Math.abs(i - middleRow);
        const getsExtraAnt = i < extraAnts || (extraAnts > 0 && distanceFromMiddle <= Math.floor(extraAnts / 2));
        rowConfig.push(baseAntsPerRow + (getsExtraAnt ? 1 : 0));
    }

    // Calculate vertical offsets for each row
    const rowOffsets = [];
    const verticalSpacing = numRows > 1 ? Math.min(gridRows / (numRows + 1), gridRows * 0.6 / numRows) : 0;

    for (let i = 0; i < numRows; i++) {
        if (numRows === 1) {
            rowOffsets.push(0); // Single row at center
        } else if (numRows === 2) {
            rowOffsets.push(i === 0 ? -Math.floor(verticalSpacing / 2) : Math.floor(verticalSpacing / 2));
        } else {
            // For 3+ rows: center row at 0, others distributed above and below
            const middleRow = Math.floor(numRows / 2);
            if (i === middleRow) {
                rowOffsets.push(0); // Middle row at center
            } else if (i < middleRow) {
                // Rows above center
                const distanceFromCenter = middleRow - i;
                rowOffsets.push(-distanceFromCenter * verticalSpacing);
            } else {
                // Rows below center
                const distanceFromCenter = i - middleRow;
                rowOffsets.push(distanceFromCenter * verticalSpacing);
            }
        }
    }

    // Ensure all row positions are within bounds
    for (let i = 0; i < rowOffsets.length; i++) {
        rowOffsets[i] = Math.max(-centerY, Math.min(gridRows - 1 - centerY, Math.floor(rowOffsets[i])));
    }

    return {
        rowConfig: rowConfig,
        rowOffsets: rowOffsets
    };
}
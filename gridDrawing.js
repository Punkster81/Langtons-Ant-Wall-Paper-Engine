////////////////////////////////GLOBALS Configuration
let cellSize = 6;
let stepsPerSecond = 100;


// Direction enum
const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    count: 4
};


// Grid and ant variables
let width, height, cols, rows;
let grid;
let ant = {
    x: 0,
    y: 0,
    dir: Direction.UP,
    state: 0
};
///////////////////////////////////////  

// Resize and initialize grid and ant
function resizeCanvas() {
    try {
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Snap canvas size to whole cells
        width = Math.floor(width / cellSize) * cellSize;
        height = Math.floor(height / cellSize) * cellSize;

        // Validate dimensions before proceeding
        const validation = validateDimensions(width, height, cellSize);
        if (!validation.valid) {
            showError(validation.error);
            return false;
        }

        if (validation.warning) {
            showError(validation.warning);
        }

        canvas.width = width;
        canvas.height = height;

        cols = validation.cols;
        rows = validation.rows;

        // Initialize grid
        grid = Array.from({ length: rows }, () => Array(cols).fill(0));

        // Start ant in center
        ant.x = Math.floor(cols / 2);
        ant.y = Math.floor(rows / 2);
        ant.dir = Direction.UP;
        ant.state = 0;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Grid info
        const totalCells = cols * rows;
        document.getElementById('gridInfo').textContent = `${cols}x${rows} (${totalCells.toLocaleString()} cells)`;

        return true;
    } catch (error) {
        showError(`Error resizing canvas: ${error.message}`);
        return false;
    }
}




const Turn = {
    LEFT: 'L',
    RIGHT: 'R',
    STRAIGHT: 'N',  // Forward (no turn)
    BACK: 'U', //uturn
    STAY: 'S'
};

const moves = ['L', 'R', 'N', 'U', 'S']; // Left, Right, Straight, Back, Stay

// Step function: perform one ant step
function stepAnt() {
    try {
        const { x, y } = ant;

        if (y < 0 || y >= rows || x < 0 || x >= cols) {
            ant.x = (ant.x + cols) % cols;
            ant.y = (ant.y + rows) % rows;
            return;
        }

        const cellColor = grid[y][x];
        const stateRules = rules[ant.state];
        if (!stateRules || !stateRules[cellColor]) {
            showError(`Missing rule for state ${ant.state} or color ${cellColor}`);
            stopAnimation();
            return;
        }

        const rule = stateRules[cellColor];

        // Write new color
        grid[y][x] = rule.writeColor;
        ctx.fillStyle = colors[rule.writeColor] || "#000000";
        ctx.fillRect(
            Math.floor(x * cellSize),
            Math.floor(y * cellSize),
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
          

        // Change direction
        const move = rule.move;
        let shouldMove = true;

        switch (move) {
            case Turn.LEFT:
                ant.dir = (ant.dir + 3) % 4; // -1 mod 4
                break;
            case Turn.RIGHT:
                ant.dir = (ant.dir + 1) % 4;
                break;
            case Turn.BACK:
                ant.dir = (ant.dir + 2) % 4;
                break;
            case Turn.STRAIGHT:
                //shouldMove = true;
                break;
            case Turn.STAY:
                shouldMove = false; // Cancel movement
                break;
        }


        // Move ant
        if (shouldMove) {
            switch (ant.dir) {
                case Direction.UP:
                    ant.y--;
                    break;
                case Direction.RIGHT:
                    ant.x++;
                    break;
                case Direction.DOWN:
                    ant.y++;
                    break;
                case Direction.LEFT:
                    ant.x--;
                    break;
            }
        }

        ant.x = (ant.x + cols) % cols;
        ant.y = (ant.y + rows) % rows;

        drawAnt();

        // Change to next state
        ant.state = rule.nextState || 0;
    } catch (error) {
        showError("Error Stepping: " + error);
    }

}

function drawAnt() {
    if (cellSize <= 1) return; // Too small to draw ant visibly

    const px = ant.x * cellSize + cellSize / 2;
    const py = ant.y * cellSize + cellSize / 2;
    const radius = cellSize / 2;

    ctx.beginPath();
    ctx.arc(px, py, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}
  
  



// Validate dimensions
function validateDimensions(w, h, cellSz) {
    const minCells = 10; // Minimum reasonable grid

    const cols = Math.floor(w / cellSz);
    const rows = Math.floor(h / cellSz);
    const totalCells = cols * rows;

    if (cols < minCells || rows < minCells) {
        return { valid: false, error: `Grid too small: ${cols}x${rows}. Minimum 10x10 cells.` };
    }

    // Performance warnings but don't block
    let warning = '';
    if (totalCells > 50000000) {
        warning = `WARNING: ${totalCells.toLocaleString()} cells may cause severe lag or crashes!`;
    } else if (totalCells > 10000000) {
        warning = `CAUTION: ${totalCells.toLocaleString()} cells may impact performance.`;
    } else if (totalCells > 1000000) {
        warning = `INFO: ${totalCells.toLocaleString()} cells - high detail mode.`;
    }

    return { valid: true, cols, rows, warning };
}

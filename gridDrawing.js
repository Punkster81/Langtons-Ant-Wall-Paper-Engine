////////////////////////////////GLOBALS Configuration
let cellSize = getCellSize();
let stepsPerSecond = getStepsPerSecond();
let secondsPerIteration = getIterationDuration();
let numberOfAnts = getAntCount();


// Grid and ant variables
let width, height, cols, rows;
let grid;

///////////////////////////////////////  

// Resize and initialize grid and ant
function resetIteration() {
    try {
        cellSize = getCellSize();
        stepsPerSecond = getStepsPerSecond();
        secondsPerIteration = getIterationDuration();
        numberOfAnts = getAntCount();

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


        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Grid info
        const totalCells = cols * rows;
        document.getElementById('gridInfo').textContent = `${cols}x${rows} (${totalCells.toLocaleString()} cells)`;

        recenterAnts();

        return true;
    } catch (error) {
        showError(`Error resizing canvas: ${error.message}`);
        return false;
    }
}


function setUpNewIteration() {
    try {
        cellSize = getCellSize();
        stepsPerSecond = getStepsPerSecond();
        secondsPerIteration = getIterationDuration();
        numberOfAnts = getAntCount();

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


        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Grid info
        const totalCells = cols * rows;
        document.getElementById('gridInfo').textContent = `${cols}x${rows} (${totalCells.toLocaleString()} cells)`;

        createAnts();

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

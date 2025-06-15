// Property storage object
const properties = {
    // Cell Size
    cellMode: 'randomCell',
    cellSize: 6,
    minCellSize: 1,
    maxCellSize: 12,
    
    // Speed  
    speedMode: 'randomSpeed',
    fixedSpeed: 50000,
    minSpeed: 50000,
    maxSpeed: 100000,
    
    // Colors
    colorMode: 'fixedColor',
    fixedColors: 2,
    minColors: 2,
    maxColors: 5,
    
    // Rules
    numberOfRules: 'fixedRules',
    fixedRules: 1,
    minRules: 1,
    maxRules: 5,
    
    // Ant
    showAnt: true,
    antColor: { r: 255, g: 0, b: 0 },
    
    // Seconds per Iteration (NEW)
    secondsPerIterationMode: 'fixedSeconds',
    fixedSecondsPerIteration: 20,
    minSecondsPerIteration: 5,
    maxSecondsPerIteration: 60,
    
    // Panel Location (NEW)
    panelLocation: 'topRight',
    
    // Default Ant Command JSON (NEW)
    defaultAntCommand: null
};

function getCellSize() {

    const mode = properties.cellMode;

    if (mode === "fixedCell") {
        return properties.cellSize;
    } else if (mode === "randomCell") {
        const min = properties.minCellSize;
        const max = properties.maxCellSize;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        return 6; // fallback
    }
}


// Function to apply steps per second changes
function getStepsPerSecond() {
    let speed = 50000; // Default speed in steps per second
    if (properties.speedMode === 'fixedSpeed') {
        speed = properties.fixedSpeed;
    } else {
        // Generate random speed between min and max
        speed = Math.floor(Math.random() * (properties.maxSpeed - properties.minSpeed + 1)) + properties.minSpeed;
    }
    return speed;   
}

// Helper function to parse the default ant command JSON safely
function parseDefaultAntCommand() {
    try {
        if (!properties.defaultAntCommand || properties.defaultAntCommand.trim() === '') {
            //console.warn('defaultAntCommand is empty, using fallback');
            return;
        }

         const data = JSON.parse(properties.defaultAntCommand);
  
        if(!data || !data.rules || !data.colors) {
            console.warn('Invalid defaultAntCommand structure, using fallback');
            return;
        }

        // Apply settings from imported JSON
        if (data.rules) rules = data.rules;
        if (data.colors) colors = data.colors;
  
        // Optionally reinitialize

        resizeCanvas();
        updateRulesBox();
    } catch (error) {
        console.warn('Invalid JSON in defaultAntCommand, using fallback:', error);
    }
}



// Helper function to get current iteration duration based on mode
function getIterationDuration() {
    switch (properties.secondsPerIterationMode) {
        case 'fixedSeconds':
            return properties.fixedSecondsPerIteration * 1000; // Convert to milliseconds
        case 'randomSeconds':
            const min = properties.minSecondsPerIteration * 1000;
            const max = properties.maxSecondsPerIteration * 1000;
            return Math.random() * (max - min) + min;
        case 'infinitySeconds':
            return Infinity; // Never ends
        default:
            return Infinity;
    }
}


function getStateCount() {
    if (properties.numberOfRules === 'fixedRules') {
        return properties.fixedRules;
    } else if (properties.numberOfRules === 'randomRules') {
        return Math.floor(Math.random() * (properties.maxRules - properties.minRules + 1)) + properties.minRules;
    } else {
        return 1; // Default fallback
    }
}

function getColorCount() {
    if (properties.colorMode === 'fixedColor') {
        return properties.fixedColors;
    } else if (properties.colorMode === 'randomColor') {
        return Math.floor(Math.random() * (properties.maxColors - properties.minColors + 1)) + properties.minColors;
    } else {
        return 2; // Default fallback
    }
}

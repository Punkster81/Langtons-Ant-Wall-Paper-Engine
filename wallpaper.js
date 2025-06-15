

// Convert Wallpaper Engine color format to RGB object
function parseColor(colorString) {
    const parts = colorString.split(' ');
    return {
        r: Math.round(parseFloat(parts[0]) * 255),
        g: Math.round(parseFloat(parts[1]) * 255),
        b: Math.round(parseFloat(parts[2]) * 255)
    };
}

// Property listener - just store values
window.wallpaperPropertyListener = {
    applyUserProperties: function (userProperties) {

        // Cell Size Properties
        if (userProperties.cellmode !== undefined) {
            properties.cellMode = userProperties.cellmode.value;
        }

        if (userProperties.cellsize !== undefined) {
            properties.cellSize = userProperties.cellsize.value;
            resetSimulation();
        }

        if (userProperties.mincellsize !== undefined) {
            properties.minCellSize = userProperties.mincellsize.value;
            
        }

        if (userProperties.maxcellsize !== undefined) {
            properties.maxCellSize = userProperties.maxcellsize.value;
        }

        // Speed Properties
        if (userProperties.speedmode !== undefined) {
            properties.speedMode = userProperties.speedmode.value;
        }

        if (userProperties.fixedspeed !== undefined) {
            properties.fixedSpeed = userProperties.fixedspeed.value;
        }

        if (userProperties.minspeed !== undefined) {
            properties.minSpeed = userProperties.minspeed.value;
        }

        if (userProperties.maxspeed !== undefined) {
            properties.maxSpeed = userProperties.maxspeed.value;
        }

        // Color Properties
        if (userProperties.colormode !== undefined) {
            properties.colorMode = userProperties.colormode.value;
        }

        if (userProperties.newproperty !== undefined) { // Fixed Colors
            properties.fixedColors = userProperties.newproperty.value;
        }

        if (userProperties.mincolors !== undefined) {
            properties.minColors = userProperties.mincolors.value;
        }

        if (userProperties.maxcolor !== undefined) {
            properties.maxColors = userProperties.maxcolor.value;
        }

        // Rules Properties
        if (userProperties.numberofrules !== undefined) {
            properties.numberOfRules = userProperties.numberofrules.value;
        }

        if (userProperties.fixedrules !== undefined) {
            properties.fixedRules = userProperties.fixedrules.value;
        }

        if (userProperties.minrules !== undefined) {
            properties.minRules = userProperties.minrules.value;
        }

        if (userProperties.maxrules !== undefined) {
            properties.maxRules = userProperties.maxrules.value;
        }

        // Ant(s) Properties
        if (userProperties.showant !== undefined) {
            properties.showAnt = userProperties.showant.value;
        }

        if (userProperties.antcolor !== undefined) {
            properties.antColor = parseColor(userProperties.antcolor.value);
        }
        
        if (userProperties.fixedNumberOfAnts !== undefined) {
            properties.fixedNumberOfAnts = userProperties.fixedNumberOfAnts.value;
        }

        if (userProperties.minNumberOfAnts !== undefined) {
            properties.minNumberOfAnts = userProperties.minNumberOfAnts.value;
        }

        if (userProperties.maxNumberOfAnts !== undefined) {
            properties.maxNumberOfAnts = userProperties.maxNumberOfAnts.value;
        }

        // Seconds per Iteration Properties
        if (userProperties.secondsperiterationmode !== undefined) {
            properties.secondsPerIterationMode = userProperties.secondsperiterationmode.value;
        }

        if (userProperties.fixedsecondsperiteration !== undefined) {
            properties.fixedSecondsPerIteration = userProperties.fixedsecondsperiteration.value;
        }

        if (userProperties.minsecondsperiteration !== undefined) {
            properties.minSecondsPerIteration = userProperties.minsecondsperiteration.value;
        }

        if (userProperties.maxsecondsperiteration !== undefined) {
            properties.maxSecondsPerIteration = userProperties.maxsecondsperiteration.value;
        }

        // Panel Location Property 
        if (userProperties.panellocation !== undefined) {
            properties.panelLocation = userProperties.panellocation.value;
        }

        // Default Ant Command JSON Property 
        if (userProperties.defaultantcommand !== undefined) {
            properties.defaultAntCommand = userProperties.defaultantcommand.value;
        }

        // Scheme Color // Uncomment if you want to use scheme color, not used
        // if (userProperties.schemecolor !== undefined) {
        //     properties.schemeColor = parseColor(userProperties.schemecolor.value);
        // }
        initializeWallPaperEngine();    
    }
};

function initializeWallPaperEngine() {
    parseDefaultAntCommand();
    updateCellSizeControls();
    updateStepsControls();
    updatePanelLocation();
    updateRulesControls();
    updateColorControls();
    updateSecondsControls();
    updatePanelLocation();
    updateAntsControls();

}

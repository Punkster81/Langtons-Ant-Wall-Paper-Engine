



// Error handling
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    setTimeout(() => {
        errorMsg.textContent = '';
    }, 3000);
}



function toggleControls() {
    const controls = document.getElementById('controls');
    const showBtn = document.getElementById('showControlsBtn');



    if (controls.classList.contains('controls-hidden')) {

        controls.classList.remove('controls-hidden');
        showBtn.classList.remove('visible');
    } else {

        controls.classList.add('controls-hidden');
        showBtn.classList.add('visible');
    }
}


window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });


const minSteps = 1;
const maxSteps = 200000; // change in wallpaper.properties cause cant use varaiable in their

//assign buttons their functions
function setUI() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        switch (e.key.toLowerCase()) {
            case 'r':
                resetSimulation();
                break;
            case 'h':
                toggleControls();
                break;
            case '+':
            case '=':
                if (cellSize < 20) {
                    cellSize++;
                    document.getElementById('cellSize').value = cellSize;
                    document.getElementById('cellSizeValue').textContent = cellSize;
                    resetSimulation();
                }
                break;
            case '-':
            case '_':
                if (cellSize > 1) {
                    cellSize--;
                    document.getElementById('cellSize').value = cellSize;
                    document.getElementById('cellSizeValue').textContent = cellSize;
                    resetSimulation();
                }
                break;
        }
    });


    document.getElementById('pauseResumeBtn').addEventListener('click', () => {
        if (!isPaused) {
            pauseAnimation();
        } else {
            unpauseAnimation();
        }
    });

    document.getElementById('saveCanvas').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'langtons-ant.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('speedModeSelect').addEventListener('change', function (e) {
        properties.speedMode = e.target.value;
        updateStepsControls();
    });

    document.getElementById('cellModeSelect').addEventListener('change', function (e) {
        properties.cellMode = e.target.value;
        updateCellSizeControls();
    });

    document.getElementById('colorModeSelect').addEventListener('change', function (e) {
        properties.colorMode = e.target.value;
        updateColorControls();
    });

    document.getElementById('rulesModeSelect').addEventListener('change', function (e) {
        properties.numberOfRules = e.target.value;
        updateRulesControls();
    });

    document.getElementById('randomRules').addEventListener("click", () => {

        stopAnimation();
        generateRandomRules(getColorCount(), getStateCount());
        updateRulesBox();
        resetSimulation();

    });

    document.getElementById('secondsModeSelect').addEventListener('input', function (e) {
        properties.secondsPerIterationMode = e.target.value;
        updateSecondsControls();
    });

    document.getElementById('showAntCheckbox').addEventListener('change', function (e) {
        properties.showAnt = e.target.checked;
    });

    document.getElementById('antColorPicker').addEventListener('change', function (e) {
        const hex = e.target.value;
        properties.antColor = hexToRGB(hex);
    });


    document.getElementById('controlsLocationSelect').addEventListener('change', function (e) {
        properties.panelLocation = e.target.value;
        applyPanelLocation();
    });


    document.getElementById('resetBtn').addEventListener('click', resetSimulation);
    document.getElementById('toggleBtn').addEventListener('click', toggleControls);
    document.getElementById('showControlsBtn').addEventListener('click', toggleControls);
    document.getElementById('applyStatesBtn').addEventListener('click', applyCustomRuleSet);



}

function hexToRGB(hex) {
    const parsedHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const bigint = parseInt(parsedHex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function updateRulesBox() {
    let rules = exportCustomRulesToJSON();
    document.getElementById('customStates').value = rules;
}






// Function to update cell size controls
function updateCellSizeControls() {
    const cellSizeDiv = document.getElementById('cellControls');
    let cellsControlDropdown = document.getElementById('cellModeSelect');
    cellsControlDropdown.value = properties.cellMode; // Set the dropdown to the current cell mode

    if (properties.cellMode === 'fixedCell') {
        // Show single slider for fixed cell size
        cellSizeDiv.innerHTML = `
            <label>
                Cell Size:
                <input type="range" id="cellSizeSlider" min="1" value="${properties.cellSize}" max="100">
                <span id="cellSizeValue">${properties.cellSize}</span>px
            </label>
        `;

        // Event listener for fixed cell size
        document.getElementById('cellSizeSlider').addEventListener('input', function (e) {
            properties.cellSize = parseInt(e.target.value);
            document.getElementById('cellSizeValue').textContent = properties.cellSize;
            // Apply the cell size change to your simulation
            resetSimulation();
        });

    } else if (properties.cellMode === 'randomCell') {
        // Show min/max sliders for random cell size
        cellSizeDiv.innerHTML = `
            <label>
                Min Cell Size:
                <input type="range" id="minCellSizeSlider" min="1" value="${properties.minCellSize}" max="100">
                <span id="minCellSizeValue">${properties.minCellSize}</span>px
            </label>
            <label>
                Max Cell Size:
                <input type="range" id="maxCellSizeSlider" min="1" value="${properties.maxCellSize}" max="100">
                <span id="maxCellSizeValue">${properties.maxCellSize}</span>px
            </label>
        `;

        // Event listeners for min/max cell size
        document.getElementById('minCellSizeSlider').addEventListener('input', function (e) {
            properties.minCellSize = parseInt(e.target.value);
            document.getElementById('minCellSizeValue').textContent = properties.minCellSize;

            // Ensure min doesn't exceed max
            if (properties.minCellSize > properties.maxCellSize) {
                properties.maxCellSize = properties.minCellSize;
                document.getElementById('maxCellSizeSlider').value = properties.maxCellSize;
                document.getElementById('maxCellSizeValue').textContent = properties.maxCellSize;
                //dont reset simulation here, as it will be take affect in the next iteration
            }
        });

        document.getElementById('maxCellSizeSlider').addEventListener('input', function (e) {
            properties.maxCellSize = parseInt(e.target.value);
            document.getElementById('maxCellSizeValue').textContent = properties.maxCellSize;

            // Ensure max doesn't go below min
            if (properties.maxCellSize < properties.minCellSize) {
                properties.minCellSize = properties.maxCellSize;
                document.getElementById('minCellSizeSlider').value = properties.minCellSize;
                document.getElementById('minCellSizeValue').textContent = properties.minCellSize;
                //dont reset simulation here, as it will be take affect in the next iteration
            }


        });
    }
}






// Function to update steps/speed controls
function updateStepsControls() {
    const stepsControlsDiv = document.getElementById('stepsControls');

    let stepsControlDropdown = document.getElementById('speedModeSelect');
    stepsControlDropdown.value = properties.speedMode; // Set the dropdown to the current speed mode

    if (properties.speedMode === 'fixedSpeed') {
        // Show single slider for fixed speed
        stepsControlsDiv.innerHTML = `
            <label>
                Steps per Second:
                <input type="range" id="stepsSlider" min="1" value="${properties.fixedSpeed}" max="200000">
                <span id="stepsValue">${properties.fixedSpeed}</span>
            </label>
        `;

        // Event listener for fixed speed
        document.getElementById('stepsSlider').addEventListener('input', function (e) {
            properties.fixedSpeed = parseInt(e.target.value);
            document.getElementById('stepsValue').textContent = properties.fixedSpeed;
        });

    } else if (properties.speedMode === 'randomSpeed') {
        // Show min/max sliders for random speed
        stepsControlsDiv.innerHTML = `
            <label>
                Min Steps per Second:
                <input type="range" id="minStepsSlider" min="1" value="${properties.minSpeed}" max="200000">
                <span id="minStepsValue">${properties.minSpeed}</span>
            </label>
            <label>
                Max Steps per Second:
                <input type="range" id="maxStepsSlider" min="1" value="${properties.maxSpeed}" max="200000">
                <span id="maxStepsValue">${properties.maxSpeed}</span>
            </label>
        `;

        // Event listeners for min/max speed
        document.getElementById('minStepsSlider').addEventListener('input', function (e) {
            properties.minSpeed = parseInt(e.target.value);
            document.getElementById('minStepsValue').textContent = properties.minSpeed;

            // Ensure min doesn't exceed max
            if (properties.minSpeed > properties.maxSpeed) {
                properties.maxSpeed = properties.minSpeed;
                document.getElementById('maxStepsSlider').value = properties.maxSpeed;
                document.getElementById('maxStepsValue').textContent = properties.maxSpeed;
            }
        });

        document.getElementById('maxStepsSlider').addEventListener('input', function (e) {
            properties.maxSpeed = parseInt(e.target.value);
            document.getElementById('maxStepsValue').textContent = properties.maxSpeed;

            // Ensure max doesn't go below min
            if (properties.maxSpeed < properties.minSpeed) {
                properties.minSpeed = properties.maxSpeed;
                document.getElementById('minStepsSlider').value = properties.minSpeed;
                document.getElementById('minStepsValue').textContent = properties.minSpeed;
            }
        });
    }
}


// Function to update color controls
function updateColorControls() {
    const colorControlsDiv = document.getElementById('colorControls');

    let colorControlDropdown = document.getElementById('colorModeSelect');
    colorControlDropdown.value = properties.colorMode; // Set the dropdown to the current color mode

    if (properties.colorMode === 'fixedColor') {
        // Show single input for fixed colors
        colorControlsDiv.innerHTML = `
            <label>
                Number of Colors:
                <input type="number" id="colorsInput" min="2" max="20" value="${properties.fixedColors}">
            </label>
        `;

        // Event listener for fixed colors
        document.getElementById('colorsInput').addEventListener('input', function (e) {
            properties.fixedColors = parseInt(e.target.value) || 2;
        });

    } else if (properties.colorMode === 'randomColor') {
        // Show min/max inputs for random colors
        colorControlsDiv.innerHTML = `
            <label>
                Min Colors:
                <input type="number" id="minColorsInput" min="2" max="20" value="${properties.minColors}">
            </label>
            <label>
                Max Colors:
                <input type="number" id="maxColorsInput" min="2" max="20" value="${properties.maxColors}">
            </label>
        `;

        // Event listeners for min/max colors
        document.getElementById('minColorsInput').addEventListener('input', function (e) {
            properties.minColors = parseInt(e.target.value) || 2;

            // Ensure min doesn't exceed max
            if (properties.minColors > properties.maxColors) {
                properties.maxColors = properties.minColors;
                document.getElementById('maxColorsInput').value = properties.maxColors;
            }
        });

        document.getElementById('maxColorsInput').addEventListener('input', function (e) {
            properties.maxColors = parseInt(e.target.value) || 2;

            // Ensure max doesn't go below min
            if (properties.maxColors < properties.minColors) {
                properties.minColors = properties.maxColors;
                document.getElementById('minColorsInput').value = properties.minColors;
            }
        });
    }
}

// Function to update rules controls
function updateRulesControls() {
    const rulesControlsDiv = document.getElementById('rulesControls');

    let rulesControlDropdown = document.getElementById('rulesModeSelect');
    rulesControlDropdown.value = properties.numberOfRules; // Set the dropdown to the current rules mode

    if (properties.numberOfRules === 'fixedRules') {
        // Show single input for fixed rules
        rulesControlsDiv.innerHTML = `
            <label>
                Number of Rules:
                <input type="number" id="rulesInput" min="1" max="100" value="${properties.fixedRules}">
            </label>
        `;

        // Event listener for fixed rules
        document.getElementById('rulesInput').addEventListener('input', function (e) {
            properties.fixedRules = parseInt(e.target.value) || 1;
        });

    } else if (properties.numberOfRules === 'randomRules') {
        // Show min/max inputs for random rules
        rulesControlsDiv.innerHTML = `
            <label>
                Min Rules:
                <input type="number" id="minRulesInput" min="1" max="100" value="${properties.minRules}">
            </label>
            <label>
                Max Rules:
                <input type="number" id="maxRulesInput" min="1" max="100" value="${properties.maxRules}">
            </label>
        `;

        // Event listeners for min/max rules
        document.getElementById('minRulesInput').addEventListener('input', function (e) {
            properties.minRules = parseInt(e.target.value) || 1;

            // Ensure min doesn't exceed max
            if (properties.minRules > properties.maxRules) {
                properties.maxRules = properties.minRules;
                document.getElementById('maxRulesInput').value = properties.maxRules;
            }
        });

        document.getElementById('maxRulesInput').addEventListener('input', function (e) {
            properties.maxRules = parseInt(e.target.value) || 1;

            // Ensure max doesn't go below min
            if (properties.maxRules < properties.minRules) {
                properties.minRules = properties.maxRules;
                document.getElementById('minRulesInput').value = properties.minRules;
            }
        });
    }
}


// Function to update seconds per iteration controls
function updateSecondsControls() {
    const secondsControlsDiv = document.getElementById('secondsControls');
    //seconds is checked during animation, so no need to call a function to update

    let secondsControlDropdown = document.getElementById('secondsModeSelect');
    secondsControlDropdown.value = properties.secondsPerIterationMode; // Set the dropdown to the current seconds mode

    if (properties.secondsPerIterationMode === 'fixedSeconds') {
        secondsControlsDiv.innerHTML = `
            <label>
                Seconds per Iteration:
                <input type="range" id="secondsSlider" min="1" max="3600" value="${properties.fixedSecondsPerIteration}">
                <span id="secondsValue">${properties.fixedSecondsPerIteration}</span>s
            </label>
        `;

        document.getElementById('secondsSlider').addEventListener('input', function (e) {
            properties.fixedSecondsPerIteration = parseInt(e.target.value);
            document.getElementById('secondsValue').textContent = properties.fixedSecondsPerIteration;
        });

    } else if (properties.secondsPerIterationMode === 'randomSeconds') {
        secondsControlsDiv.innerHTML = `
            <label>
                Min Seconds per Iteration:
                <input type="range" id="minSecondsSlider" min="1" max="3600" value="${properties.minSecondsPerIteration}">
                <span id="minSecondsValue">${properties.minSecondsPerIteration}</span>s
            </label>
            <label>
                Max Seconds per Iteration:
                <input type="range" id="maxSecondsSlider" min="1" max="3600" value="${properties.maxSecondsPerIteration}">
                <span id="maxSecondsValue">${properties.maxSecondsPerIteration}</span>s
            </label>
        `;

        document.getElementById('minSecondsSlider').addEventListener('input', function (e) {
            properties.minSecondsPerIteration = parseInt(e.target.value);
            document.getElementById('minSecondsValue').textContent = properties.minSecondsPerIteration;

            if (properties.minSecondsPerIteration > properties.maxSecondsPerIteration) {
                properties.maxSecondsPerIteration = properties.minSecondsPerIteration;
                document.getElementById('maxSecondsSlider').value = properties.maxSecondsPerIteration;
                document.getElementById('maxSecondsValue').textContent = properties.maxSecondsPerIteration;
            }
        });

        document.getElementById('maxSecondsSlider').addEventListener('input', function (e) {
            properties.maxSecondsPerIteration = parseInt(e.target.value);
            document.getElementById('maxSecondsValue').textContent = properties.maxSecondsPerIteration;

            if (properties.maxSecondsPerIteration < properties.minSecondsPerIteration) {
                properties.minSecondsPerIteration = properties.maxSecondsPerIteration;
                document.getElementById('minSecondsSlider').value = properties.minSecondsPerIteration;
                document.getElementById('minSecondsValue').textContent = properties.minSecondsPerIteration;
            }
        });

    } else if (properties.secondsPerIterationMode === 'infinitySeconds') {
        secondsControlsDiv.innerHTML = `
            <div style="opacity: 0.7; font-style: italic;">
                Infinite duration - simulation runs until manually reset
            </div>
        `;
    }
}




function applyPanelLocation() {
    const panel = document.querySelector('.controls'); // Changed to target .controls
    const showPanelBtn = document.querySelector('.show-controls-btn');
    
    let LocationSelect = document.getElementById('controlsLocationSelect');
    console.log(LocationSelect);
    LocationSelect.value = properties.panelLocation;

    if (!panel) return;
    if (!showPanelBtn) return;
    
    // Reset all position classes
    panel.classList.remove('top-left', 'top-right', 'bottom-left', 'bottom-right');
    
    // Apply the selected position
    switch (properties.panelLocation) {
        case 'topLeft':
            showPanelBtn.classList.add('top-left');
            panel.classList.add('top-left');
            break;
        case 'topRight':
            showPanelBtn.classList.add('top-right');
            panel.classList.add('top-right');
            break;
        case 'bottomLeft':
            showPanelBtn.classList.add('bottom-left');
            panel.classList.add('bottom-left');
            break;
        case 'bottomRight':
            showPanelBtn.classList.add('bottom-right');
            panel.classList.add('bottom-right');
            break;
    }
}
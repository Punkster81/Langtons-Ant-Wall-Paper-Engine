



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



//assign buttons their functions
document.addEventListener('DOMContentLoaded', function () {

    const cellSizeInput = document.getElementById('cellSize');
    const cellSizeValue = document.getElementById('cellSizeValue');
  
    // Calculate max based on user screen size (ensures minimum 10x10 grid)
    const maxPossibleSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 15);
    cellSizeInput.max = Math.max(1, maxPossibleSize);
  
    // Update label on input
    cellSizeInput.addEventListener('input', () => {
      cellSizeValue.textContent = cellSizeInput.value;
      cellSize = parseInt(cellSizeInput.value);
      resetSimulation();
    });

    const minSteps = 1;
    const maxSteps = 200000;

    // Function to convert scaled stepsPerFrame to slider value (inverse of exponentiation)
    function stepsToSliderValue(steps) {
        return Math.log(steps / minSteps) / Math.log(maxSteps / minSteps) * 100;
    }

    // On page load, set slider value and display scaled steps value:
    const initialSteps = 60;
    const initialSliderValue = stepsToSliderValue(initialSteps);

    const slider = document.getElementById('stepsPerFrame');
    const display = document.getElementById('stepsValue');

    slider.value = initialSliderValue;
    display.textContent = initialSteps.toLocaleString();

    slider.addEventListener('input', function (e) {
        const sliderValue = parseFloat(e.target.value);
        const exponent = sliderValue / 100;
        stepsPerSecond = Math.round(minSteps * Math.pow(maxSteps / minSteps, exponent));
        display.textContent = stepsPerSecond.toLocaleString();
    });






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

    const colorInput = document.getElementById('inputColors');
    const stateInput = document.getElementById('inputStates');
  
    // Enforce minimum values as user types
    colorInput.addEventListener('input', () => {
      if (parseInt(colorInput.value) < 2) colorInput.value = 2;
    });
    stateInput.addEventListener('input', () => {
      if (parseInt(stateInput.value) < 1) stateInput.value = 1;
    });

    document.getElementById('randomRules').addEventListener("click", () => {

        stopAnimation();
        generateRandomRules(colorInput.value, stateInput.value);
        updateRulesBox();
        resetSimulation();
        
    });
    document.getElementById('resetBtn').addEventListener('click', resetSimulation);
    document.getElementById('toggleBtn').addEventListener('click', toggleControls);
    document.getElementById('showControlsBtn').addEventListener('click', toggleControls);
    document.getElementById('applyStatesBtn').addEventListener('click', applyCustomRuleSet);
});



function updateRulesBox(){
    let rules = exportCustomRulesToJSON();
    document.getElementById('customStates').value = rules;
}


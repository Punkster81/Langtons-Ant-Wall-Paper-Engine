// Animation control
let animationId;
let isPaused = false;
let isRunning = false;

// Animation control functions
function startAnimation() {
    if (!isPaused && !isRunning) {
        isRunning = true;
        // Reset timestamp to avoid "catch up" spikes
        requestAnimationFrame(ts => {
            lastTimestamp = ts;
            animationId = requestAnimationFrame(animate); // Start the animation with a proper timestamp
        });
    }
}

function stopAnimation() {
    if (animationId && isRunning) {
        cancelAnimationFrame(animationId);
        animationId = null;
        isRunning = false;
    }
}


function pauseAnimation() {
    isPaused = true;
    stopAnimation();
    document.getElementById('pauseResumeBtn').textContent = '▶️';
}

function unpauseAnimation() {
    isPaused = false;
    startAnimation();
    document.getElementById('pauseResumeBtn').textContent = '⏸️';
}

let lastTimestamp = null;
let simulationStartTime = null;

function animate(timestamp) {
    if (isPaused || !isRunning) return;  // stop if paused

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    if (!simulationStartTime) {
        simulationStartTime = timestamp; // Initialize simulation start time
    }

    // Check if simulation duration exceeded
    if (timestamp - simulationStartTime > (properties.secondsPerIterationMode !== 'randomSeconds' ? getIterationDuration() : stepsPerSecond))// if fixed/infinite duration, get fixed duration, if random, random is set at cavas resize, once per run dont get random every frame
    {
        generateRandomRules(6, 6);
        updateRulesBox();
        resetSimulation();
        return;
    }

    const elapsed = timestamp - lastTimestamp;

    const interval = 1000 / (properties.speedMode === 'fixedSpeed' ? getStepsPerSecond() : stepsPerSecond); // ms per step //if fixed speed get fixed speed, if random, random is set at cavas resize, once per run dont get random every frame

    if (elapsed >= interval) {
        const stepsToRun = Math.floor(elapsed / interval);
        for (let i = 0; i < stepsToRun; i++) {
            if (isPaused || !isRunning) return;
            stepAnt();
        }
        lastTimestamp = timestamp - (elapsed % interval);
    }

    animationId = requestAnimationFrame(animate);
}



function resetSimulation() {
    stopAnimation();
    simulationStartTime = null;
    if (resizeCanvas()) {
        startAnimation();
    }
}
// Animation control
let animationId;
let isRunning = false;

// Animation control functions
function startAnimation() {
    document.getElementById('pauseResumeBtn').textContent = '⏸️';
    if (!isRunning) {
        isRunning = true;
        // Reset timestamp to avoid "catch up" spikes
        requestAnimationFrame(ts => {
            lastTimestamp = ts;
            animationId = requestAnimationFrame(animate); // Start the animation with a proper timestamp
        });
    }
}

function stopAnimation() {
    document.getElementById('pauseResumeBtn').textContent = '▶️';
    if (animationId && isRunning) {
        cancelAnimationFrame(animationId);
        animationId = null;
        isRunning = false;
    }
}



let lastTimestamp = null;
let simulationStartTime = null;
let tempOverrideSpeed = null;
let loopDuration;
let stepsTaken;
let frameCount = 0;
let fpsStartTime = null;
let currentFPS = 0;
let lastFrameTime = 0;

function animate(timestamp) {
    if (!isRunning) return;

    // Calculate actual FPS
    if (!fpsStartTime) {
        fpsStartTime = timestamp;
        lastFrameTime = timestamp;
    }

    frameCount++;

    // Update FPS every second
    if (timestamp - fpsStartTime >= 1000) {
        currentFPS = Math.round((frameCount * 1000) / (timestamp - fpsStartTime));
        frameCount = 0;
        fpsStartTime = timestamp;
    }

    // Calculate frame time (time between frames)
    lastFrameTime = timestamp;

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    if (!simulationStartTime) {
        simulationStartTime = timestamp;
        stepsTaken = 0;
    }

    // Check if simulation duration exceeded
    if (properties.secondsPerIterationMode != "infinitySeconds" && timestamp - simulationStartTime > secondsPerIteration) {
        newSimulation();
        return;
    }

    const elapsed = timestamp - lastTimestamp;
    const actualSpeed = tempOverrideSpeed ?? stepsPerSecond;
    const interval = 1000 / actualSpeed;

    if (elapsed >= interval) {
        const stepsToRun = Math.floor(elapsed / interval);
        const maxSteps = Math.min(stepsToRun, actualSpeed);

        // Measure ant stepping performance (NOT FPS)
        const loopStartTime = performance.now();
        const antsLength = ants.length;

        for (let i = 0; i < maxSteps && isRunning; i++) {
            for (let antIndex = 0; antIndex < antsLength; antIndex++) {
                const ant = ants[antIndex];
                if (ant) {
                    ant.step();
                    stepsTaken++;
                }
            }
        }
        if (properties.showAnt && cellSize > 1) {
            for (let antIndex = 0; antIndex < antsLength; antIndex++) {
                const ant = ants[antIndex];
                if (ant) {
                    ant.drawAnt();
                }
            }
        }

        const loopEndTime = performance.now();
        loopDuration = loopEndTime - loopStartTime;

        // Performance adjustment logic - keep your original threshold
        const maxLoopThreshold = 200;
        if (loopDuration > maxLoopThreshold) {
            const excessTime = loopDuration - maxLoopThreshold;
            const scalingFactor = 0.02 * Math.floor(loopDuration / maxLoopThreshold);
            const newSpeed = Math.max(1, Math.floor(actualSpeed * (1 - scalingFactor)))
            tempOverrideSpeed = newSpeed;

            showError(`Performance adjustment: Loop took ${loopDuration.toFixed(2)}ms (${excessTime.toFixed(2)}ms over limit), reducing speed by ${(scalingFactor * 100).toFixed(0)}% to ${tempOverrideSpeed} from ${actualSpeed} steps/sec.`);
        }

        // Timing adjustment
        lastTimestamp = stepsToRun > maxSteps ? timestamp : timestamp - (elapsed % interval);

    }

    animationId = requestAnimationFrame(animate);
}


function resetSimulation() {
    let currentlyRunning = isRunning; // Store current running state
    stopAnimation();
    simulationStartTime = null;
    if (resetIteration() && currentlyRunning) {
        startAnimation();
    }
}


function newSimulation(data = null) {
    let currentlyRunning = isRunning; // Store current running state
    stopAnimation();
    simulationStartTime = null;
    if (setUpNewIteration(data) && currentlyRunning) {
        startAnimation();
    }
}

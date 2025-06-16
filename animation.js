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

let stepsTaken


function animate(timestamp) {
    if (!isRunning) return;  // stop if paused

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    if (!simulationStartTime) {
        simulationStartTime = timestamp; // Initialize simulation start time
        stepsTaken = 0;
    }

    // Check if simulation duration exceeded
    if (timestamp - simulationStartTime > secondsPerIteration)// if fixed/infinite duration, get fixed duration, if random, random is set at cavas resize, once per run dont get random every frame
    {
        newSimulation();
        return;
    }

    const elapsed = timestamp - lastTimestamp; //in ms


    const actualSpeed = tempOverrideSpeed ?? stepsPerSecond;

    const interval = 1000 / actualSpeed; // ms per step //if fixed speed get fixed speed, if random, random is set at cavas resize, once per run dont get random every frame

    if (elapsed >= interval) {
        const stepsToRun = Math.floor(elapsed / interval);

        // CHANGED: Cap the maximum catch-up to 1 second worth of steps
        const maxSteps = Math.min(stepsToRun, actualSpeed); // Cap to 1 second worth

        // Start timing the ant stepping loop
        const loopStartTime = performance.now();

        for (let i = 0; i < maxSteps && isRunning; i++) {
            ants.forEach(ant => ant && ant.step());
        }
        stepsTaken+= maxSteps * ants.length;

        // Check if the loop took too long and adjust speed accordingly
        const loopEndTime = performance.now();
        loopDuration = loopEndTime - loopStartTime;
        const frameMaxThreshold = 200;
        if (loopDuration > frameMaxThreshold) {
            // Calculate scaling factor based on how far over the limit we are
            const excessTime = loopDuration - frameMaxThreshold; // How much over

            const scalingFactor = .10
            const newSpeed = Math.max(1, Math.floor(actualSpeed * (1-scalingFactor)));
            tempOverrideSpeed = newSpeed;

            showError(`Performance adjustment: Loop took ${loopDuration.toFixed(2)}ms (${excessTime.toFixed(2)}ms over limit), reducing speed by ${scalingFactor*100}% to ${tempOverrideSpeed} from ${actualSpeed} steps/sec`);
        }

        // CHANGED: If we hit the cap, reset timing to prevent further catch-up
        if (stepsToRun > maxSteps) {
            // We hit the cap, so reset timing to current time (skip excess frames)
            lastTimestamp = timestamp;
        } else {
            // Normal timing adjustment
            lastTimestamp = timestamp - (elapsed % interval);
        }
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


function newSimulation() {
    stopAnimation();
    simulationStartTime = null;
    if (setUpNewIteration()) {
        startAnimation();
    }
}
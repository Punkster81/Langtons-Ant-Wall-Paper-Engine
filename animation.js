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


function pauseAnimation(){
    isPaused = true;
    stopAnimation();
    document.getElementById('pauseResumeBtn').textContent = '▶️';
}

function unpauseAnimation(){
    isPaused = false;
    startAnimation();
    document.getElementById('pauseResumeBtn').textContent = '⏸️';
}

let lastTimestamp = 0;

function animate(timestamp) {
    if (isPaused || !isRunning) return;  // stop if paused

    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;


    const interval = 1000 / stepsPerSecond; // ms per step

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



// Control functions (now properly global)
function resetSimulation() {
    stopAnimation();
    if (resizeCanvas()) {
        startAnimation();
    }
}
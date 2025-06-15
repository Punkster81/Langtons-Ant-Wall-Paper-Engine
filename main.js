// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// Event listeners
document.addEventListener('DOMContentLoaded', function() {

  initializeWallPaperEngine();
  setUI();

  // Initialize
  if (resizeCanvas()) {
    updateRulesBox();
    startAnimation();
  }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseAnimation();
    } else {
        unpauseAnimation();
    }
  });
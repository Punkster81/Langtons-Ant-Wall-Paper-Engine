// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// Event listeners
document.addEventListener('DOMContentLoaded', function() {

  initializeWallPaperEngine();
  setUI();



  // Initialize
  if (setUpNewIteration()) {
    startAnimation();
  }
});


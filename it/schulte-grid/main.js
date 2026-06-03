// get a random number
const getRandomNum = (gridNum) => {
  const indexOfNumArr = Math.floor(Math.random() * gridNum);
  return indexOfNumArr + 1;
};

const createGridItems = (gridNum) => {
  const grid = document.getElementById("grid" + gridNum);
  grid.innerHTML = '';
  
  for (let i = 0; i < gridNum * gridNum; i++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute('role', 'gridcell');
    gridItem.setAttribute('tabindex', '0');
    gridItem.setAttribute('aria-label', `Number ${i + 1} cell`);
    
    // Add click event for desktop
    gridItem.onclick = () => clickCell(gridItem, gridNum);
    
    // Add touch events for mobile devices
    let touchStartTime = 0;
    let hasMoved = false;
    
    gridItem.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      hasMoved = false;
      gridItem.classList.add('touching');
    }, { passive: true });
    
    gridItem.addEventListener('touchmove', (e) => {
      hasMoved = true;
    }, { passive: true });
    
    gridItem.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      gridItem.classList.remove('touching');
      
      // Only trigger click if touch was short and didn't move much
      if (!hasMoved && touchDuration < 500) {
        e.preventDefault();
        clickCell(gridItem, gridNum);
      }
    }, { passive: false });
    
    // Prevent context menu on long press
    gridItem.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Add keyboard support for accessibility
    gridItem.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickCell(gridItem, gridNum);
      }
    };
    grid.appendChild(gridItem);
  }
};

// put the different random numbers into each grid cell
const setDiffRandomNumToEachCell = (gridNum) => {
  let elem = document.getElementById("grid" + gridNum);
  let elements = elem.getElementsByClassName("grid-item");
  
  let numbers = [];
  for (let i = 1; i <= gridNum * gridNum; i++) {
    numbers.push(i);
  }
  
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = numbers[i];
    elements[i].setAttribute('aria-label', `Number ${numbers[i]} cell`);
  }
};

const resetGrids = (gridNum) => {
  createGridItems(gridNum);
  setDiffRandomNumToEachCell(gridNum);
  index(false, true);
  toggleShowOrHide(false);
  toggleShowOrHideGridBtn(false);
};

const showGrid = (gridNum) => {
  document.getElementById("stopwatch").classList.remove("hidden");

  resetStopwatch();

  document.getElementById("grid3").classList.add("hidden");
  document.getElementById("grid4").classList.add("hidden");
  document.getElementById("grid5").classList.add("hidden");
  document.getElementById("grid6").classList.add("hidden");
  document.getElementById("grid7").classList.add("hidden");

  resetGrids(gridNum);
  document.getElementById("grid" + gridNum).classList.remove("hidden");

  toggleShowOrHideGridBtn(false);

  stopwatchElem.innerHTML = `${get2digits(minutes)} : ${get2digits(seconds)}`;
};

let global = {
  minutes: 0,
  seconds: 0,
  intervalID: 0,
  stopwatchElem: document.getElementById("stopwatch"),
};

let minutes = 0;
let seconds = 0;
const get2digits = (num) => {
  num = Math.floor(num);
  if (num < 10) {
    return "0" + num;
  }
  return num;
};

let intervalID;
let stopwatchElem = document.getElementById("stopwatch");
const stopwatch = (cellNum, gridNum) => {
  const timeRun = () => {
    if (seconds < 60) {
      seconds = seconds + 1;
    }
    if (seconds === 60) {
      minutes = minutes + 1;
      seconds = 0;
    }
    stopwatchElem.innerHTML = `${get2digits(minutes)} : ${get2digits(seconds)}`;
  };
  if (cellNum === 1) {
    intervalID = setInterval(timeRun, 1000);
  }
  if (cellNum === gridNum * gridNum) {
    clearInterval(intervalID);
  }
};

// press each grid cell in numerical order
const clickCell = (elem, gridNum) => {
  let cellNum = parseInt(elem.innerText);
  const expectedNum = index(false, false);
  
  stopwatch(cellNum, gridNum);
  
  if (expectedNum === cellNum) {
    // Correct number clicked
    index(true, false);
    elem.style.backgroundColor = "#e6d7c3";
    toggleShowOrHideGridBtn(false);
    
    // Check if game is completed after incrementing the counter
    if (index(false, false) === gridNum * gridNum + 1) {
      toggleShowOrHide(true);
    }
  }
};

// ** set the gloable var i in block (closure)
const index = (() => {
  let i = 1;
  return (isIncrease, isReset) => {
    if (isIncrease) {
      return i++;
    }
    if (isReset) {
      i = 1;
    }
    return i;
  };
})();

// toggle remove class 'hidden'
const toggleShowOrHideGridBtn = (isShown) => {};

// Modal functions
const showModal = () => {
  const modal = document.getElementById("gameModal");
  const completionTime = document.getElementById("completionTime");
  const scoreRating = document.getElementById("scoreRating");
  const scoreReference = document.getElementById("scoreReference");
  const stopwatch = document.getElementById("stopwatch").textContent;
  
  // Set completion time
  completionTime.textContent = `Completion Time: ${stopwatch}`;
  
  // Calculate score and rating
  const { rating, score, worldRecord } = calculateScore();
  scoreRating.textContent = score;
  scoreRating.className = `score-rating ${rating.toLowerCase()}`;
  
  // Set score reference
  scoreReference.innerHTML = getScoreReference();
  
  // Show modal with animation
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
};

// Calculate score based on completion time and grid size
const calculateScore = () => {
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  const gridSize = parseInt(currentGrid.id.replace("grid", ""));
  
  // Parse completion time
  const timeText = document.getElementById("stopwatch").textContent;
  const [minutes, seconds] = timeText.split(':').map(s => parseInt(s.trim()));
  const totalSeconds = minutes * 60 + seconds;
  
  // Realistic performance standards based on actual user data and cognitive training research
  const standards = {
    3: { 
      excellent: 5,    // Exceptional level
      good: 8,         // Advanced level
      average: 12,     // Intermediate level
      worldRecord: 3   // Elite reference
    },
    4: { 
      excellent: 10,   // Exceptional level
      good: 15,        // Advanced level
      average: 22,     // Intermediate level
      worldRecord: 6   // Elite reference
    },
    5: { 
      excellent: 18,   // Exceptional level
      good: 25,        // Advanced level
      average: 35,     // Intermediate level
      worldRecord: 12  // Elite reference
    },
    6: { 
      excellent: 28,   // Exceptional level
      good: 40,        // Advanced level
      average: 55,     // Intermediate level
      worldRecord: 20  // Elite reference
    },
    7: { 
      excellent: 42,   // Exceptional level
      good: 60,        // Advanced level
      average: 80,     // Intermediate level
      worldRecord: 30  // Elite reference
    }
  };
  
  const standard = standards[gridSize];
  let rating, score;
  
  if (totalSeconds <= standard.excellent) {
    rating = "Exceptional";
    score = "🏆 Exceptional Performance!";
  } else if (totalSeconds <= standard.good) {
    rating = "Advanced";
    score = "⭐ Advanced Performance!";
  } else if (totalSeconds <= standard.average) {
    rating = "Intermediate";
    score = "👍 Intermediate Performance";
  } else {
    rating = "Beginner";
    score = "💪 Keep Practicing!";
  }
  
  return { rating, score, worldRecord: standard.worldRecord };
};

// Get score reference for current grid size
const getScoreReference = () => {
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  const gridSize = parseInt(currentGrid.id.replace("grid", ""));
  
  // Realistic performance standards based on actual user performance data
  const references = {
    3: {
      exceptional: "&lt;5s",
      advanced: "5-8s", 
      intermediate: "8-12s",
      elite: "~3s"
    },
    4: {
      exceptional: "&lt;10s",
      advanced: "10-15s",
      intermediate: "15-22s",
      elite: "~6s"
    },
    5: {
      exceptional: "&lt;18s",
      advanced: "18-25s", 
      intermediate: "25-35s",
      elite: "~12s"
    },
    6: {
      exceptional: "&lt;28s",
      advanced: "28-40s",
      intermediate: "40-55s",
      elite: "~20s"
    },
    7: {
      exceptional: "&lt;42s",
      advanced: "42-60s",
      intermediate: "60-80s",
      elite: "~30s"
    }
  };
  
  const ref = references[gridSize];
  return `
    <h4>Realistic ${gridSize}x${gridSize} Grid Performance Standards:</h4>
    <ul>
      <li><strong>🏆 Exceptional:</strong> ${ref.exceptional}</li>
      <li><strong>⭐ Advanced:</strong> ${ref.advanced}</li>
      <li><strong>👍 Intermediate:</strong> ${ref.intermediate}</li>
      <li><strong>🥇 Elite Reference:</strong> ${ref.elite}</li>
    </ul>
  `;
};

const closeModal = () => {
  const modal = document.getElementById("gameModal");
  modal.classList.remove("show");
  
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = '';
  }, 300);
};

// toggle modal display
const toggleShowOrHide = (isshown) => {
  if (isshown) {
    showModal();
  } else {
    closeModal();
  }
};
const toggleShowOrHideGrids = (isshown) => {};

// reset stopwatch
const resetStopwatch = () => {
  seconds = 0;
  minutes = 0;
  stopwatchElem.innerHTML = `${get2digits(minutes)} : ${get2digits(seconds)}`;
};

// restart game
const reset = () => {
  closeModal();
  
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  if (currentGrid) {
    const gridNum = parseInt(currentGrid.id.replace("grid", ""));
    resetGrids(gridNum);
  }
  resetStopwatch();
};

// next level
const nextLevel = () => {
  closeModal();
  
  let elems = document.getElementsByClassName("grid");
  let currentGrid = [...elems].find(e => !e.classList.contains("hidden"));
  if (currentGrid) {
    const currentGridNum = parseInt(currentGrid.id.replace("grid", ""));
    const nextGridNum = currentGridNum + 1;
    if (nextGridNum <= 7) {
      showGrid(nextGridNum);
      // showGrid already calls resetStopwatch(), so no need to call it again
    } else {
      // If at max level, restart current level
      resetGrids(currentGridNum);
      resetStopwatch();
    }
  }
};

// Add keyboard support for modal
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById("gameModal");
  if (!modal.classList.contains("hidden") && !modal.classList.contains("show")) {
    return;
  }
  
  if (e.key === 'Escape' && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Add click outside modal to close
document.addEventListener('click', function(e) {
  const modal = document.getElementById("gameModal");
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  toggleShowOrHideGridBtn(true);
  document.getElementById("stopwatch").classList.add("hidden");
});
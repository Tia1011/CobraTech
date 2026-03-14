// --- Configuration & Global State ---
const gridSize = 4; 
const totalCells = gridSize * gridSize;
let playerPosition = 0;
let level1Questions = [];

const board = document.getElementById('board');
const diceImg = document.getElementById('dice-img');
const resultText = document.getElementById('roll-result');

// --- 1. Grid Generation ---
function createBoard() {
    if (!board) return;
    board.innerHTML = "";
    
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let r = gridSize - 1; r >= 0; r--) {
        for (let c = 0; c < gridSize; c++) {
            const block = document.createElement('div');
            block.classList.add('block');
            
            let cellValue;
            if (r % 2 === 0) {
                cellValue = (r * gridSize) + (c + 1);
            } else {
                cellValue = (r * gridSize) + (gridSize - c);
            }

            block.id = `cell-${cellValue}`;
            
            if (cellValue === 1) {
                block.innerHTML = `<span class="num">1</span>&nbsp;<span class="label">START</span>`;
                block.classList.add('start-node');
            } else if (cellValue === totalCells) {
                block.innerHTML = `<span class="num">${totalCells}</span>&nbsp;<span class="label">END</span>`;
                block.classList.add('end-node');
            } else {
                block.innerText = cellValue;
            }

            board.appendChild(block);
        }
    }
}

// --- 2. Dice & Movement Logic ---
function roll() {
    const val = Math.floor(Math.random() * 6) + 1;
    
    diceImg.src = `assets/dice${val}.png`;
    resultText.innerText = `You rolled a ${val}!`;
    
    movePlayer(val);
    
    diceImg.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(180deg) scale(1.2)' },
        { transform: 'rotate(360deg) scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
}

function movePlayer(steps) {
    // Remove highlight from current cell
    if (playerPosition > 0) {
        const oldCell = document.getElementById(`cell-${playerPosition}`);
        if (oldCell) oldCell.classList.remove('player-here');
    }

    playerPosition += steps;

    if (playerPosition >= totalCells) {
        playerPosition = totalCells;
        updateCellVisuals(playerPosition);
        setTimeout(() => {
            alert("Congratulations! You've reached the END!");
            resetGame();
        }, 400);
    } else {
        updateCellVisuals(playerPosition);
    }
}

function updateCellVisuals(pos) {
    const currentCell = document.getElementById(`cell-${pos}`);
    if (currentCell) {
        currentCell.classList.add('player-here', 'visited');
        
        // Show the question associated with this cell
        const questionData = level1Questions[pos - 1];
        if (questionData) {
            showQuestionPopup(questionData);
        }
    }
}

function showQuestionPopup(q) {
    // Basic popup - you can replace this with a Modal later
    setTimeout(() => {
        alert(`CATEGORY: ${q.Category}\n\nQUESTION: ${q.Question}\n\nA: ${q.OptionA}\nB: ${q.OptionB}\nC: ${q.OptionC}`);
    }, 300);
}

function resetGame() {
    document.querySelectorAll('.block').forEach(b => {
        b.classList.remove('player-here', 'visited');
    });
    playerPosition = 0;
    resultText.innerText = "Roll to start";
}

// --- 3. CSV & Data Logic ---
async function loadCSV(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();

  const rows = text.trim().split(/\r?\n/); // Handles Windows/Mac line endings
  const headers = rows[0].split(",").map(h => h.trim());

  return rows.slice(1).map(row => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : "";
    });
    return obj;
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getLevel1Questions(allQuestions) {
  const categories = {
    "Asset/Liability": [],
    "Investments": [],
    "Budgeting": [],
    "Debt Management": []
  };

  allQuestions.forEach(q => {
    const cat = q.Category ? q.Category.trim() : "";
    if (categories[cat]) {
      categories[cat].push(q);
    }
  });

  let levelQuestions = [];
  for (let category in categories) {
    const randomFour = shuffle(categories[category]).slice(0, 4);
    levelQuestions.push(...randomFour);
  }

  return shuffle(levelQuestions); 
}

// --- 4. Initialization ---
async function initGame() {
  try {
      const questions = await loadCSV("data.csv");
      level1Questions = getLevel1Questions(questions);
      console.log("Questions Loaded:", level1Questions);
      createBoard();
  } catch (err) {
      console.error("Failed to load CSV. Make sure data.csv exists.", err);
      createBoard(); // Create board anyway so it's not blank
  }
}

initGame();

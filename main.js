const board = document.getElementById('board');
const diceImg = document.getElementById('dice-img');
const resultText = document.getElementById('roll-result');

const gridSize = 4; // Change this to 5, 6, 9, etc.

function createBoard() {
    const board = document.getElementById('board');
    if (!board) return;
    board.innerHTML = "";
    
    // Set the CSS Grid columns dynamically based on gridSize
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    const totalCells = gridSize * gridSize;

    // Loop through rows from top to bottom
    for (let r = gridSize - 1; r >= 0; r--) {
        for (let c = 0; c < gridSize; c++) {
            const block = document.createElement('div');
            block.classList.add('block');
            
            let cellValue;
            
            // Logic for Snaking based on any gridSize
            if (r % 2 === 0) {
                // Even rows (0, 2, 4...) go Left-to-Right
                cellValue = (r * gridSize) + (c + 1);
            } else {
                // Odd rows (1, 3, 5...) go Right-to-Left
                cellValue = (r * gridSize) + (gridSize - c);
            }

            block.id = `cell-${cellValue}`;
            
            // Content logic with spacing
            if (cellValue === 1) {
                block.innerHTML = `<span class="num">1</span><span class="label">START</span>`;
                block.classList.add('start-node');
            } else if (cellValue === totalCells) {
                block.innerHTML = `<span class="num">${totalCells}</span><span class="label">END</span>`;
                block.classList.add('end-node');
            } else {
                block.innerText = cellValue;
            }

            board.appendChild(block);
        }
    }
}

function roll() {
    // Generate 1-6
    const val = Math.floor(Math.random() * 6) + 1;
    
    // Update Image
    diceImg.src = `assets/dice${val}.png`;
    
    // Update Text
    resultText.innerText = `You rolled a ${val}!`;
    
    // Quick animation effect
    diceImg.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(180deg) scale(1.2)' },
        { transform: 'rotate(360deg) scale(1)' }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
}

async function loadCSV(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();

  const rows = text.trim().split("\n");
  const headers = rows[0].split(",");

  const data = rows.slice(1).map(row => {
    const values = row.split(",");
    let obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index];
    });

    return obj;
  });

  return data;
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

  // group by category
  allQuestions.forEach(q => {
    categories[q.Category].push(q);
  });

  let levelQuestions = [];

  for (let category in categories) {
    const randomFour = shuffle(categories[category]).slice(0, 4);
    levelQuestions.push(...randomFour);
  }

  return shuffle(levelQuestions); // shuffle final 16
}

async function initGame() {

  const questions = await loadCSV("data.csv");

  const level1 = getLevel1Questions(questions);
    console.log("ahsdgjsd");
  console.log(level1); // 16 random questions
  createBoard();
}

initGame();
// Start the board

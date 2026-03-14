const board = document.getElementById('board');
const diceImg = document.getElementById('dice-img');
const resultText = document.getElementById('roll-result');

// Create 16 cells for a 4x4 grid
function createBoard() {
    board.innerHTML = ""; // Clear existing
    for (let i = 1; i <= 16; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = `cell-${i}`;
        block.innerText = i;
        board.appendChild(block);
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

// Start the board
createBoard();
import memory from "./memoryHandler";
import { closeContent } from "./domMenu";
import { gameStart } from "./gameUI";

// Play again (start)
// Helper function, clears board
const clearBoard = async function () {
  // Re-executable for player and computer selector
  const clearBoardHelper = function (selector) {
    // Clear tally board
    const tallyBoard = document.querySelector(`div#${selector}-tally`);
    const tallyShips = tallyBoard.querySelectorAll('div.tally-ship');
    tallyShips.forEach(ship => tallyBoard.removeChild(ship));

    // Clear the game board grid
    const board = document.querySelector(`div#${selector}-grid`);
    const grid = board.querySelector('div.main-grid');
    const gridCells = grid.querySelectorAll('div.cell');
    gridCells.forEach(cell => grid.removeChild(cell));

    // Remove ship units
    // Note: only player has ship units in the DOM
    if (selector === 'player') {
      const playerShipUnits = board.querySelectorAll('div.ship-unit');
      playerShipUnits.forEach(ship => board.removeChild(ship));
    }
  }

  clearBoardHelper('player');
  clearBoardHelper('computer');

  return true;
}


const playAgain = async function () {
  const choice = this.value;
  if (choice === 'yes') {
    // Clear Board
    await clearBoard();

    // Create new board
    gameStart();

    // Close victory modal
    const gameOverModal = document.querySelector('dialog#gameover-dialog')
    gameOverModal.close();

  } else if (choice === 'no') {
    console.log('no');
  }
}

// Play again (end)


// Game Over Modal(start)
const showGameOverScreen = function (result) {
    closeContent();
  
    const gameOverModal = document.querySelector('dialog#gameover-dialog');
    const gameOverScreen = document.querySelector('div#gameover-screen');
    const header = gameOverScreen.querySelector('h3');
    const resultMsg = gameOverScreen.querySelector('p#result-msg');
  
    const currentGame = memory.getCurrentGame();
    const playerName = currentGame.player.name;
    const computerName = currentGame.computer.name;
  
    let headerMessage;
    let message;
    if (result === `${playerName} Wins`) {
      headerMessage = 'Victory';
      message = 'Congratulations Sir! We have destroyed the enemy fleet.';
      gameOverModal.classList.remove('loss');
  
    } else if (result === `${computerName} Wins`) {
      headerMessage = 'Defeat';
      message = '...';
      gameOverModal.classList.add('defeat');
    }
    
    header.textContent = headerMessage;
    resultMsg.textContent = message;
  
    gameOverModal.showModal();
  
    const yesBtn = document.querySelector('button#gameover-yes');
    const noBtn = document.querySelector('button#gameover-no');
  
    [yesBtn, noBtn].forEach(button => button.addEventListener('click', playAgain));
  }
  
  // Game Over Modal(end)
  
  export { showGameOverScreen }
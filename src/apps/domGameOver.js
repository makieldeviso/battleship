import memory from "./memoryHandler";
import { closeContent } from "./domMenu";

// Play again (start)
const playAgain = function () {
  console.log(this.value);
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
      headerMessage = 'Loss';
      message = '...';
      gameOverModal.classList.add('loss');
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
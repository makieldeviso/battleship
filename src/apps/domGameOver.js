import memory from "./memoryHandler";

const closeGameOverModal = function () {
  const gameOverDialog = document.querySelector('dialog#gameover-dialog');
  gameOverDialog.close();
}

const showGameOverModal = function (result) {
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

    } else if (result === 'surrender') {
      headerMessage = 'Surrendered';
      message = 'Your remaining ships were captured by enemies';
      gameOverModal.classList.add('defeat');
    }
    
    header.textContent = headerMessage;
    resultMsg.textContent = message;
  
    gameOverModal.showModal();

  }
  
  export { showGameOverModal, closeGameOverModal }
import memory from "./memoryHandler";
import { clearPlayerBoard, createShipUnit} from "./domShips";
import { computerPlaceShips, generateRandomNumber } from "./computerScript";

// Helper function, close current screen to change to new screen
const closeContent = function () {
  const openContent = document.querySelector('div.content:not(.closed)');

  if (openContent) openContent.classList.add('closed');
}

// HELP (start)
const showHelpScreen = function () {
  closeContent();

  const gamePhase = memory.getCurrentGame().phase;

  let helpMessageCont;
  if (gamePhase === 'playerPlaceShip') {
    helpMessageCont = document.querySelector('div#help-message-1');

  } else if (gamePhase === 'playerAttackTurn' || gamePhase === 'computerAttackTurn') {
    helpMessageCont = document.querySelector('div#help-message-2');
  }

  
  helpMessageCont.classList.remove('closed');
}
// HELP (end)

// STRATEGY PHASE (start)
const showStratScreen = function () {
  closeContent();
  const stratScreen = document.querySelector('div#strat-screen');

  stratScreen.classList.remove('closed');
}
// STRATEGY PHASE (end)

// ATTACK PHASE (start)
const showAttackScreen = function () {
  closeContent();
  const attackScreen = document.querySelector('div#attack-screen');

  attackScreen.classList.remove('closed');
}
// ATTACK PHASE (end)

// Surrender (start)
const confirmSurrender = function () {
  const choice = this.value;
  console.log(choice);

}
// Surrender (start)
const showSurrenderScreen = function () {
  const surrenderScreen = document.querySelector('div#surrender');
  
  if (!surrenderScreen.getAttribute('class').includes('closed')) return;

  closeContent();
  const gamePhase = memory.getCurrentGame().phase;
  
  const surrenderMessage = surrenderScreen.querySelector('p.message');

  let messageText;
  if (gamePhase === 'playerPlaceShip') {
    const noStartQuotes = [
      'No battles are won without charging!',
      'Were just chilling here General.'
    ]
    const randomIndex = generateRandomNumber(0, noStartQuotes.length - 1);
    messageText = noStartQuotes[randomIndex];
  }

  surrenderMessage.textContent = messageText;

  surrenderScreen.classList.remove('closed');

  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => btn.addEventListener('click', confirmSurrender));
  
}

// Surrender (end)

// Randomize Ship Placement (start)
const randomizeShipPlacement = function () {
  let playerShips = memory.getPlayerShips();

  // Remove current ships on the board
  while (playerShips.length > 0) {
    playerShips[0].removePlace();
    // Reassign playerShips to update removed ship
    playerShips = memory.getPlayerShips();
  }

  // Place a new set of ships in the player gameBoard
  const playerBoard = memory.getCurrentGame().player.gameBoard;
  computerPlaceShips(playerBoard);
  playerShips = memory.getPlayerShips();

  // Clear the ships on the DOM board, then show new placement
  clearPlayerBoard();
  playerShips.forEach(shipObj => {
    createShipUnit(shipObj,'player');
  });
}

const removeRandomShipPlacement = function () {
  const randomBtn = document.querySelector('button#random');
  randomBtn.removeEventListener('click', randomizeShipPlacement);
}

// Randomize Ship Placement (end)


// Game Over (start)
const showGameOverScreen = function (result) {
  closeContent();

  const gameOverModal = document.querySelector('dialog#gameover-dialog');
  const gameOverScreen = document.querySelector('div#game-over');
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

  } else if (result === `${computerName} Wins`) {
    headerMessage = 'Loss';
    message = '...';
  }
  
  header.textContent = headerMessage;
  resultMsg.textContent = message;

  gameOverModal.showModal();

}

// Game Over (end)


const slideShowHud = async function () {
  const hudMenu = document.querySelector('div#hud');
  const isHudShown = hudMenu.getAttribute('class').includes('shown');
  const menuBtn = document.querySelector('button#menu-btn');

  if (isHudShown) {
    // Slide/ hide the HUD
    menuBtn.classList.add('pressed');
    hudMenu.classList.add('slide');
  
    await new Promise ((resolve) => {
      setTimeout(() => {
        hudMenu.classList.remove('shown');
        hudMenu.classList.add('hidden');
        resolve(true);
      }, 400);
    });

  } else {
    // show the HUD
    menuBtn.classList.remove('pressed')
    hudMenu.classList.remove('hidden');
    hudMenu.classList.add('shown');
    
    await new Promise ((resolve) => {
      setTimeout(() => {
        hudMenu.classList.remove('slide');
        resolve(true);
      }, 0);
    });
  }
}

const returnToMainDisplay = function () {
  closeContent();
  const gamePhase = memory.getCurrentGame().phase;
  
  if (gamePhase === 'playerPlaceShip') {
    showStratScreen();

  } else if (gamePhase === 'playerAttackTurn' || gamePhase === 'computerAttackTurn') {
    showAttackScreen();
  }
}

const addMenuEvents = function () {
  const menuBtn = document.querySelector('button#menu-btn');
  const menuBackBtn = document.querySelector('button#back-hud');

  menuBtn.disabled = false;
  menuBackBtn.disabled = false;
  menuBtn.addEventListener('click', slideShowHud);
  menuBackBtn.addEventListener('click', slideShowHud);
  
}

export {
  showHelpScreen, 
  slideShowHud, 
  showStratScreen, 
  showAttackScreen,
  showSurrenderScreen, 
  randomizeShipPlacement,
  removeRandomShipPlacement,
  showGameOverScreen,
  closeContent, 
  returnToMainDisplay,
  addMenuEvents
}
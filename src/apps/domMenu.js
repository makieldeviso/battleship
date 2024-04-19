import memory from "./memoryHandler";
import { clearPlayerBoard, createShipUnit, removeShipEvents } from "./domShips";
import { computerPlaceShips, generateRandomNumber } from "./computerScript";
import startAttack from "./domAttack";
import { showGameOverModal } from "./domGameOver";

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

  // Additional commands
  // Remove choice button events
  removeSurrenderEvent();
}
// HELP (end)

// STRATEGY PHASE (start)
const showStratScreen = function () {
  closeContent();
  const stratScreen = document.querySelector('div#strat-screen');

  stratScreen.classList.remove('closed');
}
// STRATEGY PHASE (end)

// SURRENDER (start)
// Remove surrender choice event
const confirmSurrender = function () {
  const currentGame = memory.getCurrentGame();
  const isAttackPhase = currentGame.phase !== 'playerPlaceShip';
  const choice = this.value;

  if (choice === 'yes' && isAttackPhase ) {
    slideShowHud();
    showGameOverModal('surrender');
    memory.logScores(`${currentGame.computer.name} Wins`);

  } else if (choice === 'no') {
    returnToMainDisplay();
  }
}

const removeSurrenderEvent = function () {
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => {
    btn.removeEventListener('click', confirmSurrender);
    btn.classList.remove('open');
  });
}

const addSurrenderEvent = function () {
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => {
    btn.addEventListener('click', confirmSurrender);
    btn.classList.add('open');
  });
}

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

  } else if (gamePhase.includes('AttackTurn')) {
    messageText = 'Are you sure you want to surrender?'
  }

  surrenderMessage.textContent = messageText;

  surrenderScreen.classList.remove('closed');

  addSurrenderEvent();
}

// SURRENDER (end)

const returnToMainDisplay = function () {
  closeContent();
  const gamePhase = memory.getCurrentGame().phase;
  
  // Remove choice button events
  removeSurrenderEvent();

  if (gamePhase === 'playerPlaceShip') {
    showStratScreen();

  } else if (gamePhase === 'playerAttackTurn' || gamePhase === 'computerAttackTurn') {
    showAttackScreen();
  }
}

// Randomize Ship Placement (start)
const randomizeShipPlacement = function () {
  returnToMainDisplay();
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

// Randomize Attack Coordinate (start)

// Randomize Attack Coordinate (end)

// ATTACK PHASE (start)
const showAttackScreen = function () {
  closeContent();
  const attackScreen = document.querySelector('div#attack-screen');

  attackScreen.classList.remove('closed');
}

const slideShowHud = async function () {
  const hudMenu = document.querySelector('div#hud');
  const isHudShown = hudMenu.getAttribute('class').includes('shown');
  const menuBtn = document.querySelector('button#menu-btn');

  returnToMainDisplay();
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
    hudMenu.classList.add('shown');
    menuBtn.classList.remove('pressed')
    hudMenu.classList.remove('hidden');
    
    await new Promise ((resolve) => {
      setTimeout(() => {
        hudMenu.classList.remove('slide');
        resolve(true);
      }, 0);
    });
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

const disableMenuEvents = function () {
  const menuBtn = document.querySelector('button#menu-btn');
  const menuBackBtn = document.querySelector('button#back-hud');

  menuBtn.disabled = true;
  menuBackBtn.disabled = true;
  menuBtn.removeEventListener('click', slideShowHud);
  menuBackBtn.removeEventListener('click', slideShowHud);
}



const startAttackPhase = function () {
  startAttack();

  // Remove eventListeners to player ship units/ disable moving
  removeShipEvents();
  removeRandomShipPlacement();

  // Hide Hud menu on attack phase start
  slideShowHud();

  // Add eventListener to menu button
  addMenuEvents();

  // Show attack phase screen 
  showAttackScreen();

  // Remove eventListener to start button
  this.removeEventListener('click',  startAttackPhase);
}
// ATTACK PHASE (end)

export {
  showHelpScreen, 
  slideShowHud, 
  showStratScreen, 
  showAttackScreen,
  startAttackPhase,
  showSurrenderScreen,
  randomizeShipPlacement,
  closeContent, 
  returnToMainDisplay,
  addMenuEvents,
  disableMenuEvents
}
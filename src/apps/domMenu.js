import memory from "./memoryHandler";
import { clearPlayerBoard, createShipUnit} from "./domShips";
import { computerPlaceShips } from "./computerScript";

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
  closeContent();
  const surrenderScreen = document.querySelector('div#surrender');

  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => btn.addEventListener('click', confirmSurrender));

  surrenderScreen.classList.remove('closed');
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

  // Clear the ships on the board, then show new placement
  clearPlayerBoard();
  playerShips.forEach(shipObj => {
    createShipUnit(shipObj,'player');
  });

}


// Randomize Ship Placement (end)

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
  closeContent, 
  returnToMainDisplay,
  addMenuEvents
}
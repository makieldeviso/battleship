import memory from "./memoryHandler";
import { clearPlayerBoard, createShipUnit, removeShipEvents } from "./domShips";
import { computerPlaceShips, generateRandomNumber, generateAttackCoordinates } from "./computerScript";
import startAttack from "./domAttack";
import { changeScores, showGameOverModal } from "./domGameOver";

// Helper function, close current screen to change to new screen
const closeContent = function () {
  const openContent = document.querySelector('div.content:not(.closed)');

  if (openContent) openContent.classList.add('closed');

  // Additional commands
  // Remove choice button events
  removeSurrenderEvent();
  removeRandomAttackEvent();
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

// SURRENDER (start)
// Remove surrender choice event
const confirmSurrender = function () {
  const currentGame = memory.getCurrentGame();
  const isAttackPhase = currentGame.phase !== 'playerPlaceShip';
  const choice = this.value;

  if (choice === 'yes' && isAttackPhase ) {
    slideShowHud();
    showGameOverModal('surrender');
    
    // log score to memory then change UI
    memory.logScores(`${currentGame.computer.name} Wins`);
    changeScores();

  } else if (choice === 'no') {
    returnToMainDisplay();
  }
}

const removeSurrenderEvent = function () {
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => {
    btn.removeEventListener('click', confirmSurrender);
    btn.disabled = true;
  });
}

const addSurrenderEvent = function () {
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => {
    btn.addEventListener('click', confirmSurrender);
    btn.disabled = false;
  });
}

const showSurrenderScreen = async function () {
  const surrenderScreen = document.querySelector('div#surrender');

  if (!surrenderScreen.getAttribute('class').includes('closed')) return;

  closeContent();
  const gamePhase = memory.getCurrentGame().phase;
  
  const surrenderMessage = surrenderScreen.querySelector('p.message');
  let messageText;

  if (gamePhase === 'playerPlaceShip') {
    const noStartQuotes = [
      'No battles are won without charging!',
      'Were just chilling here General.',
      "Don't be afraid, fight!"
    ]
    const randomIndex = generateRandomNumber(0, noStartQuotes.length - 1);
    messageText = noStartQuotes[randomIndex];

  } else if (gamePhase.includes('AttackTurn')) {
    messageText = 'Are you sure you want to surrender?';
    addSurrenderEvent();
  }

  surrenderMessage.textContent = messageText;
  surrenderScreen.classList.remove('closed');

  if (gamePhase === 'playerPlaceShip') {
    // Note: surrender screen auto close if attack phase has not yet started
    await new Promise ((resolve) => {
      setTimeout(() => {
        // If surrender screen is still open after 1.3s, auto close
        if (!surrenderScreen.getAttribute('class').includes('closed')) resolve (returnToMainDisplay());
      }, 1300);
    });
  }

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
const confirmRandomAttack = async function () {
  const choice = this.value;
  const { attackX } = this.dataset;
  const attackY = Number(this.dataset.attackY);
  
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  // Clear added dataset
  [yesBtn, noBtn].forEach(btn => {
    btn.removeAttribute('data-attack-x'); // Camel case changes in html
    btn.removeAttribute('data-attack-y');
  })

  if (choice === 'yes') {
    // Simulate clicking the attacked cell in the DOM
    const computerMainGrid = document.querySelector('div#computer-grid div.main-grid');
    const attackedCell = computerMainGrid.querySelector(`div.cell[data-column='${attackX}'][data-row='${attackY}']`);

    await slideShowHud(); // Close HUD first
    attackedCell.click(); // Attack now

  } else {
    returnToMainDisplay();
  }
  
}

const removeRandomAttackEvent = function () {
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => {
    btn.removeEventListener('click', confirmRandomAttack);
    btn.disabled = true;

    if (btn.dataset.attackX) {
      btn.removeAttribute('data-attack-x'); 
      btn.removeAttribute('data-attack-y');
    }
  });
}

const randomAttack = function () {
  closeContent();

  // Choose random available coordinate to attack 
  const attackCoordinates = generateAttackCoordinates('computer');

  // Add UI to screen
  const randomScreen = document.querySelector('div#random-attack');
  const attackText = randomScreen.querySelector('p#random-attack-coordinate');
  attackText.textContent = `[ ${attackCoordinates[0]}, ${attackCoordinates[1]} ]`;
  randomScreen.classList.remove('closed');

  // Enable choice buttons
  const yesBtn = document.querySelector('button#yes');
  const noBtn = document.querySelector('button#no');

  [yesBtn, noBtn].forEach(btn => {
    btn.addEventListener('click', confirmRandomAttack, {once: true});
    btn.dataset.attackX = `${attackCoordinates[0]}`;
    btn.dataset.attackY = `${attackCoordinates[1]}`;
    btn.disabled = false;
  });
 
}

const addRandomAttack = function () {
  const randomBtn = document.querySelector('button#random');
  randomBtn.addEventListener('click', randomAttack);
}

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

  menuBtn.disabled = false;
  menuBtn.addEventListener('click', slideShowHud);
}

const disableMenuEvents = function () {
  const menuBtn = document.querySelector('button#menu-btn');

  menuBtn.disabled = true;
  menuBtn.removeEventListener('click', slideShowHud);
}

const startAttackPhase = function () {
  startAttack();

  // Remove eventListeners to player ship units/ disable moving
  removeShipEvents();
  removeRandomShipPlacement();

  // Add new event to random button (attack coordinate randomizer);
  addRandomAttack();
  
  // Hide Hud menu on attack phase start
  slideShowHud();

  // Add eventListener to menu button
  addMenuEvents();

  // Show attack phase screen 
  showAttackScreen();

  // Remove eventListener to start button, then add new EventListener
  this.removeEventListener('click',  startAttackPhase);
  this.addEventListener('click', slideShowHud);

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
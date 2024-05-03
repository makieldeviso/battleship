import GamePlay from "./gameplay";

// UI Scripts
import { createGridInBoard } from "./domGridCreator";
import { createShipTally, createShipUnit} from "./domShips";
import { showStratScreen, slideShowHud, disableMenuEvents } from "./domMenu";
import addHudBtnEvents from "./domMenuEvents";
import { closeGameOverModal } from "./domGameOver";

const domPlayerBoard = document.querySelector('div#player-grid');
const domComputerBoard = document.querySelector('div#computer-grid');

// Helper function, clears board
const clearBoard = function () {
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

    // Clear turn marker
    const detailBoards = document.querySelector(`div#${selector}-detail`);
    const mainGrids = document.querySelector(`div#${selector}-grid div.main-grid`);
    [detailBoards, mainGrids].forEach(elem => elem.classList.remove('current-turn'));

    // Remove ship units
    // Note: only player has ship units in the DOM
    if (selector === 'player') {
      const playerShipUnits = board.querySelectorAll('div.ship-unit');
      playerShipUnits.forEach(ship => board.removeChild(ship));
    }
  }

  clearBoardHelper('player');
  clearBoardHelper('computer');

  // Disable menu button on restart
  disableMenuEvents();

  return true;
}

const gameStart = function () {
  // create a GamePlay object then execute start method
  const newGame = new GamePlay();
  newGame.start();
  
  // Create grid for the DOM using data from newGame
  createGridInBoard(newGame.computer, domComputerBoard);
  createGridInBoard(newGame.player, domPlayerBoard);

  // Create ship tally board
  const computerShips = newGame.computer.gameBoard.ships;
  computerShips.forEach(ship => createShipTally(ship, 'computer'));

  const playerShips = newGame.player.gameBoard.ships;
  playerShips.forEach(ship => createShipTally(ship, 'player'));

  // Initially places ships for the player in random spots
  playerShips.forEach(ship => createShipUnit(ship, 'player'));

  // Test script (show enemy position)
  // console.log('computer placement shown');
  // const computerBoard = document.querySelector('div#computer-grid div.main-grid');
  // computerShips.forEach(ship => showShipPlacement(ship.placement, computerBoard))
  
  // Open initial content on screen (strategy phase)
  slideShowHud();
  showStratScreen();

  // Add eventListeners to HUD buttons
  addHudBtnEvents();

  // Add events to game over buttons
  const yesBtn = document.querySelector('button#gameover-yes');
  const noBtn = document.querySelector('button#gameover-no');
  [yesBtn, noBtn].forEach(button => button.addEventListener('click', function () {
    const choice = this.value;

    if (choice === 'yes') {
      clearBoard();
      gameStart();
      closeGameOverModal();

    } else if (choice === 'no') {
      location.reload();
    }

  },{once:true}));

}

export default gameStart
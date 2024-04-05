import GamePlay from "./gameplay";
import memory from "./memoryHandler";

// UI Scripts
import { createGridInBoard } from "./domGridCreator";
import { showShipPlacement, createShipTally, createShipUnit, addResizeShipMovement } from "./domShips";
import startAttack from "./domAttack";
import { slideShowHud, showHelp } from "./domMenu";

const domPlayerBoard = document.querySelector('div#player-grid');
const domComputerBoard = document.querySelector('div#computer-grid');

const gameStart = function () {
  // create a GamePlay object then execute start method
  const newGame = new GamePlay();
  newGame.start();
  
  // Create grid for the DOM using data from newGame
  createGridInBoard(newGame.computer, domComputerBoard);
  createGridInBoard(newGame.player, domPlayerBoard);
  console.log(newGame);

  // Create ship tally board
  const computerShips = newGame.computer.gameBoard.ships;
  computerShips.forEach(ship => createShipTally(ship, 'computer'));

  const playerShips = newGame.player.gameBoard.ships;
  playerShips.forEach(ship => createShipTally(ship, 'player'));

  // Initially places ships for the player in random spots
  playerShips.forEach(ship => createShipUnit(ship, 'player'));

  // Adds UI indicator of occupied cells by ship units in the player grid
  const playerBoard = newGame.player.gameBoard.board;
  Object.keys(playerBoard).forEach(key => {
    if (playerBoard[key].occupied) {
      const {column, row} = playerBoard[key];
      // Note: showShipPlacement requires array of coordinates as argument
      showShipPlacement([[column, row]], domPlayerBoard )
    }
  })

  // !!!!!!!!!! temp execution
  const computerBoard = newGame.computer.gameBoard.board;
  Object.keys(computerBoard).forEach(key => {
    if (computerBoard[key].occupied) {
      const {column, row} = computerBoard[key];
      // Note: showShipPlacement requires array of coordinates as argument
      showShipPlacement([[column, row]], domComputerBoard )
    }
  })

  // Save current game to memory
  memory.setCurrentGame(newGame);

  // Add eventListeners to HUD buttons
  const startBtn = document.querySelector('button#start-btn');
  startBtn.addEventListener('click', startAttack);

  const helpBtn = document.querySelector('button#help');
  helpBtn.addEventListener('click', showHelp);

}

export { gameStart }
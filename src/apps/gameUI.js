import GamePlay from "./gameplay";

// UI Scripts
import { createGridInBoard } from "./domGridCreator";
import { createShipTally, createShipUnit} from "./domShips";
import startAttack from "./domAttack";
import { showStratScreen, showHelpScreen, returnToMainDisplay, randomizeShipPlacement } from "./domMenu";

const domPlayerBoard = document.querySelector('div#player-grid');
const domComputerBoard = document.querySelector('div#computer-grid');

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

  // !!!!!!!!!! temp execution
  // const computerBoard = newGame.computer.gameBoard.board;
  // Object.keys(computerBoard).forEach(key => {
  //   if (computerBoard[key].occupied) {
  //     const {column, row} = computerBoard[key];
  //     // Note: showShipPlacement requires array of coordinates as argument
  //     showShipPlacement([[column, row]], domComputerBoard )
  //   }
  // })

  // Open initial content on screen (strategy phase)
  showStratScreen();

  // Add eventListeners to HUD buttons
  const startBtn = document.querySelector('button#start-btn');
  const helpBtn = document.querySelector('button#help');
  const closeBtn = document.querySelector('button#close-btn');
  const randomBtn = document.querySelector('button#random');
  
  startBtn.addEventListener('click', startAttack);
  helpBtn.addEventListener('click', showHelpScreen);
  closeBtn.addEventListener('click', returnToMainDisplay);
  randomBtn.addEventListener('click', randomizeShipPlacement);

}

export { gameStart }
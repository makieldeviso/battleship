import GamePlay from "./gameplay";

// UI Scripts
import { createGridInBoard } from "./domGridCreator";
import { showShipPlacement, createShipTally, createShipUnit } from "./domShips";

const domPlayerBoard = document.querySelector('div#player-grid');
const domComputerBoard = document.querySelector('div#computer-grid');


const gameStart = function () {
  // create a GamePlay object then execute start method
  const newGame = new GamePlay();
  newGame.start();
  
  // Create grid for the DOM using data from newGame
  createGridInBoard(newGame.computer, domComputerBoard);
  createGridInBoard(newGame.player, domPlayerBoard);
  console.log(newGame)

  // Create ship tally board
  const computerShips = newGame.computer.gameBoard.ships;
  computerShips.forEach(ship => createShipTally(ship, 'computer'));

  const playerShips = newGame.player.gameBoard.ships;
  playerShips.forEach(ship => createShipTally(ship, 'player'));

  // !!!!!!!!!! temp execution
  const playerBoard = newGame.player.gameBoard.board;
  Object.keys(playerBoard).forEach(key => {
    if (playerBoard[key].occupied) {
      const {column, row} = playerBoard[key];
      // Note: showShipPlacement requires array of coordinates as argument
      showShipPlacement([[column, row]], domPlayerBoard )
    }
  })

  playerShips.forEach(ship => createShipUnit(ship, 'player'));

}


export {gameStart, createGridInBoard, showShipPlacement}
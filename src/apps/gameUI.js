import GamePlay from "./gameplay";
import memory from "./memoryHandler";
import { addEventHUDButtons } from "./domHud";
import { generateRandomNumber } from "./computerScript";

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
  memory.current = newGame;

  // Add eventListeners to HUD buttons
  addEventHUDButtons();
}

const getAttack = function (cellArg) {
  // If getAttack is triggered by player by clicking computer grid domCell = this
  // If getAttack is triggered by computer by sending boardCell argument domCell = cellArg
  const domCell = cellArg.type === 'click'? this : cellArg;
  const domBoard = domCell.parentNode.parentNode;
  const attackReceiver = domBoard.id.includes('player') ? 'player' : 'computer';
  const attackReceiverBoard = memory.current[attackReceiver].gameBoard;
  const cellCoordinates = { x: domCell.dataset.column, y: Number(domCell.dataset.row) };
  
  // Execute receiveAttack to receiver gameBoard
  attackReceiverBoard.receiveAttack([cellCoordinates.x, cellCoordinates.y]);
  
  // Add DOM dataset to the attacked cell
  const cellDetail = attackReceiverBoard.board[`${cellCoordinates.x},${cellCoordinates.y}`];
  domCell.dataset.attacked = cellDetail.attacked;
  
  // Disable currently open board
  const domCells = domBoard.querySelectorAll('div.cell')
  domCells.forEach(cell => cell.removeEventListener('click', getAttack));

  // Switch player
  if (attackReceiver === 'player') {
    memory.current.setPlayerAttackTurn();
    playerAttackComputerPhase();

  } else {
    memory.current.setComputerAttackTurn();
    computerAttackPlayerPhase();
  }

  console.log(memory.current);
}

const playerAttackComputerPhase = function () {
  const computerGridCells = document.querySelectorAll('div#computer-grid div.cell');
  computerGridCells.forEach(cell => {
    if (!cell.dataset.attacked) cell.addEventListener('click', getAttack);
  });
}

const computerAttackPlayerPhase = function () {
  const playerGridCells = [...document.querySelectorAll('div#player-grid div.cell')]; // spread NodeList
  const unAttackedCell = playerGridCells.filter(cell => !cell.dataset.attacked);

  const randomIndex = generateRandomNumber(0, unAttackedCell.length);
  
  setTimeout(() => getAttack(unAttackedCell[randomIndex]), 1000);

}



export {gameStart, playerAttackComputerPhase}
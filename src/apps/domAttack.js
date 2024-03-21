import memory from "./memoryHandler";
import { generateRandomNumber } from "./computerScript";
import { removeShipEvents } from "./domShips";


let turnSwitch;
class TurnSwitcher {
  constructor (playerTurnScript, computerTurnScript) {
    this.playerTurnScript = playerTurnScript;
    this.computerTurnScript = computerTurnScript;
  }

  switch () {
    const currentGame = memory.getCurrentGame();
    const lastTurn = currentGame.phase;
    const playerAttackTurn = lastTurn === 'playerAttackTurn';
  
    // If last turn was player, switch to computer
    if (playerAttackTurn) {
      currentGame.setComputerAttackTurn();
      this.computerTurnScript();
  
    } else {
      currentGame.setPlayerAttackTurn();
      this.playerTurnScript();
    }
  }
}


const getAttack = async function (cellArg) {
  // If getAttack is triggered by player by clicking computer grid domCell = this
  // If getAttack is triggered by computer by sending boardCell argument domCell = cellArg
  const domCell = cellArg;
  const domBoard = domCell.parentNode.parentNode;
  const attackReceiver = domBoard.id.includes('player') ? 'player' : 'computer';
  const currentGame = memory.getCurrentGame();
  const attackReceiverBoard = currentGame[attackReceiver].gameBoard;
  const cellCoordinates = { x: domCell.dataset.column, y: Number(domCell.dataset.row) };

  // Execute receiveAttack to receiver gameBoard
  const attackResult = attackReceiverBoard.receiveAttack([cellCoordinates.x, cellCoordinates.y]);

  // Add DOM dataset to the attacked cell
  domCell.dataset.attacked = attackResult;

  // Disable currently open board
  const domCells = domBoard.querySelectorAll('div.cell')
  domCells.forEach(cell => cell.removeEventListener('click', getAttack));
 
  return {
    result: attackResult,
    attackedCell: attackReceiverBoard.board[`${cellCoordinates.x},${cellCoordinates.y}`]
  }
}

const checkGameStats = function () {

}

// Helper function for playerAttackComputerPhase
const playerAttack = async function () {
  const attackDetail = await getAttack(this);
 
  // Switch player
  turnSwitch.switch();
};  

const playerAttackComputerPhase = function () {
  const computerGridCells = document.querySelectorAll('div#computer-grid div.cell');
  computerGridCells.forEach(cell => {
    if (!cell.dataset.attacked) cell.addEventListener('click', playerAttack);
  });
}

const computerAttackPlayerPhase = async function () {
  const playerGridCells = [...document.querySelectorAll('div#player-grid div.cell')]; // spread NodeList
  const unAttackedCell = playerGridCells.filter(cell => !cell.dataset.attacked);

  const randomIndex = generateRandomNumber(0, unAttackedCell.length - 1);

  // Note: getAttack returns the value of the attacked cell
  // attackedCell executes getAttack() within a delayed time
  const attackDetail = await new Promise ((resolve) => {
      setTimeout(() => resolve( getAttack( unAttackedCell[randomIndex] ) ), 500);
    });

  // Save computer attack pattern to computer memory through the memoryHandler module
  //  If attack hits, save to last hit
  memory.setComputerLastAttack(attackDetail);
  if (attackDetail.result === 'hit') memory.setComputerLastHit(attackDetail.attackedCell);
  
  // Switch player
  turnSwitch.switch();
}

const startAttack = function () {
  const currentGame = memory.getCurrentGame();
  // Remove eventListeners to player ship units/ disable moving
  removeShipEvents();

  // Save new TurnSwitcher object to turnSwitch variable defined with 'let' at upper scope
  // Save playerAttackComputerPhase and computerAttackPlayerPhase functions to turnSwitch as methods
  turnSwitch = new TurnSwitcher(playerAttackComputerPhase, computerAttackPlayerPhase);

  // Randomize first turner
  const firstTurner = generateRandomNumber(0, 1) === 0 ? 
    currentGame.setPlayerAttackTurn() : currentGame.setComputerAttackTurn();

  if (firstTurner === 'player') {
    turnSwitch.playerTurnScript();

  } else {
    turnSwitch.computerTurnScript();
  }
  
  // Remove eventListener to start button
  this.removeEventListener('click',  startAttack);
}

export default startAttack
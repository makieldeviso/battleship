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
    const lastTurn = memory.current.phase;
    const playerAttackTurn = lastTurn === 'playerAttackTurn';
  
    // If last turn was player, switch to computer
    if (playerAttackTurn) {
      memory.current.setComputerAttackTurn();
      this.computerTurnScript();
  
    } else {
      memory.current.setPlayerAttackTurn();
      this.playerTurnScript();
    }
  }
}

const getAttack = function (cellArg) {
  // If getAttack is triggered by player by clicking computer grid domCell = this
  // If getAttack is triggered by computer by sending boardCell argument domCell = cellArg
  const domCell = cellArg;
  const domBoard = domCell.parentNode.parentNode;
  const attackReceiver = domBoard.id.includes('player') ? 'player' : 'computer';
  const attackReceiverBoard = memory.current[attackReceiver].gameBoard;
  const cellCoordinates = { x: domCell.dataset.column, y: Number(domCell.dataset.row) };

  // Execute receiveAttack to receiver gameBoard
  const attackResult = attackReceiverBoard.receiveAttack([cellCoordinates.x, cellCoordinates.y]);

  // Add DOM dataset to the attacked cell
  domCell.dataset.attacked = attackResult;

  // Disable currently open board
  const domCells = domBoard.querySelectorAll('div.cell')
  domCells.forEach(cell => cell.removeEventListener('click', getAttack));
 
  return attackReceiverBoard.board[`${cellCoordinates.x},${cellCoordinates.y}`];
}

// Helper function for playerAttackComputerPhase
const playerAttack = async function () {
  await getAttack(this);
 
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
  const attackedCell = await new Promise ((resolve) => {
      setTimeout(() => resolve( getAttack( unAttackedCell[randomIndex] ) ), 500);
    });

  // Save computer attack pattern to computer memory through the memoryHandler module
  //  If attack hits, save to last hit
  memory.computerAttack.setLastAttack(attackedCell);
  if (attackedCell.attacked === 'hit') memory.computerAttack.setLastHit(attackedCell);

  // Switch player
  turnSwitch.switch();
}

const startAttack = function () {
  // Remove eventListeners to player ship units/ disable moving
  removeShipEvents();

  // Save new TurnSwitcher object to turnSwitch variable defined with 'let' at upper scope
  // Save playerAttackComputerPhase and computerAttackPlayerPhase functions to turnSwitch as methods
  turnSwitch = new TurnSwitcher(playerAttackComputerPhase, computerAttackPlayerPhase);

  // Randomize first turner
  const firstTurner = generateRandomNumber(0, 1) === 0 ? 
    memory.current.setPlayerAttackTurn() : memory.current.setComputerAttackTurn();

  if (firstTurner === 'player') {
    turnSwitch.playerTurnScript();

  } else {
    turnSwitch.computerTurnScript();
  }
  
  // Remove eventListener to start button
  this.removeEventListener('click',  startAttack);
}

export default startAttack
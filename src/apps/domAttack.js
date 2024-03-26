import memory from "./memoryHandler";
import { computerAttackPlayer, generateRandomNumber } from "./computerScript";
import { removeShipEvents } from "./domShips";

let turnSwitch;
class TurnSwitcher {
  constructor (playerTurnScript, computerTurnScript) {
    this.playerTurnScript = playerTurnScript;
    this.computerTurnScript = computerTurnScript;
    this.isGameOver = false;
  }

  switch () {
    const currentGame = memory.getCurrentGame();
    const isGameOver = currentGame.checkGameOver();
    const lastTurn = currentGame.phase;
    const isPlayerAttackTurn = lastTurn === 'playerAttackTurn';
    const isComputerAttackTurn = lastTurn === 'computerAttackTurn';

    if ( isGameOver ) {
      this.isGameOver = isGameOver;
      this.startGameOverSequence();

    } else if ( isPlayerAttackTurn ) {
      currentGame.setComputerAttackTurn();
      this.computerTurnScript();
  
    } else if ( isComputerAttackTurn ){
      currentGame.setPlayerAttackTurn();
      this.playerTurnScript();
    }
  }

  startGameOverSequence () {
    console.log(memory.getCurrentGame())
    console.log(this.isGameOver);
  }

}

const checkShipUnitSank = function (shipObj) {
  const shipSunk = shipObj.sunk;
  
  if (shipSunk) {
    const currentGame = memory.getCurrentGame();
    const tallySelector = currentGame.player.name === shipObj.owner ? 'player-tally' : 'computer-tally';
    const tallyBoard = document.querySelector(`div#${tallySelector}`);
    const shipTally = tallyBoard.querySelector(`div[title='${shipObj.name}']`);

    shipTally.classList.add('sunk');
  }

}

const getAttack = async function (attackedDomCell, attackResult, attackedCell) {
  const domCell = attackedDomCell;
  const domBoard = domCell.parentNode.parentNode;
  
  // Add DOM dataset to the attacked cell
  domCell.dataset.attacked = attackResult;

  // Add indicator if hit ship has sunk
  if (attackResult === 'hit') {
    const shipObj = attackedCell.occupied.ship;
    checkShipUnitSank(shipObj);
  }

  // Disable currently open board
  const domCells = domBoard.querySelectorAll('div.cell')
  domCells.forEach(cell => cell.removeEventListener('click', getAttack));

  return attackResult
}

// Helper function for playerAttackComputerPhase
const playerAttack = function () {
  // Create coordinates array using the cell clicked by the player
  const attackCoordinates = [this.dataset.column, Number(this.dataset.row)];

  // Use the method of the Player object to send attack to opponent board
  const { player } = memory.getCurrentGame();
  const attackDetails = player.sendAttack(attackCoordinates);
  const {attackResult, attackedCell} = attackDetails;
  
  // Indicate attack in the UI by executing getAttack function
  getAttack(this, attackResult, attackedCell);

  // Disable attacked cell. Cell cannot be attacked again
  this.removeEventListener('click', playerAttack);

  // Then disable player ability to attack
  const computerGridCells = document.querySelectorAll('div#computer-grid div.cell');
  computerGridCells.forEach(cell => {
    if (!cell.dataset.attacked) cell.removeEventListener('click', playerAttack);
  });
  
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
  // Use computerScripts for computer to send attack to player board
  const attackDetails = computerAttackPlayer();
  const { attackCoordinates, attackResult, attackedCell } = attackDetails;

  // Get the dom cell to be attacked by the computer
  const playerGrid = document.querySelector('div#player-grid div.main-grid');
  const attackedDomCell = playerGrid.querySelector(`div.cell[data-column = '${attackCoordinates[0]}'][data-row = '${attackCoordinates[1]}']`);

  // Add UI indicator to attacked cell
  // Note: Create a slight delay for smoother UX 
  setTimeout(() => getAttack(attackedDomCell, attackResult, attackedCell), 500);

  // Save computer attack pattern to computer memory through the memoryHandler module
  // If attack hits, save to last hit
  memory.setComputerLastAttack(attackCoordinates);
  
  if (attackResult === 'hit') memory.setComputerLastHit(attackCoordinates);
  
  // Switch player
  turnSwitch.switch();
}

const startAttack = function () {
  const currentGame = memory.getCurrentGame();

  // Remove eventListeners to player ship units/ disable moving
  removeShipEvents();
  currentGame.endPlayerStrategy();

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
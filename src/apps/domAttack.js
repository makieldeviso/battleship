import memory from "./memoryHandler";
import { computerAttackPlayer, generateRandomNumber } from "./computerScript";
import { showGameOverModal, changeScores } from "./domGameOver";

// Image import
import hitGif from "../assets/hit.gif";
import missedGif from "../assets/missed.gif";

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
      changeScores();
      showGameOverModal(isGameOver);

    } else if ( isPlayerAttackTurn ) {
      currentGame.setComputerAttackTurn();
      this.computerTurnScript();
  
    } else if ( isComputerAttackTurn ){
      currentGame.setPlayerAttackTurn();
      this.playerTurnScript();
    }
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

const animateAttack = async function (domCell, domBoard, attackResult) {
  const explosion = new Image();
  explosion.src = attackResult === 'hit' ? hitGif : missedGif
  explosion.setAttribute('id', 'explosion');
  
  // Note: styling at CSS file. This script position the image at absolute offset
  explosion.style.left = `${domCell.offsetLeft - domCell.clientWidth/2}px`;
  explosion.style.top = `${domCell.offsetTop - domCell.clientHeight/2}px`;
  
  // Append image at domBoard
  domBoard.appendChild(explosion);

  // Await animation to finish at require time
  // Note: animation does not loop
  const animatedExplosion = await new Promise((resolve) => {
    setTimeout(() => {
      resolve (explosion);
    }, 500);
  }) 

  // Reassign src to restart animation at frame 1 on next instance
  // Remove the explosion from the DOM
  animatedExplosion.src = '';
  domBoard.removeChild(animatedExplosion);
}


const getAttack = async function (attackedDomCell, attackResult, attackedCell) {
  const domCell = attackedDomCell;
  const domBoard = domCell.parentNode.parentNode;

  // Add indicator if hit ship has sunk
  // Note: indicator syncs with attack animation
  if (attackResult === 'hit') {
    const shipObj = attackedCell.occupied.ship;
    checkShipUnitSank(shipObj);
  }
  
  await animateAttack(domCell, domBoard, attackResult);

  // Add DOM dataset to the attacked cell
  // Note: Wait for attack animation to end
  domCell.dataset.attacked = attackResult;

  // Disable currently open board
  // Note: Wait for attack animation to end
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
  this.classList.remove('open');

  // Then disable player ability to attack
  const computerGridCells = document.querySelectorAll('div#computer-grid div.cell');
  computerGridCells.forEach(cell => {
    if (!cell.dataset.attacked) {
      cell.removeEventListener('click', playerAttack);
      cell.classList.remove('open');
    }
  });
  
  // Switch player
  turnSwitch.switch();
};  

const highlightTurn = function (turner) {
  const opponent = turner === 'player' ? 'computer' : 'player';

  const turnerDetail = document.querySelector(`div#${turner}-detail`);
  const opponentDetail = document.querySelector(`div#${opponent}-detail`);
  
  const turnerGrid = document.querySelector(`div#${turner}-grid div.main-grid`);
  const opponentGrid = document.querySelector(`div#${opponent}-grid div.main-grid`);

  [turnerDetail, opponentGrid].forEach(elem => elem.classList.add('current-turn'));
  [opponentDetail, turnerGrid].forEach(elem => elem.classList.remove('current-turn'));   

}

const playerAttackComputerPhase = function () {
  const computerGridCells = document.querySelectorAll('div#computer-grid div.cell');
  computerGridCells.forEach(cell => {
    if (!cell.dataset.attacked) {
      cell.addEventListener('click', playerAttack);
      cell.classList.add('open');
    }
  });

  highlightTurn('player');
}

const computerAttackPlayerPhase = async function () {
  highlightTurn('computer');

  // Use computerScripts for computer to send attack to player board
  const attackDetails = computerAttackPlayer();
  const { attackCoordinates, attackResult, attackedCell } = attackDetails;

  // Get the dom cell to be attacked by the computer
  const playerGrid = document.querySelector('div#player-grid div.main-grid');
  const attackedDomCell = playerGrid.querySelector(`div.cell[data-column = '${attackCoordinates[0]}'][data-row = '${attackCoordinates[1]}']`);

  // Add UI indicator to attacked cell
  // Note: Create a slight delay for smoother UX 
  await new Promise((resolve) => {
    setTimeout(() => resolve (getAttack(attackedDomCell, attackResult, attackedCell)), 500);
  });

  // Save computer attack pattern to computer memory through the memoryHandler module
  // If attack hits, save to last hit
  memory.setComputerLastAttack(attackCoordinates);
  
  if (attackResult === 'hit') memory.setComputerLastHit(attackCoordinates);
  
  // Switch player
  turnSwitch.switch();
}

const startAttack = function () {
  const currentGame = memory.getCurrentGame();

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
  
}

export default startAttack
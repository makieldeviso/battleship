import Ship from "./createShip";
import memory from "./memoryHandler";

// Random number generator
const generateRandomNumber = function (min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
  
// Create random ship placement for ships
const createShipPlacement = function (board, length) {
  const gameBoard = board.board
  // Note: Ascii for A -> 65, J -> 74
  // Pick a random coordinate
  const selectColumn = generateRandomNumber(65, 74); // Note: this value is char code
  const selectRow = generateRandomNumber(1, 10);

  // Create ship prototype build according to ship orientation.
  const upShip = []; // 0 index -> head, last index -> tail 
  const rightShip = [];
  const downShip = [];
  const leftShip = [];
  for (let i = 0; i < length; i++) {
    const up = selectRow + i;
    const right = selectColumn + i;
    const down = selectRow - i;
    const left = selectColumn - i;
    
    // Conditionals ensures that the coordinates are within board and coordinate is not occupied
    if (up >= 1 && up <= 10 && !gameBoard[`${String.fromCharCode(selectColumn)},${up}`].occupied) {
      upShip.push([`${String.fromCharCode(selectColumn)}`, up]);
    }

    if (right >= 65 && right <= 74 && !gameBoard[`${String.fromCharCode(right)},${selectRow}`].occupied) {
      rightShip.push([`${String.fromCharCode(right)}`, selectRow]);
    }

    if (down >= 1 && down <= 10 && !gameBoard[`${String.fromCharCode(selectColumn)},${down}`].occupied) {
      downShip.push([`${String.fromCharCode(selectColumn)}`, down]);
    }

    if (left >= 65 && down <= 74 && !gameBoard[`${String.fromCharCode(left)},${selectRow}`].occupied) {
      leftShip.push([`${String.fromCharCode(left)}`, selectRow]);
    }
  }

  // Validate and filter out ship prototypes for final selection
  // Note: Coordinates length must be equal to ship length
  const validPrototypes = [upShip, rightShip, downShip, leftShip].filter(ship => ship.length === length);

  if (validPrototypes.length === 0) {
    // If random point does not create prototypes that can place a ship, find another random point
    return createShipPlacement(board, length);
  } 

  const finalPickIndex = generateRandomNumber(0, validPrototypes.length - 1);
  return validPrototypes[finalPickIndex];
}

// Computer places ships on a board 
const computerPlaceShips = function (gameBoard) {
  // Create Ships
  const ships = [
    new Ship(5, 'Carrier'), 
    new Ship(4, 'Battleship'), 
    new Ship(3, 'Destroyer'), 
    new Ship(3, 'Submarine'), 
    new Ship(2, 'Patrol Boat')
  ];

  // Place ships in the board by calling setPlace method 
  // using compBoard and createShipPlacement() as arguments
  // Note: setPlace(board, coordinates), board -> board to use, coordinates -> where to place ship
  // Note: createShipPlacement(board, length) returns array of coordinates 
  ships.forEach(ship => {
    ship.setPlace(gameBoard, createShipPlacement(gameBoard, ship.length));
  })
}

const computerAttackPlayer = function () {
  const currentGame = memory.getCurrentGame();
  const {computer, player} = currentGame;
  const playerBoard = player.gameBoard;
  const playerCellsArray = Object.keys(playerBoard.board).map(key => playerBoard.board[key]);
  const unAttackedCells = playerCellsArray.filter(cell => !cell.attacked);
  const randomIndex = generateRandomNumber(0, unAttackedCells.length - 1);
  const randomCell = unAttackedCells[randomIndex];

  const attackCoordinates = [`${randomCell.column}`, randomCell.row];
  
  const attackDetails = computer.sendAttack(attackCoordinates);
  const {attackResult, attackedCell} = attackDetails

  // Test attack computer 100% hit
  // console.log('computer tests attack is on');
  // const playerShips = playerBoard.ships;
  // const attackCoordinatesArray = [];
  // playerShips.forEach(ship => {
  //   ship.placement.forEach(coordinate => {
  //     if (!player.gameBoard.board[`${coordinate[0]},${coordinate[1]}`].attacked) {
  //       attackCoordinatesArray.push(coordinate)
  //     }
  //   });
  // })
  // const attackCoordinates = attackCoordinatesArray[0];
  // const attackDetails = computer.sendAttack(attackCoordinates);
  // const {attackResult, attackedCell} = attackDetails
  
  return {attackCoordinates, attackResult, attackedCell}
}


export {computerPlaceShips, generateRandomNumber, computerAttackPlayer}
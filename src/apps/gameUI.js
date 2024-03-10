import GamePlay from "./gameplay";


const domPlayerBoard = document.querySelector('div#player-grid');
const domComputerBoard = document.querySelector('div#computer-grid');

const createGridMarkers = function ( boardParent) {

  const createMarkers = function (markerType) {
    const markerCont = document.createElement('div');
    markerCont.setAttribute('class', `${markerType}-marker`);

    for(let i = 0; i < 10; i++) {
      const markerCell = document.createElement('div');
      const markText = document.createElement('p');
  
      if (markerType === 'column') {
        markText.textContent = String.fromCharCode(65 + i);
      } else if (markerType === 'row') {
        markText.textContent = 10 - i;
      }
      
      markerCell.appendChild(markText);
      markerCont.appendChild(markerCell);
    }

    return markerCont;
  }
  
  const playGridNode = boardParent;
  playGridNode.appendChild(createMarkers('column'));
  playGridNode.appendChild(createMarkers('row'));
}


const createGridInBoard = function (player, domBoard) {
  const gameBoard = player.gameBoard.board;

  // Auto append grid markers using the parentBoard argument as reference
  createGridMarkers(domBoard) 

  // Create cells elements for the new board/grid in the DOM
  // Arrange keys order for correct grid placement on DOM
  // Note: Ascii for A -> 65, J -> 74
  const keyOrder = [];
  let columnNameCode = 65; // Ascii for 'A'
  let rowNumber = 10;
  while(rowNumber >= 1 ) {
      const columnName = String.fromCharCode(columnNameCode);
      keyOrder.push(`${columnName},${rowNumber}`);
      
      if (columnNameCode <= 74 && rowNumber >= 1) columnNameCode += 1
      
      if (columnNameCode > 74 && rowNumber >= 1 ) {
        columnNameCode = 65;
        rowNumber -= 1;
      } 
  }
 
  // Reiterate over the arranged keys array to call values from gameBoard object
  keyOrder.forEach(key => {
    const newCell = document.createElement('div');
    newCell.setAttribute('class', 'cell')
    newCell.dataset.column = gameBoard[key].column;
    newCell.dataset.row = gameBoard[key].row;

    if (gameBoard[key].occupied) {
        newCell.classList.add('occupied');
    }
    
    domBoard.querySelector('div.main-grid').appendChild(newCell);
  });

}

const showShipPlacement = function (coordinates, domBoard) {
  // Reiterates over the coordinates argument to make UI changes
  coordinates.forEach(point => {
    // Note: point[0] -> column, point[1] -> row
    const colSelector = `[data-column='${point[0]}']`;
    const rowSelector = `[data-row='${point[1]}']`;
    const domCell = domBoard.querySelector(`div${colSelector}${rowSelector}`);
    domCell.classList.add('occupied');
  })
}

const gameStart = function () {
  const newGame = new GamePlay();
  newGame.start();
  
  createGridInBoard(newGame.computer, domComputerBoard);
  createGridInBoard(newGame.player, domPlayerBoard);

  const computerBoard = newGame.computer.gameBoard.board;
  Object.keys(computerBoard).forEach(key => {
    if (computerBoard[key].occupied) {
      const {column, row} = computerBoard[key];
      // Note: showShipPlacement requires array of coordinates as argument
      showShipPlacement([[column, row]], domComputerBoard )
    }
   
  })

  const bs1 = newGame.playerSelectShipToPlace(5, 'Carrier');
  const bs2 = newGame.playerSelectShipToPlace(4, 'Battleship');
  const bs3 = newGame.playerSelectShipToPlace(3, 'Destroyer');
  const bs4 = newGame.playerSelectShipToPlace(3, 'Submarine');
  const bs5 = newGame.playerSelectShipToPlace(2, 'Patrol Boat');

  newGame.playerPlaceShip(bs1, [['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]]);
  newGame.playerPlaceShip(bs2, [['B', 2],['B', 3], ['B', 4], ['B', 5]]);
  newGame.playerPlaceShip(bs3, [['D', 2],['E', 2], ['F', 2]]);
  newGame.playerPlaceShip(bs4, [['I', 3],['I', 4], ['I', 5]]);
  newGame.playerPlaceShip(bs5, [['E', 9],['F', 9]]);

  showShipPlacement([['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]], domPlayerBoard)

}


export {gameStart, createGridInBoard, showShipPlacement}
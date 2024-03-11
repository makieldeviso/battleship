// Create the grid markers, i.e A-Z & 1-10 marks on the side of board
// Note: createGridMarkers is helper function for createGridInBoard function
const createGridMarkers = function ( boardParent) {
  // Executable createMarkers
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

  // Execute and append markers on the board parent in the DOM
  boardParent.appendChild(createMarkers('column'));
  boardParent.appendChild(createMarkers('row'));
}
  
// Create and append grid board in the DOM
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

    domBoard.querySelector('div.main-grid').appendChild(newCell);
  });
  
  }

  export {createGridInBoard} 
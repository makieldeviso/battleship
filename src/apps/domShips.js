import memory from "./memoryHandler";

const shipNameFormat = function (shipObj) {
  const stringArray = shipObj.name.split(' ');
  const lowerStringArray = stringArray.map(string => string[0].toLowerCase() + string.slice(1));
  return lowerStringArray.join('-');
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

// Helper function for createShipTally and createShipUnit
const createDomShip = function (shipObj) {
  const shipWhole = document.createElement('div');
  const shipName = shipNameFormat(shipObj);
  shipWhole.classList.add(`${shipName}`);
  shipWhole.setAttribute('title', shipObj.name);

  for (let i = 0; i < shipObj.length; i++) {
    const shipCell = document.createElement('div');
    shipCell.classList.add('ship-cell');
    shipWhole.appendChild(shipCell);
  }

  return shipWhole;
}

const createShipTally = function (shipObj, playerName) {
  const shipWhole = createDomShip(shipObj);
  shipWhole.setAttribute('id', `${playerName}-${shipNameFormat(shipObj)}-tally`);

  const tallyCont = document.querySelector(`div#${playerName}-tally`);
  tallyCont.appendChild(shipWhole);
}


class ShipMoveHandler {
  constructor (shipNode, clickEvent) {
    this.shipUnit = shipNode;
    this.shipObj = this.findShipObj();
    this.initShipPlacement = this.shipObj.placement;
    this.firstClickPos = this.findFirstClickPos(clickEvent);
    this.initShipPos = this.findInitShipPos();
    this.hoveredCells = [];
  }
  
  findShipObj () {
    const currentPlayerShips = memory.current.player.gameBoard.ships;
    const shipObject = currentPlayerShips.find(ship => ship.name === this.shipUnit.title);
    return shipObject
  }

  findFirstClickPos (clickEvent) {
    const firstPosX = this.shipUnit.offsetLeft - clickEvent.clientX;
    const firstPosY = this.shipUnit.offsetTop - clickEvent.clientY;
    return {x: firstPosX, y: firstPosY};
  }

  findInitShipPos () {
    const initShipPosX = this.shipUnit.offsetLeft;
    const initShipPosY = this.shipUnit.offsetTop;
    return {x: initShipPosX, y:initShipPosY};
  }

  getCurrentDomPlacement () {
    const currentDomPlacement = this.initShipPlacement.map(coor => document.querySelector(`div.cell[data-column='${coor[0]}'][data-row='${coor[1]}']`));
    return currentDomPlacement;
  }

  getFirstClickPos () {
    const firstPosX = this.firstClickPos.x;
    const firstPosY = this.firstClickPos.y;
    return {x: firstPosX, y: firstPosY};
  }

  getShipOrientation () {
    const shipWidth = this.shipUnit.clientWidth;
    const shipHeight = this.shipUnit.clientHeight;
    return shipHeight > shipWidth? 'vertical' : 'horizontal';
  }

  setHoveredCells (coordinatesArray) {
    this.hoveredCells = coordinatesArray;
  }

}

let shipMoveHandler;

// Event listener function
const selectShipUnit = function (event) { 
  if (event.button === 0) {
    // Set ship clicked for shipMoveHandler
    shipMoveHandler = new ShipMoveHandler(this, event);
    event.preventDefault();

    const {shipObj} = shipMoveHandler;
    this.classList.add('selected');

    // Remove UI indicator of occupied cell
    shipMoveHandler.getCurrentDomPlacement().forEach(cell => cell.classList.remove('occupied'))

    // Add/ remove event listener
    shipMoveHandler.shipUnit.removeEventListener('mousedown', selectShipUnit);
    
    // Add/ remove event listeners
    shipMoveHandler.shipUnit.addEventListener('mousemove', moveShipUnit);
    shipMoveHandler.shipUnit.addEventListener('mouseup', placeShipUnit);  
  } 
}


// Helper/ Eventlistener function -> mousemove
const moveShipUnit = function (event) {
  // Move the ship unit along the cursor
  // Note: event.clientX and Y is position of cursor while moving
  const {shipUnit, shipObj} = shipMoveHandler;

  // Ship follows the cursor when mouse is moved
  shipUnit.style.left = `${event.clientX + shipMoveHandler.getFirstClickPos(event).x}px`;
  shipUnit.style.top = `${event.clientY + shipMoveHandler.getFirstClickPos(event).y}px`;

  // Remove occupied UI indicator to cells in the DOM
  shipMoveHandler.getCurrentDomPlacement().forEach(cell => cell.classList.remove('occupied'));

  const shipPosX = shipUnit.offsetLeft;
  const shipPosY = shipUnit.offsetTop;
  const shipWidth = shipUnit.clientWidth;
  const shipHeight = shipUnit.clientHeight;
  const orientation = shipMoveHandler.getShipOrientation();

  // Get nearest cell at head and tail
  let headNearCell;
  let tailNearCell;
  if (orientation === 'vertical') {
    headNearCell = document.elementsFromPoint(shipPosX + shipWidth/2, shipPosY + shipWidth/2)
    .find(node => node.classList.contains('cell'));

    tailNearCell = document.elementsFromPoint(shipPosX + shipWidth/2, shipPosY + shipHeight - shipWidth/2)
    .find(node => node.classList.contains('cell'));

  } else {
    headNearCell = document.elementsFromPoint(shipPosX + shipHeight/2, shipPosY + shipHeight/2)
    .find(node => node.classList.contains('cell'));

    tailNearCell = document.elementsFromPoint(shipPosX + shipWidth - shipHeight/2, shipPosY + shipHeight/2)
    .find(node => node.classList.contains('cell'));
  }

  // Save the cells nearest to the head and tail of the ship unit
  const newDomPlacement =  [headNearCell, tailNearCell];

  // Check if headNearCella and tailNearCell are occupied
  // Note: Splice newDomPlacement. Don't reassign headNearCell and tailIsOccupied
  const headIsOccupied = headNearCell ? headNearCell.classList.contains('occupied') : false;
  const tailIsOccupied = tailNearCell ? tailNearCell.classList.contains('occupied') : false;
  // If head/ tail is an occupied cell change it to null to indicate invalid placement
  if (headIsOccupied) newDomPlacement.splice(0, 1,  null);
  if (tailIsOccupied) newDomPlacement.splice(1, 1,  null);

  // Add the remaining adjacent cells to the nearest head and tail to the newDomPlacement array
  for (let i = 1; newDomPlacement.length < shipObj.length; i++) {
    let adjCellX;
    let adjCellY;
    let adjCell;

    if (headNearCell) {
      if (orientation === 'vertical') {
        adjCellX = String.fromCharCode(headNearCell.dataset.column.charCodeAt(0));
        adjCellY = Number(headNearCell.dataset.row) - i;

      } else {
        adjCellX = String.fromCharCode(headNearCell.dataset.column.charCodeAt(0) + i);
        adjCellY = Number(headNearCell.dataset.row);
      }

      adjCell = document.querySelector(`div.cell[data-column='${adjCellX}'][data-row='${adjCellY}']`);

      if (adjCell) adjCell = !adjCell.classList.contains('occupied') ? adjCell : null
      
      newDomPlacement.splice(newDomPlacement.length-1, 0, adjCell);

    } else if (tailNearCell) {
      if (orientation === 'vertical') {
        adjCellX = String.fromCharCode(tailNearCell.dataset.column.charCodeAt(0));
        adjCellY = Number(tailNearCell.dataset.row) + i;
        
      } else {
        adjCellX = String.fromCharCode(tailNearCell.dataset.column.charCodeAt(0) - i);
        adjCellY = Number(tailNearCell.dataset.row);
      }

      adjCell = document.querySelector(`div.cell[data-column='${adjCellX}'][data-row='${adjCellY}']`);
      if (adjCell) adjCell = !adjCell.classList.contains('occupied') ? adjCell : null
      newDomPlacement.splice(1, 0, adjCell);

    } else {
      newDomPlacement.splice(newDomPlacement.length - 1, 0, null);
    }
  }
  
  // Actively change visual indicator of cell placement validity of ship unit to the board
  // Remove UI indicator of placement when ship unit is being moved
  shipMoveHandler.hoveredCells.forEach(cell => {
    if (cell) {
      cell.classList.remove('hover');
      cell.classList.remove('invalid');
    }
  })

  // Adds UI indicator to cell placement when moving ship unit
  if (newDomPlacement.includes(null) || newDomPlacement.includes(undefined)) {
    newDomPlacement.forEach(cell => {
      if (cell) cell.classList.add('hover');
      if (cell) cell.classList.add('invalid');
    })
  } else {
    newDomPlacement.forEach(cell => {
      if (cell) cell.classList.add('hover');
    })
  }

  // Save the last newDomPlacement to shipMoveHandler hoveredCells upon completing the mouse move
  shipMoveHandler.setHoveredCells(newDomPlacement);
}

// Helper/ Eventlistener function -> mouseup
const placeShipUnit = function (event) {
  const {shipUnit, shipObj} = shipMoveHandler;
  let newPlacement = shipMoveHandler.initShipPlacement;
  
  const hoveredCellsAreValid = !shipMoveHandler.hoveredCells.includes(null) 
    && !shipMoveHandler.hoveredCells.includes(undefined) 
    && shipMoveHandler.hoveredCells.length !== 0;

  if (hoveredCellsAreValid && event.button === 0) {
    // Note: event.button === 2 right click event. Ensure this triggers only for left mouse click
    // Create newPlacement array as coordinates for new ship placement 
    newPlacement = shipMoveHandler.hoveredCells.map(cell => [cell.dataset.column, Number(cell.dataset.row)]);

    // Place the ship unit to new placement on DOM
    shipUnit.style.left = `${shipMoveHandler.hoveredCells[0].offsetLeft}px`;
    shipUnit.style.top = `${shipMoveHandler.hoveredCells[0].offsetTop}px`;
    
  } else if (!hoveredCellsAreValid || event.button === 2) {
    event.preventDefault();

    // Place the ship unit back to its previous placement
    shipUnit.style.left = `${shipMoveHandler.initShipPos.x}px`;
    shipUnit.style.top = `${shipMoveHandler.initShipPos.y}px`;

    shipMoveHandler.hoveredCells.forEach(cell => {
      if (cell) {
        cell.classList.remove('hover');
        cell.classList.remove('invalid');
      }
    })
  }
  
  newPlacement.forEach(coor => {
    const occupiedCell = document.querySelector(`div.cell[data-column='${coor[0]}'][data-row='${coor[1]}']`);
    occupiedCell.classList.add('occupied');
  })

  shipUnit.classList.remove('selected');

  // Execute setPlace method with newPlacement array
  shipObj.movePlace(newPlacement);

  // Add/ Removes eventListeners
  shipMoveHandler.shipUnit.removeEventListener('mousemove', moveShipUnit);
  shipMoveHandler.shipUnit.removeEventListener('mouseup', placeShipUnit);

  // Return the removed mousedown event upon ship placement
  shipMoveHandler.shipUnit.addEventListener('mousedown', selectShipUnit);

}

const rotateShipUnit = function () {
  let currentRotation = this.style.rotate;
  if (currentRotation) {
    const unitIndexStart = currentRotation.match(/[a-z]/).index
    currentRotation = Number(currentRotation.slice(0, unitIndexStart ))
  } else if (currentRotation >= 360 || !currentRotation) {
    currentRotation = 0;
  }
  
  this.style.rotate = `${currentRotation + 90}deg`;
  console.log('double click');
}

const createShipUnit = function (shipObj, playerName) {
  const shipWhole = createDomShip(shipObj);
  shipWhole.setAttribute('id', `${playerName}-${shipNameFormat(shipObj)}-unit`);
  shipWhole.classList.add('ship-unit');
  
  const playGrid = document.querySelector(`div#${playerName}-grid.play-grid`);
  playGrid.appendChild(shipWhole);

  // Place ship at its occupied cell
  const shipPlacement = shipObj.placement;
  const shipHead = shipPlacement[0]
  const shipTail = shipPlacement[shipPlacement.length - 1];

  // Ship placement on DOM (start)
  // Note: Scripts below contain style manipulation!
  // CSS var used -> ['cell-size']
  let pointBase;
  // Check if placement is horizontal or vertical
  // if coordinate[0] are same vert. if coordinate[1] are same hor
  if (shipHead[0] === shipTail[0]) {
    // Note: orientation = vertical
    // Since div is vertical its width is 1 cell and height is num of cells
    shipWhole.style.gridTemplateColumns = `1fr`;
    shipWhole.style.gridTemplateRows = `repeat(${shipPlacement.length}, 1fr)`;

    // Flex box will always wrap downwards so the position basis must be changed
    // between the head and tail. If head is higher position use head, else use tail as base point
    if (shipHead[1] > shipTail[1]) {
      pointBase = shipHead;
      shipWhole.dataset.dir = 'up';
    } else {
      pointBase = shipTail;
      shipWhole.dataset.dir = 'down';
    }

  } else {
    // Note: orientation = horizontal
    // Since div is horizontal its width is num of cells and height is 1 cell
    shipWhole.style.gridTemplateColumns = `repeat(${shipPlacement.length}, 1fr)`;
    shipWhole.style.gridTemplateRows = '1fr';

    // Flex box will always wrap rightwards so the position basis must be changed
    // between the head and tail. If head id left side use head, else use tail as base point
    if (shipHead[0].charCodeAt(0) < shipTail[0].charCodeAt(0)) {
      pointBase = shipHead;
      shipWhole.dataset.dir = 'right';
    } else {
      pointBase = shipTail;
      shipWhole.dataset.dir = 'left';
    }
  }

  const cellSelector = `div.cell[data-column='${pointBase[0]}'][data-row='${pointBase[1]}']`;
  const selector = `div#${playerName}-grid div.main-grid ${cellSelector}`;
  const headCell = document.querySelector(selector);

  const shipHeadPos = {
    top: `${headCell.offsetTop}px`,
    left: `${headCell.offsetLeft}px`
  }

  shipWhole.style.top = shipHeadPos.top;
  shipWhole.style.left = shipHeadPos.left;
  // Ship placement on DOM (end)

  if (playerName === 'player') {
    shipWhole.addEventListener('mousedown', selectShipUnit);
    shipWhole.addEventListener('dblclick', rotateShipUnit);
    shipWhole.addEventListener('contextmenu', (event) => event.preventDefault());
  }
}



  export {showShipPlacement, createShipTally, createShipUnit}
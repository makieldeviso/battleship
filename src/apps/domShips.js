import memory from "./memoryHandler";

// Utility function for formatting ship name string
const shipNameFormat = function (shipObj) {
  const stringArray = shipObj.name.split(' ');
  const lowerStringArray = stringArray.map(string => string[0].toLowerCase() + string.slice(1));
  return lowerStringArray.join('-');
}

const showShipPlacement = function (coordinates, domBoard) {
  // Reiterates over the coordinates argument to make UI changes. Adds occupied class to cells
  coordinates.forEach(point => {
    // Note: point[0] -> column, point[1] -> row
    const colSelector = `[data-column='${point[0]}']`;
    const rowSelector = `[data-row='${point[1]}']`;
    const domCell = domBoard.querySelector(`div${colSelector}${rowSelector}`);
    domCell.classList.add('occupied');
  })
}

// Helper function for createShipTally and createShipUnit
// Creates shipUnit element with attributes
const createDomShip = function (shipObj) {
  const shipUnit = document.createElement('div');
  const shipName = shipNameFormat(shipObj);
  shipUnit.classList.add(`${shipName}`);
  shipUnit.setAttribute('title', shipObj.name);

  for (let i = 0; i < shipObj.length; i++) {
    const shipCell = document.createElement('div');
    shipCell.classList.add('ship-cell');
    shipUnit.appendChild(shipCell);
  }

  return shipUnit;
}

// Creates ship tally/ score board
const createShipTally = function (shipObj, playerName) {
  const shipUnit = createDomShip(shipObj);
  shipUnit.setAttribute('id', `${playerName}-${shipNameFormat(shipObj)}-tally`);

  const tallyCont = document.querySelector(`div#${playerName}-tally`);
  tallyCont.appendChild(shipUnit);
}

// Saves the events of moving ships in the board
let shipMoveHandler;
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
    const currentPlayerShips = memory.getCurrentGame().player.gameBoard.ships;
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

// Event listener function (start)
const selectShipUnit = function (event) { 
  if (event.button === 0 && event.detail === 1) {
    // Set ship clicked for shipMoveHandler
    shipMoveHandler = new ShipMoveHandler(this, event);
    const { shipUnit } = shipMoveHandler;
    event.preventDefault();

    this.classList.add('selected');

    // Remove UI indicator of occupied cell
    shipMoveHandler.getCurrentDomPlacement().forEach(cell => cell.classList.remove('occupied'))

    // Remove event listener
    shipUnit.removeEventListener('mousedown', selectShipUnit);
    
    // Add event listeners
    shipUnit.addEventListener('mousemove', moveShipUnit);
    shipUnit.addEventListener('mouseup', placeShipUnit);  
  } 
}

// Helper function for moving ship unit. Not an eventListener function
const createNewDomPlacement = function () {
  const {shipUnit, shipObj} = shipMoveHandler;
  const shipRect = shipUnit.getBoundingClientRect();
  const orientation = shipMoveHandler.getShipOrientation();
  const playerBoard = document.querySelector('div#player-grid div.main-grid');

  // Get nearest cell at head and tail
  let headNearCell;
  let tailNearCell;
  if (orientation === 'vertical') {
    headNearCell = document.elementsFromPoint(shipRect.x + shipRect.width/2, shipRect.y + shipRect.width/2)
    .find(node => node.parentNode === playerBoard && node.classList.contains('cell') );

    tailNearCell = document.elementsFromPoint(shipRect.x + shipRect.width/2, shipRect.y + shipRect.height - shipRect.width/2)
    .find(node => node.parentNode === playerBoard && node.classList.contains('cell'));
    
  } else {
    headNearCell = document.elementsFromPoint(shipRect.x + shipRect.height/2, shipRect.y + shipRect.height/2)
    .find(node => node.parentNode === playerBoard && node.classList.contains('cell'));

    tailNearCell = document.elementsFromPoint(shipRect.x + shipRect.width - shipRect.height/2, shipRect.y + shipRect.height/2)
    .find(node => node.parentNode === playerBoard && node.classList.contains('cell'));
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

  return newDomPlacement
}

// Eventlistener function -> mousemove
const moveShipUnit = function (event) {
  // Move the ship unit along the cursor
  // Note: event.clientX and Y is position of cursor while moving
  const {shipUnit} = shipMoveHandler;

  // Ship follows the cursor when mouse is moved
  shipUnit.style.left = `${event.clientX + shipMoveHandler.getFirstClickPos(event).x}px`;
  shipUnit.style.top = `${event.clientY + shipMoveHandler.getFirstClickPos(event).y}px`;

  // Remove occupied UI indicator to cells in the DOM
  shipMoveHandler.getCurrentDomPlacement().forEach(cell => cell.classList.remove('occupied'));

  // Execute createNewDomPlacement which return array of Nodes
  const newDomPlacement = createNewDomPlacement();
  
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

  // Removes double clicking while moving
  shipUnit.removeEventListener('dblclick', rotateShipUnit);
}

// Eventlistener function -> mouseup
const placeShipUnit = function (event) {
  event.preventDefault();
  const eventIsMouseUp = event.type === 'mouseup';
  const eventIsDblClick = event.type === 'dblclick';
  let placementSuccessful = false;

  const {shipUnit, shipObj} = shipMoveHandler;
  let newPlacement = shipMoveHandler.initShipPlacement;

  const hoveredCellsAreValid = !shipMoveHandler.hoveredCells.includes(null) 
    && !shipMoveHandler.hoveredCells.includes(undefined) 
    && shipMoveHandler.hoveredCells.length !== 0;
  
  if (
    ( hoveredCellsAreValid && event.button === 0 && eventIsMouseUp ) ||
    ( hoveredCellsAreValid && eventIsDblClick )
    ){
    // Note: event.button === 2 right click event. Ensure this triggers only for left mouse click
    // Create newPlacement array as coordinates for new ship placement 
    newPlacement = shipMoveHandler.hoveredCells.map(cell => [cell.dataset.column, Number(cell.dataset.row)]);

    // Place the ship unit to new placement on DOM
    shipUnit.style.left = `${shipMoveHandler.hoveredCells[0].offsetLeft}px`;
    shipUnit.style.top = `${shipMoveHandler.hoveredCells[0].offsetTop}px`;

    placementSuccessful = true;
    
  } else if (
      ( !hoveredCellsAreValid && eventIsMouseUp ) || 
      ( !hoveredCellsAreValid && eventIsDblClick ) ||
      ( event.button === 2 )
    ){

    // Place the ship unit back to its previous placement
    shipUnit.style.left = `${shipMoveHandler.initShipPos.x}px`;
    shipUnit.style.top = `${shipMoveHandler.initShipPos.y}px`;

    shipMoveHandler.hoveredCells.forEach(cell => {
      if (cell) {
        cell.classList.remove('hover');
        cell.classList.remove('invalid');
      }
    })

    placementSuccessful = false;

  } 
  // Adds occupied and remove hover class for occupied cells
  newPlacement.forEach(coor => {
    const occupiedCell = document.querySelector(`div.cell[data-column='${coor[0]}'][data-row='${coor[1]}']`);
    occupiedCell.classList.remove('hover');
    occupiedCell.classList.add('occupied');
  })

  shipUnit.classList.remove('selected');

  // Execute setPlace method with newPlacement array
  shipObj.movePlace(newPlacement);

  // Remove eventListeners
  shipUnit.removeEventListener('mousemove', moveShipUnit);
  shipUnit.removeEventListener('mouseup', placeShipUnit);

  // Return the removed mousedown event upon ship placement
  shipUnit.addEventListener('mousedown', selectShipUnit);
  shipUnit.addEventListener('dblclick', rotateShipUnit);

  return placementSuccessful
}

// EventListener function -> rotates the shipUnit orientation
// Note: this function utilizes createNewDomPlacement and placeShipUnit functions
const rotateShipUnit = function (event) {

  const {shipUnit, shipObj} = shipMoveHandler;
  const initShipDir = shipUnit.dataset.dir;
  const initTemplateCol = shipUnit.style.gridTemplateColumns;
  const iniTemplateRows = shipUnit.style.gridTemplateRows;

  // Rotate ship direction clockwise to check placement validity
  // Note: remove class occupied to cells which the shipUnit is currently at
  const currentDomPlacement = shipMoveHandler.getCurrentDomPlacement();
  currentDomPlacement.forEach(cell => {
    cell.classList.remove('occupied');
  });

  if (initShipDir === 'up' || initShipDir === 'down') {
    // Turn vertical to horizontal
    shipUnit.dataset.dir = initShipDir === 'up' ? 'right' : 'left';
    shipUnit.style.gridTemplateColumns = `repeat(${shipObj.length}, 1fr)`;
    shipUnit.style.gridTemplateRows = '1fr';

    if (shipObj.length > 2 && shipObj.length < 5) {
      shipUnit.style.left = `${shipUnit.offsetLeft - shipUnit.clientWidth / 2}px`;
      shipUnit.style.top = `${shipUnit.offsetTop + shipUnit.clientHeight}px`;
    } else if (shipObj.length === 5) {
      shipUnit.style.left = `${shipUnit.offsetLeft - shipUnit.clientWidth / 2}px`;
      shipUnit.style.top = `${shipUnit.offsetTop + shipUnit.clientHeight * 2}px`;
    }

  } else if (initShipDir === 'right' || initShipDir === 'left') {
    // Turn horizontal to vertical
    shipUnit.dataset.dir = initShipDir === 'left' ? 'up' : 'down';
    shipUnit.style.gridTemplateColumns = '1fr';
    shipUnit.style.gridTemplateRows = `repeat(${shipObj.length}, 1fr)`;

    if (shipObj.length > 2 && shipObj.length < 4) {
      shipUnit.style.left = `${shipUnit.offsetLeft + shipUnit.clientWidth}px` ;
      shipUnit.style.top = `${shipUnit.offsetTop - shipUnit.clientHeight / 2}px`;

    } else if (shipObj.length === 4) {
      shipUnit.style.left = `${shipUnit.offsetLeft + shipUnit.clientWidth * 1.5}px` ;
      shipUnit.style.top = `${shipUnit.offsetTop - shipUnit.clientHeight / 3}px`;

    } else if (shipObj.length === 5) {
      shipUnit.style.left = `${shipUnit.offsetLeft + shipUnit.clientWidth * 2}px`;
      shipUnit.style.top = `${shipUnit.offsetTop - shipUnit.clientHeight / 2}px`;
    }
  }

  // After testing rotation, createNewDomPlacement and save placement to shipMoveHandler
  const newDomPlacement = createNewDomPlacement();
  shipMoveHandler.setHoveredCells(newDomPlacement);

  // Execute placeShipUnit by passing this event as argument
  // Note: placeShipUnit() will return a boolean, weather the new placement is successful or not
  // Note: successful placement will mutate the player gameBoard (board and ship.placement)
  const placementSuccessful = placeShipUnit(event);

  // If rotation is unsuccessful shipUnit returns to original placement
  if (!placementSuccessful) {
    shipUnit.dataset.dir = initShipDir;
    shipUnit.style.gridTemplateColumns = initTemplateCol;
    shipUnit.style.gridTemplateRows = iniTemplateRows;
  }
}
// Event listener function (end)

// Creates the shipUnit placed on the DOM
// Note: playerName parameter does not pertain to name of player. Instead only defined as 'player' or 'computer
const createShipUnit = function (shipObj, playerName) {
  const shipUnit = createDomShip(shipObj);
  shipUnit.setAttribute('id', `${playerName}-${shipNameFormat(shipObj)}-unit`);
  shipUnit.classList.add('ship-unit');
  
  const playGrid = document.querySelector(`div#${playerName}-grid.play-grid`);
  playGrid.appendChild(shipUnit);

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
    shipUnit.style.gridTemplateColumns = `1fr`;
    shipUnit.style.gridTemplateRows = `repeat(${shipPlacement.length}, 1fr)`;

    // Flex box will always wrap downwards so the position basis must be changed
    // between the head and tail. If head is higher position use head, else use tail as base point
    if (shipHead[1] > shipTail[1]) {
      pointBase = shipHead;
      shipUnit.dataset.dir = 'up';
    } else {
      pointBase = shipTail;
      shipUnit.dataset.dir = 'down';
    }

  } else {
    // Note: orientation = horizontal
    // Since div is horizontal its width is num of cells and height is 1 cell
    shipUnit.style.gridTemplateColumns = `repeat(${shipPlacement.length}, 1fr)`;
    shipUnit.style.gridTemplateRows = '1fr';

    // Grid will always wrap rightwards so the position basis must be changed
    // between the head and tail. If head id left side use head, else use tail as base point
    if (shipHead[0].charCodeAt(0) < shipTail[0].charCodeAt(0)) {
      pointBase = shipHead;
      shipUnit.dataset.dir = 'right';
    } else {
      pointBase = shipTail;
      shipUnit.dataset.dir = 'left';
    }
  }

  const cellSelector = `div.cell[data-column='${pointBase[0]}'][data-row='${pointBase[1]}']`;
  const selector = `div#${playerName}-grid div.main-grid ${cellSelector}`;
  const headCell = document.querySelector(selector);
   
  shipUnit.style.top = `${headCell.offsetTop}px`;
  shipUnit.style.left = `${headCell.offsetLeft}px`;
  // Ship placement on DOM (end)

  // Adds eventListeners to shipUnit made
  if (playerName === 'player') {
    shipUnit.addEventListener('mousedown', selectShipUnit);
    shipUnit.addEventListener('dblclick', rotateShipUnit);
    shipUnit.addEventListener('contextmenu', (event) => event.preventDefault());
  }
}

const removeShipEvents = function () {
  // Finalize ship strategy phase/ ship movement
  // Removes event listeners to ships
  const shipUnits = document.querySelectorAll('div#player-grid div.ship-unit');
  shipUnits.forEach(ship => {
    ship.removeEventListener('mousedown', selectShipUnit);
    ship.removeEventListener('mousemove', moveShipUnit);
    ship.removeEventListener('mouseup', placeShipUnit);
    ship.removeEventListener('dblclick', rotateShipUnit);
  })
}

export {showShipPlacement, createShipTally, createShipUnit, removeShipEvents}
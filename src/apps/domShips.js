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

// Event listener function
const selectShip = function (event) {
  const shipUnit = this;
  const currentPlayerShips = memory.current.player.gameBoard.ships;
  const shipObj = currentPlayerShips.find(ship => ship.name === this.title);
  
  let currentDomPlacement = shipObj.placement.map(coor => document.querySelector(`div.cell[data-column='${coor[0]}'][data-row='${coor[1]}']`));
  
  let hoveredCells = [];
  // Remove the shipObj from the gameBoard obj
  shipObj.removePlace();
  
  if (event.type === 'mousedown') {
    // Move the ship unit along the cursor
    const firstPosX = shipUnit.offsetLeft - event.clientX;
    const firstPosY = shipUnit.offsetTop - event.clientY;

    // Helper/ Eventlistener function -> mousemove
    const moveShipUnit = function (event) {
      // Ship unit follows the cursor in the DOM while mousedown
      shipUnit.style.left = `${event.clientX + firstPosX}px`;
      shipUnit.style.top = `${event.clientY + firstPosY}px`;

      const shipPosX = shipUnit.offsetLeft;
      const shipPosY = shipUnit.offsetTop;
      const shipWidth = shipUnit.clientWidth;
      const shipHeight = shipUnit.clientHeight;
      const orientation = shipHeight > shipWidth? 'vertical' : 'horizontal';

      // Get nearest cell at head and tail
      let headNearCell;
      let tailNearCell;
      if (orientation === 'vertical') {
        headNearCell = document.elementsFromPoint(shipPosX + shipWidth/2, shipPosY + shipWidth/2)
        .find(node => node.className === 'cell');

        tailNearCell = document.elementsFromPoint(shipPosX + shipWidth/2, shipPosY + shipHeight - shipWidth/2)
        .find(node => node.className === 'cell');

      } else {
        headNearCell = document.elementsFromPoint(shipPosX + shipHeight/2, shipPosY + shipHeight/2)
        .find(node => node.className === 'cell');

        tailNearCell = document.elementsFromPoint(shipPosX + shipWidth - shipHeight/2, shipPosY + shipHeight/2)
        .find(node => node.className === 'cell');
      }

      const newDomPlacement =  [headNearCell, tailNearCell];
      
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
          newDomPlacement.splice(newDomPlacement.length-1, 0, adjCell);

        } else {
          newDomPlacement.splice(newDomPlacement.length-1, 0, null);
        }

      }

      console.log(newDomPlacement)
      
  }


    // Helper/ Eventlistener function -> mouseup
    const placeShipUnit = function (event) {
      // elementsFromPoint gets an array of elements nearest the mouse up release point
      // Chain .find() to get the grid cell needed
      const shipPosX = shipUnit.offsetLeft;
      const shipPosY = shipUnit.offsetTop;
      const shipWidth = shipUnit.clientWidth;
      const shipHeight = shipUnit.clientHeight;
      const midPoint = shipPosX + shipWidth / 2;

      let orientation = shipHeight > shipWidth? 'vertical' : 'horizontal';

      const nearestCellAtMid = document.elementsFromPoint(shipPosX + shipWidth / 2, shipPosY + shipHeight / 2)
      .find(node => node.className === 'cell')


      // Removes eventListeners upon release
      document.removeEventListener('mousemove', moveShipUnit);
      document.removeEventListener('mouseup', placeShipUnit);
    }

    // Add event listener upon clicking ship unit
    document.addEventListener('mousemove', moveShipUnit);
    document.addEventListener('mouseup', placeShipUnit);
  }

  
}


// const rotateShip = function () {
//   // let currentRotation = this.style.rotate;
//   // if (currentRotation) {
//   //   const unitIndexStart = currentRotation.match(/[a-z]/).index
//   //   currentRotation = Number(currentRotation.slice(0, unitIndexStart ))
//   // } else if (currentRotation >= 360 || !currentRotation) {
//   //   currentRotation = 0;
//   // }
  
//   // this.style.rotate = `${currentRotation + 90}deg`;
//   // console.log(currentRotation)
// }







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
    shipWhole.addEventListener('mousedown', selectShip);
    // shipWhole.addEventListener('touchstart', selectShip)
  }
}



  export {showShipPlacement, createShipTally, createShipUnit}
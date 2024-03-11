import Ship from "./createShip";

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

  return shipWhole
}

const createShipTally = function (shipObj, playerName) {
  const shipWhole = createDomShip(shipObj);
  shipWhole.setAttribute('id', `${playerName}-${shipNameFormat(shipObj)}-tally`);

  const tallyCont = document.querySelector(`div#${playerName}-tally`);
  tallyCont.appendChild(shipWhole);
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
    shipWhole.style.width = `var(--cell-size)`;
    shipWhole.style.height = `calc(${shipPlacement.length} * var(--cell-size))`;

    // Flex box will always wrap downwards so the position basis must be changed
    // between the head and tail. If head is higher position use head, else use tail as base point
    if (shipHead[1] > shipTail[1]) {
      pointBase = shipHead;
    } else {
      pointBase = shipTail;
    }

  } else {
    // Note: orientation = horizontal
    // Since div is horizontal its width is num of cells and height is 1 cell
    shipWhole.style.width = `calc(${shipPlacement.length} * var(--cell-size))`;
    shipWhole.style.height = `var(--cell-size)`;

    // Flex box will always wrap rightwards so the position basis must be changed
    // between the head and tail. If head id left side use head, else use tail as base point
    if (shipHead[0].charCodeAt(0) < shipTail[0].charCodeAt(0)) {
      pointBase = shipHead;
    } else {
      pointBase = shipTail;
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
}



  export {showShipPlacement, createShipTally, createShipUnit}
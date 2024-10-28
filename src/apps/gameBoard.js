const createBoard = () => {
    const newBoard = {};

    let columnNameCode = 65; // Ascii for 'A'
    let rowNumber = 1;

    // Note: Ascii for A -> 65, J -> 74
    // Create cells object for the new board
    while(columnNameCode <= 74 ) {
        const columnName = String.fromCharCode(columnNameCode);
        const cellName = `${columnName},${rowNumber}`;

        newBoard[cellName] = {column: columnName, row: rowNumber};
        
        if (rowNumber === 10 && columnNameCode <= 74) columnNameCode += 1;

        if (rowNumber < 10 && columnNameCode <= 74) {
            rowNumber += 1;
        } else if (rowNumber >= 10 && columnNameCode <= 74) {
            rowNumber = 1;
        }
    }

    // Make adjacency list for the cells
    const cellKeys = Object.keys(newBoard);
    cellKeys.forEach(key => {
        const cellCol = newBoard[key].column;
        const cellRow = newBoard[key].row;

        const adjArray = [];

        // Note: Ascii for A -> 65, J -> 74
        // Pushes Adjacency instances  to adjArray
        // Note: Cells are validated if it is within the board
        const columnChange = [cellCol.charCodeAt(0) + 1, cellCol.charCodeAt(0) - 1];
        const rowChange =  [cellRow + 1, cellRow - 1];
        
        columnChange.forEach(colVal => {
            if (colVal >= 65 && colVal <= 74) {
                const cellName = `${String.fromCharCode(colVal)},${cellRow}`;
                adjArray.push(newBoard[cellName]);
            }
        });

        rowChange.forEach(rowVal => {
            if (rowVal >= 1 && rowVal <= 10) {
                const cellName = `${cellCol},${rowVal}`;
                adjArray.push(newBoard[cellName]);
            }
        });
        
        // Assign created array of adjacent cells to the cell
        newBoard[key].adjacent = adjArray;
    })
    
    return newBoard
}

class GameBoard {
    constructor (owner) {
        this.owner = owner;
        this.board = createBoard();
        this.ships = [];
        this.allShipsSunk = false;
    } 

    receiveAttack (coordinates) {
        const gameBoard = this.board;
        const cellName = `${coordinates[0]},${coordinates[1]}`;
        const attackedCell = gameBoard[cellName];

        let attackResult = 'missed';

        if (attackedCell.occupied) {
           attackResult = 'hit';

            // Add hits to the ship that occupies given coordinate
            const shipOccupant = attackedCell.occupied.ship;
            shipOccupant.hitPoints += 1; // Adds hitPoints to ship
            shipOccupant.isSunk(); // Check current status, then change ship object property if sunk
        }

        // Logs this cell if it has been attacked
        attackedCell.attacked = attackResult;

        // Check if all ships has sunk
        this.checkShipsSunk();
        return {attackResult, attackedCell}
    }

    checkShipsSunk () {
        const currentShips = this.ships;
        const stillAfloat = currentShips.some(ship => !ship.sunk);
        
        if (stillAfloat) {
            this.allShipsSunk = false;
        } else {
            this.allShipsSunk = true;
        }
    }

    getShipsSunk () {
        return this.allShipsSunk;
    }

}

export default GameBoard
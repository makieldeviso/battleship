const createBoard = () => {
    const newBoard = {}
        let columnNameCode = 65; // Ascii for 'A'
        let rowNumber = 1;

        // Note: Ascii for A -> 65, J -> 74

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

       return newBoard
}


class GameBoard {
    constructor () {
        this.board = createBoard();
    } 

    receiveAttack(coordinates) {
        const gameBoard = this.board;
        const cellName = `${coordinates[0]},${coordinates[1]}`;
        const cell = gameBoard[cellName];

        let result = 'missed';

        if (cell.occupied) {
            result = 'hit';

            // Add hits to the ship that occupies given coordinate
            const shipOccupant = cell.occupied.ship;
            shipOccupant.hitPoints += 1; // Adds hitPoints to ship
            shipOccupant.isSunk(); // Check current status, then change ship object property if sunk
        }

        // Logs this cell if it has been attacked
        cell.attacked = result;

        return result;
    }
}

export default GameBoard
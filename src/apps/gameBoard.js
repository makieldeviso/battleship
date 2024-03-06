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

        let result = 'missed';

        if (gameBoard[cellName].occupied) {
            result = 'hit';

            // Add hits to the ship that occupies given coordinate
            const shipOccupant = gameBoard[cellName].occupied.ship;
            shipOccupant.hitPoints += 1;
        }

        return result;
    }
}

export default GameBoard
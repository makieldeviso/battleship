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
}

export default GameBoard
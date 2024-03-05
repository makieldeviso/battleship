class Ship {
    constructor (length) {
        this.length = length;
        this.hitPoints = 0;
        this.sunk = false;
    }

    hit() {
        this.hitPoints += 1;
        this.isSunk();
    }

    isSunk () {
        if (this.length === this.hitPoints) {
            this.sunk = true;
        }
    }

    setPlace (board, coordinates) {
        // Board parameter is the game board where ships will be placed
        // Coordinates parameter is an array of coordinates in an array, e.g. [['A',1],['B',1]]
        // Coordinate array include at [0] index a string from A-J and at [1] index number from 1-10

        const gameBoard = board.board; // Note: actual board is property of the board object

        // Check if ship length corresponds to coordinates argument 
        // Checks if coordinates given is valid/ truthy
        const isInvalidLength = this.length !== coordinates.length;
        const isInvalidCoordinate = coordinates.some(cell => !cell[0] || !cell[1]);

        if (isInvalidLength || isInvalidCoordinate) throw new Error('Invalid placement');

        // Check if coordinates is within the board
        // Note: Ascii for A -> 65, J -> 74
        const isOutOfBounds = coordinates.some(cell => {
            let result = false;

            const isOutOfColumns = cell[0].charCodeAt(0) < 65 || cell[0].charCodeAt(0) > 74;
            const isOutOfRows = cell[1] < 1 || cell[1] > 10;

            if (isOutOfColumns || isOutOfRows) {
                result = true;
            }

            return result
        })

        if (isOutOfBounds) throw new Error('Out of bounds');


        // Check if ship placement overlaps with another ship
        const isOverlaps = coordinates.some(cell => {
            let result = false;
            const cellName = `${cell[0]},${cell[1]}`;
            
            if (gameBoard[cellName].occupied) {
                result = true;
            }

            return result;
        })

        if (isOverlaps) throw new Error('Ships overlap')
        
        // Places the ship in the board execution
        coordinates.forEach(cell => {
            const cellName = `${cell[0]},${cell[1]}`;
            gameBoard[cellName].occupied = true;
        })
    }

}

export default Ship
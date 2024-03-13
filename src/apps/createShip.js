class Ship {
    constructor (length, name) {
        this.name = name;
        this.length = length;
        this.hitPoints = 0;
        this.sunk = false;
        this.board = null;
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

        const coorSet = new Set();
        coordinates.forEach(cell => coorSet.add(`${cell[0]}${cell[1]}`));

        // Check if ship length corresponds to coordinates argument 
        // Checks if coordinates given is valid/ truthy
        const isInvalidLength = this.length !== coorSet.size;
        const isInvalidCoordinate = coordinates.some(cell => !cell[0] || !cell[1]);

        if (isInvalidLength || isInvalidCoordinate) throw new Error('Invalid placement');

        // Check if ship is placed adjacently
        const isNotAdjacent = coordinates.some(cell => {
            const colRef = coordinates[0][0]; // Reference column value;
            const rowRef = coordinates[0][1]; // Reference row value;
            let result = false;

            if ((cell[0] !== colRef) && (cell[1] !== rowRef)) {
                // If neither of the current cell coordinate is equal to the 
                // reference coordinates detect non adjacency
                result = true;
            }
            return result;
        })
        
        if (isNotAdjacent) throw new Error('Ships must be placed adjacently');

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
        const isOverlapping = coordinates.some(cell => {
            let result = false;
            const cellName = `${cell[0]},${cell[1]}`;
            
            if (gameBoard[cellName].occupied) {
                result = true;
            }

            return result;
        })

        if (isOverlapping) throw new Error('Ships overlap');
        
        // Places the ship in the board execution
        coordinates.forEach(cell => {
            const cellName = `${cell[0]},${cell[1]}`;
            gameBoard[cellName].occupied = {status:true, ship:this};
            
        });

        // Logs the ship's placement as a property
        this.placement = coordinates;

        // Ship logs which board it is placed
        this.board = board;

        // Save the ships in the game board as an array in ships property
        board.ships.push(this);
    }

    removePlace (board) {
        console.log(this.board)
        console.log(this.placement)
    }
}

export default Ship
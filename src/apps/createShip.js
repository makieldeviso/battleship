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

        // Check if ship length corresponds to coordinates argument
        if (this.length !== coordinates.length) throw new Error('Invalid placement');

        // Check if coordinates is within the board
        // Note: Ascii for A -> 65, J -> 74
        const isOutOfBounds = coordinates.some(cell => {
            if (!cell[0] || !cell[1] ) return true

            let result = false;

            const isOutOfColumns = cell[0].charCodeAt(0) < 65 || cell[0].charCodeAt(0) > 74;
            const isOutOfRows = cell[1] < 1 || cell[1] > 10;

            if (isOutOfColumns || isOutOfRows) {
                result = true;
            }

            return result
        })

        if (isOutOfBounds) throw new Error('Out of bounds');

        coordinates.forEach(cell => {
            const cellName = `${cell[0]},${cell[1]}`;
            board['board'][cellName].occupied = true;
        })
    }

}

export {Ship}
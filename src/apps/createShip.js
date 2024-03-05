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
        coordinates.forEach(cell => {
            const cellName = `${cell[0]},${cell[1]}`;
            board['board'][cellName].occupied = true;
        })
    }

}

export {Ship}
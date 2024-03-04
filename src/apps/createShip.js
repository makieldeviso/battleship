class Ship {
    constructor (length) {
        this.length = length;
        this.hitPoints = 0;
        this.sank = false;
    }

    hit() {
        this.hitPoints += 1;
    }

    checkSank () {
        if (this.length === this.hitPoints) {
            this.sank = true;
        }
    }

}

export {Ship}
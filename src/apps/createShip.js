class Ship {
    constructor (length) {
        this.length = length;
        this.hits = 0;
        this.sank = false;
    }

    checkSank () {
        if (this.length === this.hits) {
            this.sank = true;
        }
    }

}

export {Ship}
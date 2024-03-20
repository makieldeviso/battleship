class ComputerAttack {
    constructor (newAttack) {
        this.lastAttack = newAttack;
        this.lastHit = null;
    }

    setLastAttack (cellObj) {
        this.lastAttack = cellObj;
    }

    setLastHit (cellObj) {
        this.lastHit = cellObj;
    }
}


const memory = {
    current: null,
    computerAttack: new ComputerAttack(null)
}

export default memory
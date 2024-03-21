class Memory {
  constructor () {
      this.current = null;
      this.computerLastAttack = null;
      this.computerLastHit = null;
  }

  setCurrentGame ( gamePlayObj ) {
    this.current = gamePlayObj;
  }

  getCurrentGame () {
    return this.current
  }

  setComputerLastAttack ( cellObj ) {
    this.computerLastAttack = cellObj;
  }

  setComputerLastHit ( cellObj ) {
    this.computerLastHit = cellObj;
  }

}

const memory = new Memory();

export default memory
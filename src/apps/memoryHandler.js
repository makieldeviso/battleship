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

  setComputerLastAttack (coordinates) {
    const playerBoard = this.current.player.gameBoard.board;
    const cellObj = playerBoard[`${coordinates[0]},${coordinates[1]}`];
    this.computerLastAttack = cellObj;
  }

  setComputerLastHit (coordinates) {
    const playerBoard = this.current.player.gameBoard.board;
    const cellObj = playerBoard[`${coordinates[0]},${coordinates[1]}`];
    this.computerLastHit = cellObj;
  }

}

const memory = new Memory();

export default memory
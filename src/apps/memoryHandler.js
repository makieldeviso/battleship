class Memory {
  constructor () {
      this.current = null;
      this.computerLastAttack = null;
      this.computerLastHit = null;
      this.scores = {
        player: 0,
        computer: 0
      }
  }

  setCurrentGame ( gamePlayObj ) {
    this.current = gamePlayObj;
  }

  getCurrentGame () {
    return this.current
  }

  getPlayerShips () {
    const currentGame = this.getCurrentGame();
    return currentGame.player.gameBoard.ships;
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

  logScores (action) {
    const currentGame = this.getCurrentGame();
    const playerName = currentGame.player.name;
    const computerName = currentGame.computer.name;
    if (action === `${playerName} Wins`) {
      this.scores.player += 1;

    } else if (action === `${computerName} Wins`) {
      this.scores.computer += 1;

    } else if (action === 'reset') {
      this.scores.player = 0;
      this.scores.computer = 0;    
    }
  }

  getScores () {
    return this.scores;
  }
}

const memory = new Memory();

export default memory
import memory from "./memoryHandler";

class Player {
  constructor (name) {
    this.name = name;
    this.gameBoard = null; // GameBoard
  }

  sendAttack (coordinates) {
    const {computer, player} = memory.getCurrentGame();
    // If player name is same as this name, opponent is computer, else player
    const opponent = player.name === this.name ? computer : player;

    const attackResult = opponent.gameBoard.receiveAttack(coordinates);

    return attackResult
  }
}

export default Player;
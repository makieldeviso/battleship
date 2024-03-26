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

    const attackDetails = opponent.gameBoard.receiveAttack(coordinates);
    const {attackResult, attackedCell} = attackDetails;

    // Note: destructure to remove repetitive call. i.e attackDetails.attackResult
    // Attack Details contains attackResult and attackedCell
    return {attackResult, attackedCell}
  }
}

export default Player;
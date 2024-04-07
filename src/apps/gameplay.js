// Scripts
import memory from "./memoryHandler";
import { computerPlaceShips } from "./computerScript";
import GameBoard from "./gameBoard";
import Player from "./players";

class GamePlay {
  constructor() {
    this.playerShipPlaced = false;
    this.phase = 'start';
    this.computer = new Player('Computer');
    this.player = new Player('Player');
    this.maxShips = 5;
  }

  start () {
    // Computer creates board and place ships
    const compBoard = new GameBoard(this.computer.name);
    computerPlaceShips(compBoard);
    this.computer.gameBoard = compBoard;

    // Create board for player
    const playerBoard = new GameBoard(this.player.name);
    // Initially place random ship placement for the player at start
    computerPlaceShips(playerBoard); 
    this.player.gameBoard = playerBoard;
    this.phase = 'playerPlaceShip';

    memory.setCurrentGame(this);
  }

  endPlayerStrategy () {
    this.playerShipPlaced = true;
  }

  setComputerAttackTurn () {
    this.phase = 'computerAttackTurn';
    return 'computer';
  }

  setPlayerAttackTurn () {
    this.phase = 'playerAttackTurn';
    return 'player';
  }

  checkGameOver () {
    const computerShipsSunk = this.computer.gameBoard.getShipsSunk();
    const playerShipsSunk = this.player.gameBoard.getShipsSunk();

    let gameOver = false;
    if ( computerShipsSunk ) {
      gameOver = `${this.player.name} Wins`;

    } else if ( playerShipsSunk ) {
      gameOver = `${this.computer.name} Wins`;
    }

    if ( gameOver ) {
      this.phase = gameOver;
    }

    return gameOver;
  }

}

export default GamePlay



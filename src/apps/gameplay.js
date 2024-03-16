// Scripts
import { computerPlaceShips, generateRandomNumber } from "./computerScript";
import GameBoard from "./gameBoard";
import Player from "./players";
import Ship from "./createShip";

class GamePlay {
  constructor() {
    this.playerShipPlaced = false;
    this.phase = 'start';
    this.computer = new Player('coco');
    this.player = new Player('Player');
    this.maxShips = 5;
  }

  start () {
    // Computer creates board and place ships
    const compBoard = new GameBoard();
    computerPlaceShips(compBoard);
    this.computer.gameBoard = compBoard;

    // Create board for player
    const playerBoard = new GameBoard();
    // Initially place random ship placement for the player at start
    computerPlaceShips(playerBoard); 
    this.player.gameBoard = playerBoard;
    this.phase = 'playerPlaceShip';
  }

  playerPlacedShips () {
    this.phase = 'playerAttackTurn';
  }


}

export default GamePlay



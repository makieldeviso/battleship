import { computerPlaceShips, generateRandomNumber } from "./computerScript";
import GameBoard from "./gameBoard";
import Player from "./players";
import Ship from "./createShip";

class GamePlay {
  constructor() {
    this.playerShipPlaced = false;
    this.phase = 'start';
    this.computer = new Player('Gen. Coco');
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
    // computerPlaceShips(playerBoard);
    this.player.gameBoard = playerBoard;
    this.phase = 'playerPlaceShip';

  }

  playerSelectShipToPlace (length, shipName) {
    const newShip = new Ship(length, shipName);
    return newShip
  }

  playerPlaceShip (shipObj, coordinates) {
    shipObj.setPlace(this.player.gameBoard, coordinates);
    if (this.player.gameBoard.ships.length === this.maxShips) {
      this.phase = 'playerAttackTurn'
    }

  }

}

export default GamePlay



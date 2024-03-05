import { Ship } from "../src/apps/createShip";
import GameBoard from "../src/apps/gameBoard";

test ('Can create ships', () => {
  const newShip = new Ship(4);

  expect(newShip).toEqual({
      length: 4,
      hitPoints: 0,
      sunk: false,
  })
})

test ('Ship gets hits', () => {
  const newShip = new Ship(2);

  newShip.hit(); 
  expect(newShip.hitPoints).toBe(1);

  newShip.hit();
  expect(newShip.hitPoints).toBe(2);
})

test ('Ship has sunk', () => {
  const newShip = new Ship(2);

  newShip.hit();
  newShip.hit();

  expect(newShip.sunk).toBe(true);
})

test ('Can create a 10x10 board', () => {
  const newBoard = new GameBoard();
  const length = Object.keys(newBoard.board).length;

  expect(length).toBe(100);
})

test ('Board has cells with coordinates', () => {
  const newBoard = new GameBoard();

  expect(newBoard.board).toEqual(
    expect.objectContaining({
      'A,1': {column: 'A', row: 1},
      'J,10': {column: 'J', row: 10},
      'B,8': {column: 'B', row: 8},
    })
  )
})

test ('Ships can be placed in the board', () => {
  const newBoard = new GameBoard();
  const newShip = new Ship(5);

  newShip.setPlace(newBoard,[['B', 3],['B', 4], ['B', 5], ['B', 6], ['B', 7]]);

  expect(newBoard.board['B,3'].occupied).toBe(true);
  expect(newBoard.board['B,4'].occupied).toBe(true);
  expect(newBoard.board['B,5'].occupied).toBe(true);
  expect(newBoard.board['B,6'].occupied).toBe(true);
  expect(newBoard.board['B,7'].occupied).toBe(true);
})

test('Ship length corresponds to coordinates', () => {
  const newBoard = new GameBoard();
  const newShip = new Ship(4);

  expect(() => {
    newShip.setPlace(newBoard,[['B', 2],['B', 3], ['B', 4]])
  }).toThrow();

})

test('Ship must be within the board when placed', () => {
  const newBoard = new GameBoard();
  const newShip = new Ship(2);

  expect(() => {
    newShip.setPlace(newBoard,[['B', 10],['B', 11]])
  }).toThrow('Out of bounds');

  expect(() => {
    newShip.setPlace(newBoard,[['J', 1],['K', 1]])
  }).toThrow('Out of bounds');
})

test('Ship placement coordinate must be valid', () => {
  const newBoard = new GameBoard();
  const newShip = new Ship(2);

  expect(() => {
    newShip.setPlace(newBoard,[['B', 10],[]])
  }).toThrow('Invalid placement');
})

test('Ships must not collide in placement', () => {
  const newBoard = new GameBoard();
  const newShip = new Ship(2);
  const newShip2 = new Ship(3);

  newShip.setPlace(newBoard,[['B', 9],['B', 10]]);

  expect(() => {
    newShip2.setPlace(newBoard,[['A', 9],['B', 9], ['C', 9]])
  }).toThrow('Ships overlap');
})
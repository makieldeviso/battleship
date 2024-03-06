import Ship from "../src/apps/createShip";
import GameBoard from "../src/apps/gameBoard";

describe('Structure tests', () => {
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

})

describe ('Ship placement tests', () => {
  test ('Ships can be placed in the board', () => {
    const newBoard = new GameBoard();
    const newShip = new Ship(5);
  
    newShip.setPlace(newBoard,[['B', 3],['B', 4], ['B', 5], ['B', 6], ['B', 7]]);
  
    expect(newBoard.board['B,3'].occupied.status).toBe(true);
    expect(newBoard.board['B,4'].occupied.status).toBe(true);
    expect(newBoard.board['B,5'].occupied.status).toBe(true);
    expect(newBoard.board['B,6'].occupied.status).toBe(true);
    expect(newBoard.board['B,7'].occupied.status).toBe(true);
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
  
    expect(() => {
      newShip2.setPlace(newBoard,[['B', 8],['B', 9], ['B', 10]])
    }).toThrow('Ships overlap');
  
  })
  
  test('Ships must be placed adjacently', () => {
    const newBoard = new GameBoard();
    const newShip = new Ship(3);
  
    // Ship is not placed
    expect(() => {
      newShip.setPlace(newBoard,[['E', 5],['F', 6], ['G', 7]]);
    }).toThrow('Ships must be placed adjacently');
  
    // Ship is placed on the board when ship is adjacently placed
    newShip.setPlace(newBoard,[['E', 5],['E', 6], ['E', 7]]);
    expect(newBoard.board).toEqual(
      expect.objectContaining({
        'E,5': {column: 'E', row: 5, occupied: {status:true, ship:newShip}},
        'E,6': {column: 'E', row: 6, occupied: {status:true, ship:newShip}},
        'E,7': {column: 'E', row: 7, occupied: {status:true, ship:newShip}}
      })
    )
  })
  
  test ('Ship coordinates must be a unique cell according to length', () => {
    const newBoard = new GameBoard();
    const newShip = new Ship(3);
  
    expect(() => {
      newShip.setPlace(newBoard,[['E', 5],['E', 5], ['E', 5]]);
    }).toThrow('Invalid placement');
  
    expect(() => {
      newShip.setPlace(newBoard,[['A', 10],['A', 10], ['A', 10]]);
    }).toThrow('Invalid placement');
  
  })
  
  test ('Logs ship placement on the board in the ship object', () => {
    const newBoard = new GameBoard();
    const newShip = new Ship(5);
    const newShip2 = new Ship(4)
  
    newShip.setPlace(newBoard,[['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]]);
    expect(newShip.placement)
    .toEqual([['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]]);
  
    expect(() => {
      newShip2.setPlace(newBoard,[['B', 3],['B', 4], ['B', 5], ['B', 6]]);
    }).toThrow('Ships overlap');
  
    newShip2.setPlace(newBoard,[['B', 2],['B', 3], ['B', 4], ['B', 5]])
    expect(newShip2.placement)
    .toEqual([['B', 2],['B', 3], ['B', 4], ['B', 5]]);
  
    expect(newBoard.board).toEqual(
      expect.objectContaining({
        'B,6': {column: 'B', row: 6, occupied: {status:true, ship:newShip}},
        'C,6': {column: 'C', row: 6, occupied: {status:true, ship:newShip}},
        'D,6': {column: 'D', row: 6, occupied: {status:true, ship:newShip}},
        'E,6': {column: 'E', row: 6, occupied: {status:true, ship:newShip}},
        'F,6': {column: 'F', row: 6, occupied: {status:true, ship:newShip}},
        'B,2': {column: 'B', row: 2, occupied: {status:true, ship:newShip2}},
        'B,3': {column: 'B', row: 3, occupied: {status:true, ship:newShip2}},
        'B,4': {column: 'B', row: 4, occupied: {status:true, ship:newShip2}},
        'B,5': {column: 'B', row: 5, occupied: {status:true, ship:newShip2}},
      })
    )
  })

})


describe ('Attack tests', () => {
  const newBoard = new GameBoard();
  const carrier = new Ship(5);
  const battleship = new Ship(4);
  const cruiser = new Ship(3);
  const submarine = new Ship(3);
  const patrol = new Ship(2);

  test ('Gameboard receives attack coordinate from opponent', () => {
    carrier.setPlace(newBoard,[['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]]);
    battleship.setPlace(newBoard,[['B', 2],['B', 3], ['B', 4], ['B', 5]]);
    cruiser.setPlace(newBoard,[['D', 2],['E', 2], ['F', 2]]);
    submarine.setPlace(newBoard,[['I', 3],['I', 4], ['I', 5]]);
    patrol.setPlace(newBoard,[['E', 9],['F', 9]]);
  
    expect(newBoard.receiveAttack(['H',7])).toMatch('missed');
  
    expect(newBoard.receiveAttack(['I',5])).toMatch('hit');
    expect(newBoard.receiveAttack(['I',4])).toMatch('hit');
    expect(newBoard.receiveAttack(['I',3])).toMatch('hit');
    expect(submarine.hitPoints).toBe(3);
    expect(submarine.sunk).toBe(true);
  })

})

  
  
  



import Ship from "../src/apps/createShip";
import GameBoard from "../src/apps/gameBoard";
import GamePlay from "../src/apps/gameplay";

describe('Structure tests', () => {
  test ('Can create ships', () => {
    const newShip = new Ship(4);
  
    expect(newShip).toEqual(
      expect.objectContaining(
        {
          length: 4,
          hitPoints: 0,
          sunk: false,
        }
      )
    )
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
        'A,1': expect.objectContaining({column: 'A', row: 1}),
        'J,10': expect.objectContaining({column: 'J', row: 10}),
        'B,8': expect.objectContaining({column: 'B', row: 8}),
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
        'E,5': expect.objectContaining({column: 'E', row: 5, occupied: {status:true, ship:newShip}}),
        'E,6': expect.objectContaining({column: 'E', row: 6, occupied: {status:true, ship:newShip}}),
        'E,7': expect.objectContaining({column: 'E', row: 7, occupied: {status:true, ship:newShip}})
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
        'B,6': expect.objectContaining({column: 'B', row: 6, occupied: {status:true, ship:newShip}}),
        'C,6': expect.objectContaining({column: 'C', row: 6, occupied: {status:true, ship:newShip}}),
        'D,6': expect.objectContaining({column: 'D', row: 6, occupied: {status:true, ship:newShip}}),
        'E,6': expect.objectContaining({column: 'E', row: 6, occupied: {status:true, ship:newShip}}),
        'F,6': expect.objectContaining({column: 'F', row: 6, occupied: {status:true, ship:newShip}}),
        'B,2': expect.objectContaining({column: 'B', row: 2, occupied: {status:true, ship:newShip2}}),
        'B,3': expect.objectContaining({column: 'B', row: 3, occupied: {status:true, ship:newShip2}}),
        'B,4': expect.objectContaining({column: 'B', row: 4, occupied: {status:true, ship:newShip2}}),
        'B,5': expect.objectContaining({column: 'B', row: 5, occupied: {status:true, ship:newShip2}}),
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

  test ('Log cell if it has been attacked', () => {
    expect(newBoard.board['H,7'].attacked).toEqual('missed');
    expect(newBoard.board['I,5'].attacked).toEqual('hit');
    expect(newBoard.board['I,4'].attacked).toEqual('hit');
    expect(newBoard.board['I,3'].attacked).toEqual('hit');

  })

  test ('Game board knows about placed ships', () => {
    expect(newBoard.ships).toEqual([carrier, battleship, cruiser, submarine, patrol]);
  })

  test ('Game board knows if all of its ships has sunk', () => {
    const newBoard = new GameBoard();
    const submarine = new Ship(3);
    const patrol = new Ship(2);

    submarine.setPlace(newBoard, [['C',4], ['D',4],['E',4]]);
    patrol.setPlace(newBoard, [['E',6], ['F',6]]);

    newBoard.receiveAttack(['C',4]),
    newBoard.receiveAttack(['D',4]),
    newBoard.receiveAttack(['E',4]),
    newBoard.receiveAttack(['E',6]),
    newBoard.receiveAttack(['F',6]),

    // Test the ships array directly
    expect(newBoard.ships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({sunk:true}),
        expect.objectContaining({sunk:true}),
        ]
      )
    )

    // Test allShipsSunk property
    expect(newBoard.allShipsSunk).toBe(true);
  })
})

describe('Game algorithms', () => {

  test ('Each cell has property of its adjacent cells', () => {
    const board = new GameBoard().board;
    const e4Adjacent = board['E,4'].adjacent;
    const j10Adjacent = board['J,10'].adjacent;
    
    expect(e4Adjacent).toEqual([board['F,4'], board['D,4'], board['E,5'], board['E,3']]);
    expect(j10Adjacent).toEqual([board['I,10'], board['J,9']]);
  });

  test ('Ships can be named', () => {
    const carrier = new Ship(5, 'Carrier')

    expect(carrier).toEqual(
      expect.objectContaining({
        name: 'Carrier',
        length: 5
      })
    )
  })

  test ('Game can start', () => {
    const newGame = new GamePlay();
    newGame.start();
    expect(newGame.phase).toMatch('playerPlaceShip')
  })

  test ('When player is done placing, game board change status', () => {
    const newGame = new GamePlay();
    newGame.start();

    const bs1 = newGame.playerSelectShipToPlace(5, 'Carrier');
    const bs2 = newGame.playerSelectShipToPlace(4, 'Battleship');
    const bs3 = newGame.playerSelectShipToPlace(3, 'Destroyer');
    const bs4 = newGame.playerSelectShipToPlace(3, 'Submarine');
    const bs5 = newGame.playerSelectShipToPlace(2, 'Patrol Boat');

    newGame.playerPlaceShip(bs1, [['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]]);
    newGame.playerPlaceShip(bs2, [['B', 2],['B', 3], ['B', 4], ['B', 5]]);
    newGame.playerPlaceShip(bs3, [['D', 2],['E', 2], ['F', 2]]);
    newGame.playerPlaceShip(bs4, [['I', 3],['I', 4], ['I', 5]]);
    newGame.playerPlaceShip(bs5, [['E', 9],['F', 9]]);

    expect(newGame.phase).toMatch('playerAttackTurn');

  })

})

// describe('DOM Scripts', () => {
//   const newGame = new GamePlay();
//   newGame.start();

//   const bs1 = newGame.playerSelectShipToPlace(5, 'Carrier');
//   const bs2 = newGame.playerSelectShipToPlace(4, 'Battleship');
//   const bs3 = newGame.playerSelectShipToPlace(3, 'Destroyer');
//   const bs4 = newGame.playerSelectShipToPlace(3, 'Submarine');
//   const bs5 = newGame.playerSelectShipToPlace(2, 'Patrol Boat');

//   newGame.playerPlaceShip(bs1, [['B', 6],['C', 6], ['D', 6], ['E', 6], ['F', 6]]);
//   newGame.playerPlaceShip(bs2, [['B', 2],['B', 3], ['B', 4], ['B', 5]]);
//   newGame.playerPlaceShip(bs3, [['D', 2],['E', 2], ['F', 2]]);
//   newGame.playerPlaceShip(bs4, [['I', 3],['I', 4], ['I', 5]]);
//   newGame.playerPlaceShip(bs5, [['E', 9],['F', 9]]);

//   test ('Starting the game creates a game board in the DOM', () => {
//     expect(document.querySelectorAll('div.cell').length).toBe(100)
//   })

// })


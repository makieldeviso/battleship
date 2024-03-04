import { Ship } from "../src/apps/createShip";

test ('Can create ships', () => {
  const newShip = new Ship(4);

  expect(newShip).toEqual({
      length: 4,
      hitPoints: 0,
      sank: false,
  })
})

test ('Ship gets hits', () => {
  const newShip = new Ship(2);

  newShip.hit(); 
  expect(newShip.hitPoints).toBe(1);

  newShip.hit();
  expect(newShip.hitPoints).toBe(2);
})

import { Ship } from "../src/apps/createShip";

test ('Can create ships', () => {
    const newShip = new Ship(4);

    expect(newShip).toEqual({
        length: 4,
        hits: 0,
        sank: false,
    })
})
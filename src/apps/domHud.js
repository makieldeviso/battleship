import { removeShipEvents } from "./domShips";
import { playerAttackComputerPhase } from "./gameUI";
import memory from "./memoryHandler";

const startAttack = function () {
    removeShipEvents();
    memory.current.endStrategyPhase();
    playerAttackComputerPhase();
}

const addEventHUDButtons = function () {
    const startBtn = document.querySelector('button#start-btn');
    startBtn.addEventListener('click', startAttack);
}

export {addEventHUDButtons}
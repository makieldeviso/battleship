import style from "./styles/style.css"

import GamePlay from "./apps/gameplay";

import { gameStart } from "./apps/gameUI";


gameStart();


document.querySelector('dialog#gameover-dialog').showModal();
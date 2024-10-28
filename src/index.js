import style from "./styles/style.css"

import gameStart from "./apps/gameUI";

const footerYear = document.querySelector('#footer-year');
footerYear.textContent = (new Date()).getFullYear();

gameStart();

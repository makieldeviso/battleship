import { showHelpScreen, returnToMainDisplay, randomizeShipPlacement, showSurrenderScreen, startAttackPhase } from "./domMenu";

const addHudBtnEvents = function () {
	// Add eventListeners to HUD buttons
	const startBtn = document.querySelector('button#start-btn');
	const helpBtn = document.querySelector('button#help');
	const closeBtn = document.querySelector('button#close-btn');
	const randomBtn = document.querySelector('button#random');
	const surrenderBtn = document.querySelector('button#surrender');
	
	startBtn.addEventListener('click', startAttackPhase);
	helpBtn.addEventListener('click', showHelpScreen);
	closeBtn.addEventListener('click', returnToMainDisplay);
	randomBtn.addEventListener('click', randomizeShipPlacement);
	surrenderBtn.addEventListener('click', showSurrenderScreen);
}

 export default addHudBtnEvents
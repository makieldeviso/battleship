const slideShowHud = async function () {
  const hudMenu = document.querySelector('div#hud');
  const isHudShown = hudMenu.getAttribute('class').includes('shown');
  const menuBtn = document.querySelector('button#menu-btn');

  if (isHudShown) {
    // Slide/ hide the HUD
    menuBtn.classList.add('pressed');
    hudMenu.classList.add('slide');
  
    await new Promise ((resolve) => {
      setTimeout(() => {
        hudMenu.classList.remove('shown');
        hudMenu.classList.add('hidden');
        resolve(true);
      }, 400);
    });

  } else {
    // show the HUD
    menuBtn.classList.remove('pressed')
    hudMenu.classList.remove('hidden');
    hudMenu.classList.add('shown');
    
    await new Promise ((resolve) => {
      setTimeout(() => {
        hudMenu.classList.remove('slide');
        resolve(true);
      }, 0);
    });
  }
}

const addMenuEvents = function () {
  const menuBtn = document.querySelector('button#menu-btn');
  const menuBackBtn = document.querySelector('button#back-hud');
  menuBtn.disabled = false;
  menuBackBtn.disabled = false;
  menuBtn.addEventListener('click', slideShowHud);
  menuBackBtn.addEventListener('click', slideShowHud);
}



const closeHelp = function () {
  const helpCont = document.querySelector('div#help-container');
  const helpMessageCont = document.querySelector('div#help-message');
  helpMessageCont.classList.add('closed');

  helpCont.classList.add('closed');

  this.removeEventListener('click', closeHelp);
}

const showHelp = function () {
  const helpCont = document.querySelector('div#help-container');
  const helpMessageCont = document.querySelector('div#help-message');
  helpMessageCont.classList.remove('closed');

  helpCont.classList.remove('closed');

  const closeHelpBtn = document.querySelector('button#close-help');
  closeHelpBtn.addEventListener('click', closeHelp, {once:true});
}

export {showHelp, slideShowHud, addMenuEvents}
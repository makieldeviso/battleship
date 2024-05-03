(()=>{"use strict";const e=new class{constructor(){this.current=null,this.computerLastAttack=null,this.computerLastHit=null,this.scores={player:0,computer:0}}setCurrentGame(e){this.current=e}getCurrentGame(){return this.current}getPlayerShips(){return this.getCurrentGame().player.gameBoard.ships}setComputerLastAttack(e){const t=this.current.player.gameBoard.board[`${e[0]},${e[1]}`];this.computerLastAttack=t}setComputerLastHit(e){const t=this.current.player.gameBoard.board[`${e[0]},${e[1]}`];this.computerLastHit=t}logScores(e){const t=this.getCurrentGame(),r=t.player.name,o=t.computer.name;e===`${r} Wins`?this.scores.player+=1:e===`${o} Wins`?this.scores.computer+=1:"reset"===e&&(this.scores.player=0,this.scores.computer=0)}getScores(){return this.scores}};const t=class{constructor(e,t){this.name=t,this.length=e,this.hitPoints=0,this.sunk=!1,this.owner=null}hit(){this.hitPoints+=1,this.isSunk()}isSunk(){return this.length===this.hitPoints&&(this.sunk=!0),this.sunk}setPlace(e,t){const r=e.board,o=new Set;t.forEach((e=>o.add(`${e[0]}${e[1]}`)));const n=this.length!==o.size,s=t.some((e=>!e[0]||!e[1]));if(n||s)throw new Error("Invalid placement");if(t.some((e=>{const r=t[0][0],o=t[0][1];let n=!1;return e[0]!==r&&e[1]!==o&&(n=!0),n})))throw new Error("Ships must be placed adjacently");if(t.some((e=>{let t=!1;const r=e[0].charCodeAt(0)<65||e[0].charCodeAt(0)>74,o=e[1]<1||e[1]>10;return(r||o)&&(t=!0),t})))throw new Error("Out of bounds");if(t.some((e=>{let t=!1;const o=`${e[0]},${e[1]}`;return r[o].occupied&&(t=!0),t})))throw new Error("Ships overlap");t.forEach((e=>{const t=`${e[0]},${e[1]}`;r[t].occupied={status:!0,ship:this}})),this.placement=t,this.owner=e.owner,e.ships.push(this)}removePlace(){const t=e.getCurrentGame(),r=t.player.name===this.owner?t.player.gameBoard:t.computer.gameBoard;this.placement.forEach((e=>{const t=`${e[0]},${e[1]}`;r.board[t].occupied=null})),this.placement=[];const o=r.ships.findIndex((e=>e.name===this.name));return r.ships.splice(o,1),r}movePlace(e){const t=this.removePlace();this.setPlace(t,e)}},r=function(e,t){const r=Math.ceil(e),o=Math.floor(t);return Math.floor(Math.random()*(o-r+1)+r)},o=function(e,t){const n=e.board,s=r(65,74),c=r(1,10),i=[],a=[],l=[],d=[];for(let e=0;e<t;e++){const t=c+e,r=s+e,o=c-e,u=s-e;t>=1&&t<=10&&!n[`${String.fromCharCode(s)},${t}`].occupied&&i.push([`${String.fromCharCode(s)}`,t]),r>=65&&r<=74&&!n[`${String.fromCharCode(r)},${c}`].occupied&&a.push([`${String.fromCharCode(r)}`,c]),o>=1&&o<=10&&!n[`${String.fromCharCode(s)},${o}`].occupied&&l.push([`${String.fromCharCode(s)}`,o]),u>=65&&o<=74&&!n[`${String.fromCharCode(u)},${c}`].occupied&&d.push([`${String.fromCharCode(u)}`,c])}const u=[i,a,l,d].filter((e=>e.length===t));if(0===u.length)return o(e,t);return u[r(0,u.length-1)]},n=function(e){[new t(5,"Carrier"),new t(4,"Battleship"),new t(3,"Destroyer"),new t(3,"Submarine"),new t(2,"Patrol Boat")].forEach((t=>{t.setPlace(e,o(e,t.length))}))},s=function(t){const o=e.getCurrentGame(),{computer:n,player:s}=o,c="player"===t?s.gameBoard:n.gameBoard,i=Object.keys(c.board).map((e=>c.board[e])).filter((e=>!e.attacked)),a=i[r(0,i.length-1)];return[`${a.column}`,a.row]};const c=class{constructor(e){this.owner=e,this.board=(()=>{const e={};let t=65,r=1;for(;t<=74;){const o=String.fromCharCode(t);e[`${o},${r}`]={column:o,row:r},10===r&&t<=74&&(t+=1),r<10&&t<=74?r+=1:r>=10&&t<=74&&(r=1)}return Object.keys(e).forEach((t=>{const r=e[t].column,o=e[t].row,n=[],s=[r.charCodeAt(0)+1,r.charCodeAt(0)-1],c=[o+1,o-1];s.forEach((t=>{if(t>=65&&t<=74){const r=`${String.fromCharCode(t)},${o}`;n.push(e[r])}})),c.forEach((t=>{if(t>=1&&t<=10){const o=`${r},${t}`;n.push(e[o])}})),e[t].adjacent=n})),e})(),this.ships=[],this.allShipsSunk=!1}receiveAttack(e){const t=this.board[`${e[0]},${e[1]}`];let r="missed";if(t.occupied){r="hit";const e=t.occupied.ship;e.hitPoints+=1,e.isSunk()}return t.attacked=r,this.checkShipsSunk(),{attackResult:r,attackedCell:t}}checkShipsSunk(){const e=this.ships.some((e=>!e.sunk));this.allShipsSunk=!e}getShipsSunk(){return this.allShipsSunk}};const i=class{constructor(e){this.name=e,this.gameBoard=null}sendAttack(t){const{computer:r,player:o}=e.getCurrentGame(),n=(o.name===this.name?r:o).gameBoard.receiveAttack(t),{attackResult:s,attackedCell:c}=n;return{attackResult:s,attackedCell:c}}};const a=class{constructor(){this.playerShipPlaced=!1,this.phase="start",this.computer=new i("Computer"),this.player=new i("Player"),this.maxShips=5}start(){const t=new c(this.computer.name);n(t),this.computer.gameBoard=t;const r=new c(this.player.name);n(r),this.player.gameBoard=r,this.phase="playerPlaceShip",e.setCurrentGame(this)}endPlayerStrategy(){this.playerShipPlaced=!0}setComputerAttackTurn(){return this.phase="computerAttackTurn","computer"}setPlayerAttackTurn(){return this.phase="playerAttackTurn","player"}checkGameOver(){const t=this.computer.gameBoard.getShipsSunk(),r=this.player.gameBoard.getShipsSunk();let o=!1;return t?o=`${this.player.name} Wins`:r&&(o=`${this.computer.name} Wins`),o&&(this.phase=o),e.logScores(o),o}},l=function(e,t){const r=e.gameBoard.board;!function(e){const t=function(e){const t=document.createElement("div");t.setAttribute("class",`${e}-marker`);for(let r=0;r<10;r++){const o=document.createElement("div"),n=document.createElement("p");"column"===e?n.textContent=String.fromCharCode(65+r):"row"===e&&(n.textContent=10-r),o.appendChild(n),t.appendChild(o)}return t};e.appendChild(t("column")),e.appendChild(t("row"))}(t);const o=[];let n=65,s=10;for(;s>=1;){const e=String.fromCharCode(n);o.push(`${e},${s}`),n<=74&&s>=1&&(n+=1),n>74&&s>=1&&(n=65,s-=1)}o.forEach((e=>{const o=document.createElement("div");o.setAttribute("class","cell"),o.dataset.column=r[e].column,o.dataset.row=r[e].row,t.querySelector("div.main-grid").appendChild(o)}))},d=function(e){return e.name.split(" ").map((e=>e[0].toLowerCase()+e.slice(1))).join("-")},u=function(e){const t=document.createElement("div"),r=d(e);t.classList.add(`${r}`),t.setAttribute("title",e.name);for(let r=0;r<e.length;r++){const e=document.createElement("div");e.classList.add("ship-cell"),t.appendChild(e)}return t},m=function(e,t){const r=u(e);r.classList.add("tally-ship"),r.setAttribute("id",`${t}-${d(e)}-tally`);document.querySelector(`div#${t}-tally`).appendChild(r)};let h;class p{constructor(e,t){this.shipUnit=e,this.shipObj=this.findShipObj(),this.initShipPlacement=this.shipObj.placement,this.firstClickPos=this.findFirstClickPos(t),this.initShipPos=this.findInitShipPos(),this.hoveredCells=[]}findShipObj(){return e.getCurrentGame().player.gameBoard.ships.find((e=>e.name===this.shipUnit.title))}findFirstClickPos(e){return{x:this.shipUnit.offsetLeft-e.clientX,y:this.shipUnit.offsetTop-e.clientY}}findInitShipPos(){return{x:this.shipUnit.offsetLeft,y:this.shipUnit.offsetTop}}getCurrentDomPlacement(){return this.initShipPlacement.map((e=>document.querySelector(`div.cell[data-column='${e[0]}'][data-row='${e[1]}']`)))}getFirstClickPos(){return{x:this.firstClickPos.x,y:this.firstClickPos.y}}getShipOrientation(){const e=this.shipUnit.clientWidth;return this.shipUnit.clientHeight>e?"vertical":"horizontal"}setHoveredCells(e){this.hoveredCells=e}}const f=function(e){if(0===e.button&&1===e.detail){h=new p(this,e);const{shipUnit:t}=h;e.preventDefault(),this.classList.add("selected"),h.getCurrentDomPlacement().forEach((e=>e.classList.remove("occupied"))),t.removeEventListener("mousedown",f),t.addEventListener("mousemove",v),t.addEventListener("mouseup",g)}},y=function(){const{shipUnit:e,shipObj:t}=h,r=e.getBoundingClientRect(),o=h.getShipOrientation(),n=document.querySelector("div#player-grid div.main-grid");let s,c;"vertical"===o?(s=document.elementsFromPoint(r.x+r.width/2,r.y+r.width/2).find((e=>e.parentNode===n&&e.classList.contains("cell"))),c=document.elementsFromPoint(r.x+r.width/2,r.y+r.height-r.width/2).find((e=>e.parentNode===n&&e.classList.contains("cell")))):(s=document.elementsFromPoint(r.x+r.height/2,r.y+r.height/2).find((e=>e.parentNode===n&&e.classList.contains("cell"))),c=document.elementsFromPoint(r.x+r.width-r.height/2,r.y+r.height/2).find((e=>e.parentNode===n&&e.classList.contains("cell"))));const i=[s,c],a=!!s&&s.classList.contains("occupied"),l=!!c&&c.classList.contains("occupied");a&&i.splice(0,1,null),l&&i.splice(1,1,null);for(let e=1;i.length<t.length;e++){let t,r,n;s?("vertical"===o?(t=String.fromCharCode(s.dataset.column.charCodeAt(0)),r=Number(s.dataset.row)-e):(t=String.fromCharCode(s.dataset.column.charCodeAt(0)+e),r=Number(s.dataset.row)),n=document.querySelector(`div.cell[data-column='${t}'][data-row='${r}']`),n&&(n=n.classList.contains("occupied")?null:n),i.splice(i.length-1,0,n)):c?("vertical"===o?(t=String.fromCharCode(c.dataset.column.charCodeAt(0)),r=Number(c.dataset.row)+e):(t=String.fromCharCode(c.dataset.column.charCodeAt(0)-e),r=Number(c.dataset.row)),n=document.querySelector(`div.cell[data-column='${t}'][data-row='${r}']`),n&&(n=n.classList.contains("occupied")?null:n),i.splice(1,0,n)):i.splice(i.length-1,0,null)}return i},v=function(e){const{shipUnit:t}=h;t.style.left=`${e.clientX+h.getFirstClickPos(e).x}px`,t.style.top=`${e.clientY+h.getFirstClickPos(e).y}px`,h.getCurrentDomPlacement().forEach((e=>e.classList.remove("occupied")));const r=y();h.hoveredCells.forEach((e=>{e&&(e.classList.remove("hover"),e.classList.remove("invalid"))})),r.includes(null)||r.includes(void 0)?r.forEach((e=>{e&&e.classList.add("hover"),e&&e.classList.add("invalid")})):r.forEach((e=>{e&&e.classList.add("hover")})),h.setHoveredCells(r),t.removeEventListener("dblclick",S);const o=document.querySelector("div#player-grid div.main-grid"),{top:n,right:s,bottom:c,left:i}=o.getBoundingClientRect();if(e.clientX<i-40||e.clientX>s+40||e.clientY>c+40||e.clientY<n-40){const e=new MouseEvent("mouseup",{view:window,bubbles:!0,cancelable:!0});t.dispatchEvent(e)}},g=function(e){e.preventDefault();const t="mouseup"===e.type,r="dblclick"===e.type;let o=!1;const{shipUnit:n,shipObj:s}=h;let c=h.initShipPlacement;const i=!h.hoveredCells.includes(null)&&!h.hoveredCells.includes(void 0)&&0!==h.hoveredCells.length;return i&&0===e.button&&t||i&&r?(c=h.hoveredCells.map((e=>[e.dataset.column,Number(e.dataset.row)])),n.style.left=`${h.hoveredCells[0].offsetLeft}px`,n.style.top=`${h.hoveredCells[0].offsetTop}px`,o=!0):(!i&&t||!i&&r||2===e.button)&&(n.style.left=`${h.initShipPos.x}px`,n.style.top=`${h.initShipPos.y}px`,h.hoveredCells.forEach((e=>{e&&(e.classList.remove("hover"),e.classList.remove("invalid"))})),o=!1),c.forEach((e=>{const t=document.querySelector(`div.cell[data-column='${e[0]}'][data-row='${e[1]}']`);t.classList.remove("hover"),t.classList.add("occupied")})),n.classList.remove("selected"),s.movePlace(c),n.removeEventListener("mousemove",v),n.removeEventListener("mouseup",g),n.addEventListener("mousedown",f),n.addEventListener("dblclick",S),o},S=function(e){const{shipUnit:t,shipObj:r}=h,o=t.dataset.dir,n=t.style.gridTemplateColumns,s=t.style.gridTemplateRows;h.getCurrentDomPlacement().forEach((e=>{e.classList.remove("occupied")})),"up"===o||"down"===o?(t.dataset.dir="up"===o?"right":"left",t.style.gridTemplateColumns=`repeat(${r.length}, 1fr)`,t.style.gridTemplateRows="1fr",r.length>2&&r.length<5?(t.style.left=t.offsetLeft-t.clientWidth/2+"px",t.style.top=`${t.offsetTop+t.clientHeight}px`):5===r.length&&(t.style.left=t.offsetLeft-t.clientWidth/2+"px",t.style.top=`${t.offsetTop+2*t.clientHeight}px`)):"right"!==o&&"left"!==o||(t.dataset.dir="left"===o?"up":"down",t.style.gridTemplateColumns="1fr",t.style.gridTemplateRows=`repeat(${r.length}, 1fr)`,r.length>2&&r.length<4?(t.style.left=`${t.offsetLeft+t.clientWidth}px`,t.style.top=t.offsetTop-t.clientHeight/2+"px"):4===r.length?(t.style.left=`${t.offsetLeft+1.5*t.clientWidth}px`,t.style.top=t.offsetTop-t.clientHeight/3+"px"):5===r.length&&(t.style.left=`${t.offsetLeft+2*t.clientWidth}px`,t.style.top=t.offsetTop-t.clientHeight/2+"px"));const c=y();h.setHoveredCells(c);g(e)||(t.dataset.dir=o,t.style.gridTemplateColumns=n,t.style.gridTemplateRows=s)},C=function(t,r){const o=u(t);o.setAttribute("id",`${r}-${d(t)}-unit`),o.classList.add("ship-unit");document.querySelector(`div#${r}-grid.play-grid`).appendChild(o);const n=t.placement,s=n[0],c=n[n.length-1];let i;s[0]===c[0]?(o.style.gridTemplateColumns="1fr",o.style.gridTemplateRows=`repeat(${n.length}, 1fr)`,s[1]>c[1]?(i=s,o.dataset.dir="up"):(i=c,o.dataset.dir="down")):(o.style.gridTemplateColumns=`repeat(${n.length}, 1fr)`,o.style.gridTemplateRows="1fr",s[0].charCodeAt(0)<c[0].charCodeAt(0)?(i=s,o.dataset.dir="right"):(i=c,o.dataset.dir="left"));const a=`div#${r}-grid div.main-grid ${`div.cell[data-column='${i[0]}'][data-row='${i[1]}']`}`,l=document.querySelector(a);o.style.top=`${l.offsetTop}px`,o.style.left=`${l.offsetLeft}px`,"player"===r&&(!function(){const t=document.querySelector("div#player-grid div.main-grid");e.getPlayerShips().forEach((e=>{var r,o;r=e.placement,o=t,r.forEach((e=>{const t=`[data-column='${e[0]}']`,r=`[data-row='${e[1]}']`;o.querySelector(`div${t}${r}`).classList.add("occupied")}))}))}(),o.addEventListener("mousedown",f),o.addEventListener("dblclick",S),o.addEventListener("contextmenu",(e=>e.preventDefault())))},k=function(t){const r=document.querySelector("dialog#gameover-dialog"),o=document.querySelector("div#gameover-screen"),n=o.querySelector("h3"),s=o.querySelector("p#result-msg"),c=e.getCurrentGame(),i=c.player.name,a=c.computer.name;let l,d;t===`${i} Wins`?(l="Victory",d="Congratulations Sir! We have destroyed the enemy fleet.",r.classList.remove("defeat")):t===`${a} Wins`?(l="Defeat",d="...",r.classList.add("defeat")):"surrender"===t&&(l="Surrendered",d="Your remaining ships were captured by enemies",r.classList.add("defeat")),n.textContent=l,s.textContent=d,r.showModal()},L=function(){const t=document.querySelector("h2#player-score"),r=document.querySelector("h2#computer-score"),o=e.getScores();t.textContent=o.player,r.textContent=o.computer};let $;class w{constructor(e,t){this.playerTurnScript=e,this.computerTurnScript=t,this.isGameOver=!1}switch(){const t=e.getCurrentGame(),r=t.checkGameOver(),o=t.phase,n="playerAttackTurn"===o,s="computerAttackTurn"===o;r?(this.isGameOver=r,L(),k(r)):n?(t.setComputerAttackTurn(),this.computerTurnScript()):s&&(t.setPlayerAttackTurn(),this.playerTurnScript())}}const b=async function(t,r,o){const n=t,s=n.parentNode.parentNode;if("hit"===r){!function(t){if(t.sunk){const r=e.getCurrentGame().player.name===t.owner?"player-tally":"computer-tally";document.querySelector(`div#${r}`).querySelector(`div[title='${t.name}']`).classList.add("sunk")}}(o.occupied.ship)}await async function(e,t,r){const o=new Image;o.src=`../assets/${r}.gif`,o.setAttribute("id","explosion"),o.style.left=e.offsetLeft-e.clientWidth/2+"px",o.style.top=e.offsetTop-e.clientHeight/2+"px",t.appendChild(o);const n=await new Promise((e=>{setTimeout((()=>{e(o)}),500)}));n.src="",t.removeChild(n)}(n,s,r),n.dataset.attacked=r;return s.querySelectorAll("div.cell").forEach((e=>e.removeEventListener("click",b))),r},E=function(){const t=[this.dataset.column,Number(this.dataset.row)],{player:r}=e.getCurrentGame(),o=r.sendAttack(t),{attackResult:n,attackedCell:s}=o;b(this,n,s),this.removeEventListener("click",E),this.classList.remove("open");document.querySelectorAll("div#computer-grid div.cell").forEach((e=>{e.dataset.attacked||(e.removeEventListener("click",E),e.classList.remove("open"))})),$.switch()},q=function(e){const t="player"===e?"computer":"player",r=document.querySelector(`div#${e}-detail`),o=document.querySelector(`div#${t}-detail`),n=document.querySelector(`div#${e}-grid div.main-grid`);[r,document.querySelector(`div#${t}-grid div.main-grid`)].forEach((e=>e.classList.add("current-turn"))),[o,n].forEach((e=>e.classList.remove("current-turn")))},P=function(){document.querySelectorAll("div#computer-grid div.cell").forEach((e=>{e.dataset.attacked||(e.addEventListener("click",E),e.classList.add("open"))})),q("player")},A=async function(){q("computer");const t=function(){const t=e.getCurrentGame(),{computer:r}=t,o=s("player"),n=r.sendAttack(o),{attackResult:c,attackedCell:i}=n;return{attackCoordinates:o,attackResult:c,attackedCell:i}}(),{attackCoordinates:r,attackResult:o,attackedCell:n}=t,c=document.querySelector("div#player-grid div.main-grid").querySelector(`div.cell[data-column = '${r[0]}'][data-row = '${r[1]}']`);await new Promise((e=>{setTimeout((()=>e(b(c,o,n))),500)})),e.setComputerLastAttack(r),"hit"===o&&e.setComputerLastHit(r),$.switch()},T=function(){const t=e.getCurrentGame();t.endPlayerStrategy(),$=new w(P,A);"player"===(0===r(0,1)?t.setPlayerAttackTurn():t.setComputerAttackTurn())?$.playerTurnScript():$.computerTurnScript()},x=function(){const e=document.querySelector("div.content:not(.closed)");e&&e.classList.add("closed"),W(),U()},G=function(){x();const t=e.getCurrentGame().phase;let r;"playerPlaceShip"===t?r=document.querySelector("div#help-message-1"):"playerAttackTurn"!==t&&"computerAttackTurn"!==t||(r=document.querySelector("div#help-message-2")),r.classList.remove("closed")},B=function(){x();document.querySelector("div#strat-screen").classList.remove("closed")},O=function(){const t=e.getCurrentGame(),r="playerPlaceShip"!==t.phase,o=this.value;"yes"===o&&r?(X(),k("surrender"),e.logScores(`${t.computer.name} Wins`),L()):"no"===o&&H()},W=function(){[document.querySelector("button#yes"),document.querySelector("button#no")].forEach((e=>{e.removeEventListener("click",O),e.disabled=!0}))},R=async function(){const t=document.querySelector("div#surrender");if(!t.getAttribute("class").includes("closed"))return;x();const o=e.getCurrentGame().phase,n=t.querySelector("p.message");let s;if("playerPlaceShip"===o){const e=["No battles are won without charging!","Were just chilling here General.","Don't be afraid, fight!"];s=e[r(0,e.length-1)]}else o.includes("AttackTurn")&&(s="Are you sure you want to surrender?",[document.querySelector("button#yes"),document.querySelector("button#no")].forEach((e=>{e.addEventListener("click",O),e.disabled=!1})));n.textContent=s,t.classList.remove("closed"),"playerPlaceShip"===o&&await new Promise((e=>{setTimeout((()=>{t.getAttribute("class").includes("closed")||e(H())}),1300)}))},H=function(){x();const t=e.getCurrentGame().phase;W(),"playerPlaceShip"===t?B():"playerAttackTurn"!==t&&"computerAttackTurn"!==t||F()},N=function(){H();let t=e.getPlayerShips();for(;t.length>0;)t[0].removePlace(),t=e.getPlayerShips();const r=e.getCurrentGame().player.gameBoard;n(r),t=e.getPlayerShips(),function(){const e=document.querySelector("div#player-grid"),t=document.querySelectorAll("div.ship-unit"),r=e.querySelectorAll("div.cell.occupied");t.forEach((t=>e.removeChild(t))),r.forEach((e=>e.classList.remove("occupied")))}(),t.forEach((e=>{C(e,"player")}))},j=async function(){const e=this.value,{attackX:t}=this.dataset,r=Number(this.dataset.attackY);if([document.querySelector("button#yes"),document.querySelector("button#no")].forEach((e=>{e.removeAttribute("data-attack-x"),e.removeAttribute("data-attack-y")})),"yes"===e){const e=document.querySelector("div#computer-grid div.main-grid").querySelector(`div.cell[data-column='${t}'][data-row='${r}']`);await X(),e.click()}else H()},U=function(){[document.querySelector("button#yes"),document.querySelector("button#no")].forEach((e=>{e.removeEventListener("click",j),e.disabled=!0,e.dataset.attackX&&(e.removeAttribute("data-attack-x"),e.removeAttribute("data-attack-y"))}))},D=function(){x();const e=s("computer"),t=document.querySelector("div#random-attack");t.querySelector("p#random-attack-coordinate").textContent=`[ ${e[0]}, ${e[1]} ]`,t.classList.remove("closed");[document.querySelector("button#yes"),document.querySelector("button#no")].forEach((t=>{t.addEventListener("click",j,{once:!0}),t.dataset.attackX=`${e[0]}`,t.dataset.attackY=`${e[1]}`,t.disabled=!1}))},F=function(){x();document.querySelector("div#attack-screen").classList.remove("closed")},X=async function(){const e=document.querySelector("div#hud"),t=e.getAttribute("class").includes("shown"),r=document.querySelector("button#menu-btn");H(),t?(r.classList.add("pressed"),e.classList.add("slide"),await new Promise((t=>{setTimeout((()=>{e.classList.remove("shown"),e.classList.add("hidden"),t(!0)}),400)}))):(e.classList.add("shown"),r.classList.remove("pressed"),e.classList.remove("hidden"),await new Promise((t=>{setTimeout((()=>{e.classList.remove("slide"),t(!0)}),0)})))},Y=function(){T(),document.querySelectorAll("div#player-grid div.ship-unit").forEach((e=>{e.removeEventListener("mousedown",f),e.removeEventListener("mousemove",v),e.removeEventListener("mouseup",g),e.removeEventListener("dblclick",S)})),document.querySelector("button#random").removeEventListener("click",N),document.querySelector("button#random").addEventListener("click",D),X(),function(){const e=document.querySelector("button#menu-btn");e.disabled=!1,e.addEventListener("click",X)}(),F(),this.removeEventListener("click",Y),this.addEventListener("click",X)},M=function(){const e=document.querySelector("button#start-btn"),t=document.querySelector("button#help"),r=document.querySelector("button#close-btn"),o=document.querySelector("button#random"),n=document.querySelector("button#surrender");e.addEventListener("click",Y),t.addEventListener("click",G),r.addEventListener("click",H),o.addEventListener("click",N),n.addEventListener("click",R)},I=document.querySelector("div#player-grid"),z=document.querySelector("div#computer-grid"),V=function(){const e=function(e){const t=document.querySelector(`div#${e}-tally`);t.querySelectorAll("div.tally-ship").forEach((e=>t.removeChild(e)));const r=document.querySelector(`div#${e}-grid`),o=r.querySelector("div.main-grid");o.querySelectorAll("div.cell").forEach((e=>o.removeChild(e)));if([document.querySelector(`div#${e}-detail`),document.querySelector(`div#${e}-grid div.main-grid`)].forEach((e=>e.classList.remove("current-turn"))),"player"===e){r.querySelectorAll("div.ship-unit").forEach((e=>r.removeChild(e)))}};return e("player"),e("computer"),function(){const e=document.querySelector("button#menu-btn");e.disabled=!0,e.removeEventListener("click",X)}(),!0},J=function(){const e=new a;e.start(),l(e.computer,z),l(e.player,I);e.computer.gameBoard.ships.forEach((e=>m(e,"computer")));const t=e.player.gameBoard.ships;t.forEach((e=>m(e,"player"))),t.forEach((e=>C(e,"player"))),X(),B(),M();[document.querySelector("button#gameover-yes"),document.querySelector("button#gameover-no")].forEach((e=>e.addEventListener("click",(function(){const e=this.value;"yes"===e?(V(),J(),document.querySelector("dialog#gameover-dialog").close()):"no"===e&&location.reload()}),{once:!0})))};J()})();
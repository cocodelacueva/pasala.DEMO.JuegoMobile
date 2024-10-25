import './assets/css/style.scss';
import startGame from './assets/js/game';

(function init() {
  const siteWrapper = document.querySelector('#pasala-wrapper');

  if (siteWrapper) {
    const gameContainer = document.querySelector('#canva-game-wrapper');
    const listContainer = document.querySelector('#instrucciones-box');
    //do
    startGame(gameContainer, listContainer);


  } else {
    //reload
    setTimeout(init, 1000);
  }
})();

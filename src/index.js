import './assets/css/style.scss';
import startGame from './assets/js/game';

(function init() {
  const siteWrapper = document.querySelector('#pasala-wrapper');

  if (siteWrapper) {
    const gameContainer = document.querySelector('#canva-game-wrapper');
    //do
    startGame(gameContainer);


  } else {
    //reload
    setTimeout(init, 1000);
  }
})();

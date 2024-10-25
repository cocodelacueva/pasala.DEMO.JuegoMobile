import './assets/css/style.scss';

(function init() {
  const siteWrapper = document.querySelector('#site-wrapper');

  if (siteWrapper) {

    //do
    console.log('This site is loaded');


  } else {
    //reload
    setTimeout(init, 1000);
  }
})();

import './assets/css/style.scss';
//import { smoothScroll } from './assets/js/helpers';
// import {CarouselInit} from './assets/js/carousel.js'
//import legalesModal from './assets/js/legales-modal';
//import animationsCSS from './assets/js/animations-css';

(function init() {
  const siteWrapper = document.querySelector('#site-wrapper');

  if (siteWrapper) {

    //do
    console.log('This site is loaded');

    //legales modal
    //legalesModal(siteWrapper);

    //animations on view:
    
    // const wrapperProductos = siteWrapper.querySelector('#productos');
    // CarouselInit()
    // let primerSlider = new Carousel(wrapperProductos)
    // primerSlider.initialization()

  } else {
    //reload
    setTimeout(init, 1000);
  }
})();

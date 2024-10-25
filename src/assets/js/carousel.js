/*
 * CAROUSEL BÁSICO
 * Instrucciones:
  
 * El html debe tener un id especifico por cada instancia, debe tener data-active="1" para que este activo
 * Es necesaria esta estructura para q el script interprete correctamente:
 * <section class="carousel" id="productos" data-active="1">
            <div class="container_loader">
                <div class="loader"></div>
            </div>
            <div class="productos_wrapper">
                <ul class="productos">
                    <li class="item-slider product"> ...

 * En el index.js la función inicial a llamar es CarouselInit() 
 * Luego debe llamarse al wrapper del carrusel de la siguiente manera:
  
    const wrapperProductos = siteWrapper.querySelector('#productos');
  
 * Si se desea darle opciones especiales por fuera de las que tiene por default el carrusel, se debe crear un objeto con las configs especificas, por ejemplo:
 * Opciones: breakpoints, dots, navs

    const optionsForCarousel = {breakpoints: {
                    base: {
                        minWidth: 0,
                        items: 1,
                        active: true
                    }, ...

 * Luego debe crearse una variable con una nueva instancia del carrusel llamando al constructor de la siguiente manera (omitir el parametro de options si no se desea):
 * el primer parametro de la clase debe tener el wrapper general (basado en el id)
 
    let primerSlider = new Carousel(wrapperProductos, optionsForCarousel)
    
 * Por ultimo, debe inicializarse el carrusel utilizando el siguiente metodo:

    primerSlider.initialization()

 * Este proceso puede repetirse, con diferentes id por carrusel las veces que sean necesarias.
 * Por otro lado, el color de fondo y del spinner de loading puede cambiarse cambiando el valor de las variables de SASS en el partial de carousel.scss
*/

export function CarouselInit() { // la funcion CarouselInit debe ser importada al index.js e invocada previo a la declaracion de instancias.
    if (typeof window.Carousel === 'undefined'){
        window.Carousel = class{
            constructor(wrapper, options=null){
                this.contenedorExterno = wrapper.querySelector('.productos_wrapper');
                this.contenedorProductos = wrapper.querySelector('.productos');
                this.productos
                this.viewportWidth
                this.containerHeight
                this.containerWidth
                this.layout
                this.isResizing = false
                this.bulletsActive = false
                this.navActive = true
                this.autoHeight = true
                this.autoWidth = false
                this.autoSlide = false
                this.timeoutSlide = 5000
                this.breakpoints = {
                    base: {
                        minWidth: 0,
                        items: 1,
                        active: true
                    },
                    medium: {
                        minWidth: 1169,
                        items: 2,
                        active: true
                    },
                    large: {
                        minWidth: 1199,
                        items: 2,
                        active: true
                    },
                    xlarge: {
                        minWidth: 1366,
                        items: 3,
                        active: true
                    }
                }
                this.options = options
                this.preloader = wrapper.querySelector(".container_loader");
            }
            //inicia el carousel de acuerdo a layout
            initialization(){
                if (this.contenedorProductos) {
                    this.productos = this.contenedorProductos.querySelectorAll('.item-slider');
                } else {
                    console.error('no hay contenedor de productos');
                    return;
                }
            
                if (this.productos.length < 1) {
                    console.error('no hay productos');
                    return;
                }
                //valido las opciones
                if (this.options!=null && this.options.breakpoints) {
                    this.breakpoints = this.options.breakpoints;
                }

                if (this.options!=null && this.options.bullets) {
                    this.bulletsActive = this.options.bullets;
                }

                if (this.options!=null && this.options.navigation) {
                    this.navActive = this.options.navigation;
                }
                if (this.options!=null && this.options.autoSlide) {
                    this.autoSlide = this.options.autoSlide
                }
                if (this.options!=null && this.options.timeoutSlide) {
                    this.timeoutSlide = this.options.timeoutSlide
                }

                if (this.options!=null && this.options.autoHeight) {
                    this.autoHeight = this.options.autoHeight;
                }

                if (this.options!=null && this.options.autoWidth) {
                    this.autoWidth = this.options.autoWidth;
                }
                
                this.setWindowResizeEvent();
                //inicia el carousel
                setTimeout(()=>{
                    this.preloader.style.display = "none"
                },1000);
                this.startCarousel();
            }
            destroyCarousel(){
                console.log('carousel ended')
                
                if (this.navActive) {
                    //destruye navs
                    let elemento = this.contenedorExterno.querySelector('.nav-wrapper');
                    if (elemento) {
                        let padre = elemento.parentNode;
                        padre.removeChild(elemento);
                    }
                }
            
                if (this.bulletsActive) {
                    //destruye bullets
                    let elemento = this.contenedorExterno.querySelector('.bullets-wrapper');
                    if (elemento) {
                        let padre = elemento.parentNode;
                        padre.removeChild(elemento);
                    }        
                }
            
                //quita clases agregadas para restaurar el diseño original
                //setea productos. activa el primero y prepara las clases para el layout a mostrar
                this.contenedorExterno.classList.remove('carousel-on');
                this.contenedorProductos.classList.remove('productos-on');
                if ( this.autoHeight ) {
                    this.contenedorProductos.style.height = 'auto';
                }
            
                if ( this.autoWidth ) {
                    this.contenedorProductos.style.width = 'auto';
                }
                
                for (let p = 0; p < this.productos.length; p++) {
                    const producto = this.productos[p];
                    producto.classList.remove('item-on');
                    producto.classList.remove('item-on-'+this.layout);
                    producto.classList.remove('active-1');
                    producto.classList.remove('active');
                    producto.classList.remove('active1');
                    producto.classList.remove('active2');
                    producto.classList.remove('active3');
                    producto.classList.remove('active4');
                    producto.classList.remove('active-out-right');
                }
            }
            startCarousel(){
                console.log('carousel started');
            
                //setea ancho de viewport
                this.viewportWidth = window.innerWidth;
            
                //setea layout: base/medium/large/xl y sabe cuantos debe mostrar y si debe mostrarlo o detenerlo en este viewport
                this.layout = this.setLayout(this.viewportWidth);
                if ( !this.layout ) {
                    console.log('carousel detenido en este viewport: ', this.viewportWidth)
                    return;
                }
            
                //chequea si vale la pena el carousel de acuerdo al layout y cantidad de items
                if (this.layout >= this.productos.length) {
                    console.log('no hay suficientes productos para un carousel')
                    return;
                }
            
                //setea el alto y ancho del ul de productos para soportar absolute
                if (this.autoHeight) {
                    this.containerHeight = this.getHeightDefault();
                }
                
                if (this.autoWidth) {
                    this.containerWidth = this.getWidthDefault(this.layout);
                }
            
                //arma bullets
                if (this.bulletsActive) {
                    this.createBullets();
                    this.contenedorExterno.append()
                }
            
                //arma navs
                if (this.navActive) {
                    this.createNavigation();
                }
            
                //setea productos. activa el primero y prepara las clases para el layout a mostrar
                this.prepareProductsToSlide();
            
                this.isNavigationsBtnsInView(0);
                
            }
            //devuelve layout: base/medium/large/xl y sabe cuantos debe mostrar
            setLayout(w){
                let items = 1;
                let active = true;
            
                switch (true) {
                    case w > this.breakpoints.xlarge.minWidth:
                        items = this.breakpoints.xlarge.items;
                        active = this.breakpoints.xlarge.active;
                    break;
                
                    case w > this.breakpoints.large.minWidth:
                        items = this.breakpoints.large.items;
                        active = this.breakpoints.large.active;
                    break;
            
                    case w > this.breakpoints.medium.minWidth:
                        items = this.breakpoints.medium.items;
                        active = this.breakpoints.medium.active;
                    break;
                    default:
                        items = this.breakpoints.base.items;
                        active = this.breakpoints.base.active;
                    break;
                }
            
                if (active) {
                    return items;
                } else {
                    return false;
                }
                
            }
            //busca altura adecuada de acuerdo al producto más alto
            getHeightDefault(){
                let h = 0;
                for (let i = 0; i < this.productos.length; i++) {
                    let prH = this.productos[i].getBoundingClientRect().height
                    if ( prH > h ) {
                        h = prH;
                    }
                    
                }
                return h;
            }
            //busca el ancho considerando el layout
            getWidthDefault(layout){
                let wid = 286;
                for (let i = 0; i < this.productos.length; i++) {
                    let prW = this.productos[i].getBoundingClientRect().width
                    if ( prW > wid ) {
                        wid = prW;
                    }
                    
                }
                return wid * layout;
                
            }
            //funcion que maneja la lógica del resize
            setWindowResizeEvent = () => {
                //acomodo el evento para detectar resize y que se vuelva a construir el carousel
                window.addEventListener('resize', event => {
                    //este se hace para que no se haga resize en cada pixel, sino que espera 1000 antes de hacerlo
                    if(this.isResizing) {
                        return;
                    } else {
                        this.isResizing=true;
                        setTimeout(()=>{
                            //chequea si se destruye o no porque si no cambia el layout no vale la pena
                            let newLayout = this.setLayout(window.innerWidth)

                            //si setLayout devuelve false, es necesario la destruccion porque no hay carousel en este nuevo layout y no se activa mas
                            if ( !newLayout ) {
                                console.log('esta desactivo')
                                this.destroyCarousel();
                            } else if ( newLayout != this.layout ) {
                                //si newLayout no es igual a llayout hay que destruirlo y volverlo a armar porque cambia layout
                                this.isResizing=false;
                                this.destroyCarousel();
                                setTimeout(()=>{
                                    this.startCarousel();
                                },500);
                            } 

                            this.isResizing=false;
                            
                        },1000)
                    }
                });
            }
            //crear bullets
            createBullets(){
                let ul = document.createElement('ul');
                    ul.classList.add('bullets-wrapper');

                for (let index = 0; index < this.productos.length; index++) {
                    let li = document.createElement('li');
                    if (index == 0) {
                        li.classList.add('active');
                    }
                    ul.append(li);
                }
                this.contenedorExterno.append(ul);
            }
            //crear navs
            createNavigation(){
                let div = document.createElement('div');
                    div.classList.add('nav-wrapper');

                //botones:
                let btnL = document.createElement('button');
                    btnL.classList.add('nav-left');
                    btnL.setAttribute('data-direction', 'left');
                div.append(btnL);

                let btnR = document.createElement('button');
                    btnR.classList.add('nav-right');
                    btnR.setAttribute('data-direction', 'right');
                div.append(btnR);

                this.contenedorExterno.append(div);

                //crea events para botones

                btnL.addEventListener('click', this.clickNavigation);

                btnR.addEventListener('click', this.clickNavigation);
            }
            //prepara los productos agregando clases y estilos a los contenedores
            prepareProductsToSlide(){
                this.contenedorExterno.classList.add('carousel-on');
                this.contenedorProductos.classList.add('productos-on');

                if (this.autoHeight) {
                    this.contenedorProductos.style.height = this.containerHeight + 'px';
                }

                if (this.autoWidth) {
                    this.contenedorProductos.style.width = this.containerWidth + 'px';
                }
                
                for (let p = 0; p < this.productos.length; p++) {
                    const producto = this.productos[p];
                    producto.classList.add('item-on');
                    producto.classList.add('item-on-'+this.layout)
                    producto.setAttribute('data-index', p);

                    switch (p) {
                        case 0:
                            producto.classList.add('active');
                        break;
                        case 1:
                            if (this.layout && this.layout > 1) {
                                producto.classList.add('active1');
                            } else {
                                producto.classList.add('active-out-right');
                            }
                        break;
                        case 2:
                            if (this.layout && this.layout > 2) {
                                producto.classList.add('active2');
                            } else {
                                producto.classList.add('active-out-right');
                            }
                        break;
                        case 3:
                            if (this.layout && this.layout > 3) {
                                producto.classList.add('active3');
                            } else {
                                producto.classList.add('active-out-right');
                            }
                        break;
                        case 4:
                            if (this.layout && this.layout > 4) {
                                producto.classList.add('active4');
                            } else {
                                producto.classList.add('active-out-right');
                            }
                        break;
                    }

                }
            }
            //click en botones de navegacion
            clickNavigation = event => {
                const direction = event.target.getAttribute('data-direction');
                //se puede mover hacia ahí?
                if ( event.target.getAttribute('data-hidden') != true ) {
                    //entonces mueva:
                    this.moveOne(direction);    
                }
            }
            moveOne = (direction) => {
                console.log(0)
                //detectar que numero está activo
                let active = parseInt(this.getActive());
                
                //sumar o restar al active
                if (direction == 'right' && (active + this.layout) < this.productos.length) {
                    active++;
                    this.moveTo(active);
                } else if (direction == 'left' && active != 0){
                    active--;
                    this.moveTo(active);
                }
            
                this.isNavigationsBtnsInView(active);
            }
            //funcion que encuentra activa
            getActive = () => {
                let productActive = this.contenedorProductos.querySelector('.item-on.active');
                let index = productActive.getAttribute('data-index');
                return index;
            }
            //se mueve a este index: 0, 1, 2
            moveTo = index => {
                //recorrer productos
                for (let p = 0; p < this.productos.length; p++) {
                    const producto = this.productos[p];
                    producto.classList.remove('active-1');
                    producto.classList.remove('active');
                    producto.classList.remove('active1');
                    producto.classList.remove('active2');
                    producto.classList.remove('active3');
                    producto.classList.remove('active4');
                    producto.classList.remove('active-out-right');
                }
                //definimos active
                if (this.productos[index-1] ) {
                    this.productos[index-1].classList.add('active-1');
                }
                if (this.productos[index] ) {
                    this.productos[index].classList.add('active');
                }
                if (this.productos[index+1] ) {
                    //debugger;
                    if (this.layout > 1 ) {
                        this.productos[index+1].classList.add('active1');
                    } else {
                        this.productos[index+1].classList.add('active-out-right');
                    }
                } 
                if (this.productos[index+2] ) {
                    //debugger;
                    if (this.layout > 2 ) {
                        this.productos[index+2].classList.add('active2');
                    } else {
                        this.productos[index+2].classList.add('active-out-right');
                    }
                } 
                if (this.productos[index+3] ) {  
                    //debugger;
                    if (this.layout > 3 ) {
                        this.productos[index+3].classList.add('active3');
                    } else {
                        this.productos[index+3].classList.add('active-out-right');
                    }
                } 
                if (this.productos[index+4] ) {  
                    //debugger;
                    if (this.layout > 4 ) {
                        this.productos[index+4].classList.add('active4');
                    } else {
                        this.productos[index+4].classList.add('active-out-right');
                    }
                } 
            }
            //chequea si es correcto mostrar los buttons right y left y los oculta o los muestra
            isNavigationsBtnsInView = active => {
                let btns = this.contenedorExterno.querySelectorAll('.nav-wrapper button');
                if (active != 0){
                    //muestra left
                    btns[0].style.opacity = 1;
                    btns[0].style.pointerEvents = 'all';
                    btns[0].removeAttribute('data-hidden');
                } else {
                    //oculta left
                    btns[0].style.opacity = 0;
                    btns[0].style.pointerEvents = 'none';
                    btns[0].setAttribute('data-hidden', 'true');
                }

                if (this.layout != false ) {
                    if (active+this.layout == this.productos.length) {
                        //oculta right
                        btns[1].style.opacity = 0;
                        btns[1].style.pointerEvents = 'none';
                        btns[1].setAttribute('data-hidden', 'true');
                    } else {
                        //muestra right
                        btns[1].style.opacity = 1;
                        btns[1].style.pointerEvents = 'all';
                        btns[1].removeAttribute('data-hidden');
                    }
                }
            }
        }
    }else if (typeof window.Carousel === 'function'){
        console.log("Clase definida previamente satisfactoriamente")
    }
}
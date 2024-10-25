//valores constantes
const widthCanvas = 360;
const heithCanvas = 600;

//scores
let passes = 0;
let goals = 0;

//carteles
let boxText1, boxText2, boxTextEnd;

//variables
let canvas;
let ctx;

export default function startGame(gameContainer, listContainer) {
    console.log('Game started');    

    //instrucciones
    boxText1 = listContainer.querySelector('#inst1');
    boxText2 = listContainer.querySelector('#inst2');
    boxTextEnd = listContainer.querySelector('#exit-game');

    //build canvas
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = widthCanvas;
    canvas.height = heithCanvas;
    gameContainer.appendChild(canvas);
    
    //draw field
    drawFootballField();
}


// Dibujar el campo de fútbol
function drawFootballField() {
    // Fondo verde
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Líneas blancas
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // Líneas de banda
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Línea central
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();

    // Círculo central
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
    ctx.stroke();

    // Áreas de penalti
    ctx.strokeRect((canvas.width / 2) - 110, 10, 220, 100);
    ctx.strokeRect((canvas.width / 2) - 110, canvas.height - 110, 220, 100);

    // Áreas pequeñas
    ctx.strokeRect((canvas.width / 2) - 55, 10, 110, 50);
    ctx.strokeRect((canvas.width / 2) - 55, canvas.height - 60, 110, 50);
}
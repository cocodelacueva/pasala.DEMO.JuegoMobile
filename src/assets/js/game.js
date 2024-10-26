//valores constantes
import { widthCanvas, heithCanvas, colors, formations } from './constants.js';

//scores
let passes = 0;
let goals = 0;

//carteles
let boxText1, boxText2, boxTextEnd;

//variables
let canvas, ctx;
let currentFormation = '4-4-2';

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
    
    //draw formations
    drawGame();
}




// Dibujar formación
function drawGame() {
    const formation = formations[currentFormation];
    console.log(formation)
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el campo de fútbol
    drawFootballField();

    // Dibujar los jugadores
    drawPlayersFormation(formation);
    
    // dibujar pelota
    drawBall(formation);
}

function drawBall(formation) {
    
    if (formation.gk) {
        let x = formation.gk.x;
        let y = formation.gk.y;
        let isRed = true;

        setInterval(() => {
            ctx.fillStyle = isRed ? colors.red : colors.white;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            isRed = !isRed;
        }, 500);
    }

}

function drawPlayersFormation(formation) {
    //recorrer objeto formation
    for (const player in formation) {
        if (player === 'gk') {
            ctx.fillStyle = colors.blue
        } else {
            ctx.fillStyle = colors.black
        }
        
        ctx.beginPath();
        ctx.arc(formation[player].x, formation[player].y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawAdversaryFormation(formation);
}

// Dibujar formación del adversario
// por ahora simplemente copia la misma formacion pero invirtiendo las coordenadas
function drawAdversaryFormation(formation) {
    //recorrer objeto formation
    for (const player in formation) {
        let x = canvas.width - formation[player].x;
        let y = canvas.height - (formation[player].y);
        if (player === 'gk') {
            ctx.fillStyle = colors.blue   
        } else {
            ctx.fillStyle = colors.white
        }
        ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fill();
    }
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
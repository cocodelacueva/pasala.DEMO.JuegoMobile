//valores constantes
import { widthCanvas, heithCanvas, colors, formations, rows, cols, radiusPosition, offsetNPC } from './constants.js';

let currentFormation = '4-4-2';

//scores
let gameStarted = false;
let passes = 0;
let goals = 0;
let playerSelected = null;

//carteles
let boxText1, boxText2, boxTextEnd;

//variables
let canvas, ctx, positions = { players: {user: [], npc: []}, ball: {} };

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
    
    //getPositions
    const formation = formations[currentFormation];
    getPositions(formation);
    
    //updateCanvas
    updateCanvas(positions);

    startToPlay();
}


function startToPlay() {
    gameStarted = true;
    console.log(positions)


    //detecta clicks en el canvas
    canvas.addEventListener('click', handleClick);
}

//handle click
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedPlayer = positions.players.user.find(player => {
        const dx = x - player.x;
        const dy = y - player.y;
        return Math.sqrt(dx * dx + dy * dy) <= player.radius;
    });

    if (clickedPlayer) {
        console.log(`Jugador ${clickedPlayer.id} fue clickeado`);
    } else {
        console.log('No se hizo clic en ningún jugador');
    }
}



//arma las posiciones iniciales de acuerdo a la formacion
function getPositions(formation) {
    //recorrer objeto formation
    for (const player in formation) {
        positions.players.user.push( { id: player, x: formation[player].x, y: formation[player].y, radius: radiusPosition } );
    }

    for (const player in formation) {
        let x = canvas.width - formation[player].x;
        let y = canvas.height - (formation[player].y - offsetNPC);
        positions.players.npc.push( { id: player, x: x, y: y, radius: radiusPosition } );
    }
    
    let x = formation.gk.x;
    let y = formation.gk.y;

    positions.ball = { x, y, radius: radiusPosition };
}


/* 
 * funciones que dibujan en el canvas
*/
function updateCanvas(positions) {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el campo de fútbol
    drawFootballField();

    // Dibujar la pelota
    drawBall(positions.ball);

    

    for (const player of positions.players.user) {
        if (player.id === 'gk') {
            ctx.fillStyle = colors.blue;
        } else {
            ctx.fillStyle = colors.black;
        }
        
        ctx.beginPath();
        ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    for (const player of positions.players.npc) {
        if (player.id === 'gk') {
            ctx.fillStyle = colors.blue;
        } else {
            ctx.fillStyle = colors.white;
        }
        
        ctx.beginPath();
        ctx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    //dibuja la grilla
    drawGrid();

}

// Dibujar el campo de fútbol
function drawFootballField() {
    // Fondo verde
    ctx.fillStyle = colors.green;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Líneas blancas
    ctx.strokeStyle = colors.white;
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

function drawBall(coordinates) {
    let isRed = true;

    setInterval(() => {
        ctx.fillStyle = isRed ? colors.red : colors.white;
        ctx.beginPath();
        ctx.arc(coordinates.x, coordinates.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        isRed = !isRed;
    }, 500);
    
}

//dibuja grilla en la pantalla
function drawGrid() {
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    ctx.strokeStyle = colors.gray;
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(canvas.width, i * cellHeight);
        ctx.stroke();
    }

    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * cellWidth, 0);
        ctx.lineTo(j * cellWidth, canvas.height);
        ctx.stroke();
    }
}
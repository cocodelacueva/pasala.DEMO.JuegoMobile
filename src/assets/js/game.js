//valores constantes
import { widthCanvas, heightCanvas, colors, formations, rows, cols, radiusPosition, offsetNPC } from './constants.js';

let currentFormation = '4-4-2';

//scores
let gameStarted = false;
let passes = 0;
let goals = 0;
let points = 0;
let dificulty = 1;
let playerSelected = null;
let ballSelected = false;
let maxDistanceMoveNPC = 200;
let radioPlayerToIntercept = 1.5;
let incremetoDificultad = 1.5;
let puntoPorPase = 10;

//carteles
let boxText1, boxText2, boxTextEnd, pointsText, dificultyText, goalText;

//variables
let canvas, ctx, positionsCopy, positions = { players: {user: [], npc: []}, ball: {} };

// Definir la posición del arco
const goal = {
    x: widthCanvas / 2,
    y: 0, // Suponiendo que el arco está en la parte superior del canvas
    width: 100,
    height: 10
};

// Definir la posición del arquero
const goalkeeper = {
    x: goal.x,
    y: goal.y + 20, // Ajustar según sea necesario
    radius: 15
};

export default function startGame(gameContainer) {
    console.log('Game started'); 

    //instrucciones
    boxText1 = document.querySelector('#inst1');
    boxText2 = document.querySelector('#inst2');
    boxTextEnd = document.querySelector('#exit-game');
    pointsText = document.querySelector('#pointcontainer'); 
    dificultyText = document.querySelector('#dificultycontainer');
    goalText = document.querySelector('#goalcontainer');
    console.log({boxText1, boxText2, boxTextEnd, pointsText, dificultyText, goalText})

    //build canvas
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = widthCanvas;
    canvas.height = heightCanvas;
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
    resetPoints();

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
    console.log('clickedPlayer', clickedPlayer);

    const clickedBall = isBallClicked(x, y);

    if (clickedBall) {
        console.log('Pelota seleccionada');
        ballSelected = true;
        positions.ball.selected = true;
        updateCanvas(positions);
        
    } else if (clickedPlayer && ballSelected) {
        // Verificar si hay un jugador contrario en la trayectoria de la pelota
        const ballPath = { x1: positions.ball.x, y1: positions.ball.y, x2: clickedPlayer.x, y2: clickedPlayer.y };
        const opponentInPath = positions.players.npc.some(opponent => isPlayerInPath(opponent, ballPath));
        
        if (opponentInPath) {
            console.log('Pelota perdida, hay un jugador contrario en la trayectoria');
            playerSelected = null;
            //termina el juego
            endGame();
            // Dibujar la línea de la pelota
            ctx.strokeStyle = colors.red;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(positions.ball.x, positions.ball.y);
            ctx.lineTo(clickedPlayer.x, clickedPlayer.y);
            ctx.stroke();

            // Dibujar el radio del jugador que intercepta
            const interceptingPlayer = positions.players.npc.find(opponent => isPlayerInPath(opponent, ballPath));
            if (interceptingPlayer) {
                ctx.strokeStyle = colors.red;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(interceptingPlayer.x, interceptingPlayer.y, interceptingPlayer.radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        } else {
            // Animar el movimiento de la pelota a la posición del jugador seleccionado
            animateTargetMovement(positions.ball, clickedPlayer);
            ballSelected = false;
            playerSelected = null;
            calculatePoints();
            setTimeout(() => {
                moveNPCs();    
            }, 500);
            
            console.log(`Pelota movida a la posición del jugador ${clickedPlayer.id}`);
        }
    } else if (clickedPlayer && !playerSelected) {
        playerSelected = clickedPlayer;
        updateCanvas(positions);
        console.log(`Jugador ${clickedPlayer.id} seleccionado`);
        
    } else if (playerSelected) {
        const distance = Math.sqrt((x - playerSelected.x) ** 2 + (y - playerSelected.y) ** 2);
        const maxDistance = 50; // Distancia máxima permitida para moverse

        if (distance <= maxDistance) {
            // Animar el movimiento del jugador seleccionado a la posición del clic
            animateTargetMovement(playerSelected, { x, y });
            moveNPCs();
            setTimeout(() => {
                playerSelected = null;    
            }, 200);
            
            console.log('Jugador movido a la posición del clic');
        } else {
            console.log('El jugador está demasiado lejos para moverse a esa posición');
        }
    } else if (isGoalClicked(x, y)) {
        console.log('Arco seleccionado');
        const distanceToGoal = Math.sqrt((positions.ball.x - goal.x) ** 2 + (positions.ball.y - goal.y) ** 2);
        const maxGoalDistance = 150; // Umbral de distancia para que el arquero intente interceptar

        if (distanceToGoal > maxGoalDistance) {
             // Actualizar la posición del arquero
            goalkeeper.x = positions.ball.x;
            goalkeeper.y = positions.ball.y;
            // Mover al arquero para interceptar la pelota
            animateTargetMovement(goalkeeper, { x: positions.ball.x, y: positions.ball.y });
            console.log('El arquero intercepta la pelota');
        } else {
            // Animar el movimiento de la pelota al arco
            animateTargetMovement(positions.ball, { x: goal.x, y: goal.y });
            ballSelected = false;
            playerSelected = null;
            calculatePoints(true); // Contar el gol
            console.log('¡Gol!');
        }
    } else {
        console.log('No se hizo clic en ningún jugador ni en la pelota y no habia nada seleccionado');
    }
}

function isBallClicked(x, y) {
    const dx = x - positions.ball.x;
    const dy = y - positions.ball.y;
    return Math.sqrt(dx * dx + dy * dy) <= positions.ball.radius;
}

function isGoalClicked(x, y) {
    return x >= goal.x - goal.width / 2 && x <= goal.x + goal.width / 2 && y >= goal.y;
}

function animateTargetMovement(element, target) {
    const dx = target.x - element.x;
    const dy = target.y - element.y;
    const steps = 5;
    let step = 0;
    const interval = 100; // Intervalo en milisegundos

    function moveTarget() {
        if (step < steps) {
            element.x += dx / steps;
            element.y += dy / steps;
            updateCanvas(positions);
            step++;
            setTimeout(() => {
                requestAnimationFrame(moveTarget);
            }, interval);
        } else {
            element.x = target.x;
            element.y = target.y;
            updateCanvas(positions); 
        }
    }
    
    requestAnimationFrame(moveTarget);
}

function isPlayerInPath(player, path) {
    const { x1, y1, x2, y2 } = path;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return false;
    const t = ((player.x - x1) * dx + (player.y - y1) * dy) / (distance * distance);
    if (t < 0 || t > 1) return false; // Ensure the closest point is within the segment
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    const distToPath = Math.sqrt((player.x - closestX) * (player.x - closestX) + (player.y - closestY) * (player.y - closestY));
    const expandedRadius = player.radius * radioPlayerToIntercept; // Variable to expand the radius
    return distToPath <= expandedRadius;
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

    positionsCopy = JSON.parse(JSON.stringify(positions));
}

//Inteligencia artificial de los NPC
function moveNPCs() {
    //determina los 3 jugadores mas cercanos a la pelota
    let closestPlayers = positions.players.npc.map(npc => {
        const dx = positions.ball.x - npc.x;
        const dy = positions.ball.y - npc.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { player: npc, distance };
    }).sort((a, b) => a.distance - b.distance).slice(0, 3);
    
    //vuelve a los demás jugadores a la posicion original positionsCopy
    moveNPCsToOriginalPosition(closestPlayers.map(player => player.player));
 
    //movimiento de los jugadores
    for (const { player } of closestPlayers) {
        
        const dx = positions.ball.x - player.x;
        const dy = positions.ball.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistanceMoveNPC) {
            const step = 20;
            const targetX = player.x + (dx / distance) * step;
            const targetY = player.y + (dy / distance) * step;

            animateTargetMovement(player, { x: targetX, y: targetY });
        }
    }
}

//mueve los jugadores a la posicion original
function moveNPCsToOriginalPosition(playersToIgnore = []) {
    for (let index = 0; index < positions.players.npc.length; index++) {
        const npc = positions.players.npc[index];
        const npcOriginal = positionsCopy.players.npc[index];
        
        if (playersToIgnore.some(player => player === npc)) {
            continue;
        }  

        const dxOriginal = npcOriginal.x - npc.x;
        const dyOriginal = npcOriginal.y - npc.y;
        const distanceOriginal = Math.sqrt(dxOriginal * dxOriginal + dyOriginal * dyOriginal);
        if (distanceOriginal > 1) { // Evitar movimientos innecesarios
            const step = 20;
            const targetX = npc.x + (dxOriginal / distanceOriginal) * step;
            const targetY = npc.y + (dyOriginal / distanceOriginal) * step;

            animateTargetMovement(npc, { x: targetX, y: targetY });
        }
    }
}

function calculatePoints (goal=false) {
    passes++;

    //si los pases son menos de 10 sumo 10 puntos por pase
    if (passes <= puntoPorPase) {
        points += puntoPorPase;
    } else {
        //si los pases son mas de 10 le resto el 10% 5 puntos por pase
        const toDiscount = passes * 10 /100;
        points += (puntoPorPase - toDiscount)
    }

    if (passes > puntoPorPase) {
        addDificulty();
    }
    
    //si hay goal sumo 100 puntos
    if (goal) {
        goalCount();
        addDificulty();
    }

    console.log({passes})
    console.log({points})

    //actualizo los puntos en pantalla
    pointsText.innerHTML = points;

    
}

//si hay un gol los pases vuelven a 0 y se suma el gol
function goalCount() {
    goals++;
    passes = 0;
    //actualizo los goles en pantalla
    goalText.innerHTML = goals;
}

function addDificulty() {
    console.log('addDificulty');
    maxDistanceMoveNPC * incremetoDificultad;
    radioPlayerToIntercept * incremetoDificultad;
    dificulty++;

    //actualizo dificultad en pantalla
    dificultyText.innerHTML = dificulty;
}

function endGame() {
    gameStarted = false;
    canvas.removeEventListener('click', handleClick);
    console.log('Game ended');
    boxText1.innerHTML = `Pases: ${passes}`;
    boxText2.innerHTML = `Goles: ${goals}`;
    boxTextEnd.innerHTML = 'Juego terminado';
}

function resetPoints() {
    passes = 0;
    goals = 0;
    points = 0;
}


/* 
 * funciones que dibujan en el canvas
*/
function updateCanvas(positions) {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el campo de fútbol
    drawFootballField();

    for (const player of positions.players.user) {
        if (player === playerSelected) {
            ctx.fillStyle = colors.playerSelected;
        } else if (player.id === 'gk') {
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
    
    // Dibujar la pelota
    drawBall(positions.ball);

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

    
        ctx.fillStyle = colors.red;
        ctx.beginPath();
        ctx.arc(coordinates.x, coordinates.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        isRed = !isRed;
    
    
    //requestAnimationFrame(blinkBall);
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
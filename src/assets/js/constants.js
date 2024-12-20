//valores constantes
const widthCanvas = 360;
const heightCanvas = 600;
const rows = 20;
const cols = 10;
const radiusPosition = 10;
const offsetNPC = 10;
const maxGoalDistance = 150;

const colors = {
    black: '#000000',
    gray: '#ccc',
    white: '#FFFFFF',
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF',
    playerSelected: 'orange',
}

const formations = {
    '4-4-2': {
        gk: {
            x: widthCanvas / 10 * 5,
            y: heightCanvas / 20 * 19
        },
        lb: {
            x: widthCanvas / 10 * 1,
            y: heightCanvas / 20 * 14
        },
        lcb: {
            x: widthCanvas / 10 * 3,
            y: heightCanvas / 20 * 16
        },
        rcb: {
            x: widthCanvas / 10 * 7,
            y: heightCanvas / 20 * 16
        },
        rb: {
            x: widthCanvas / 10 * 9,
            y: heightCanvas / 20 * 14
        },
        lm: {
            x: widthCanvas / 10 * 2,
            y: heightCanvas / 20 * 10
        },
        lcm: {
            x: widthCanvas / 10 * 4,
            y: heightCanvas / 20 * 12
        },
        rcm: {
            x: widthCanvas / 10 * 6,
            y: heightCanvas / 20 * 12
        },
        rm: {
            x: widthCanvas / 10 * 8,
            y: heightCanvas / 20 * 10
        },
        ls: {
            x: widthCanvas / 10 * 4,
            y: heightCanvas / 20 * 7
        },
        rs: {
            x: widthCanvas / 10 * 6,
            y: heightCanvas / 20 * 7
        },
    },
    '4-3-3': {
        gk: {x: 50, y: 50},
    },
    '4-2-3-1': {
        gk: {x: 50, y: 50},
    },
    '3-5-2': {
        gk: {x: 50, y: 50},
    },
    '3-4-3': {
        gk: {x: 50, y: 50},
    },
}


export { widthCanvas, heightCanvas, colors, formations, rows, cols, radiusPosition, offsetNPC, maxGoalDistance };
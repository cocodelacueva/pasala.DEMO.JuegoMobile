//valores constantes
const widthCanvas = 360;
const heithCanvas = 600;
const rows = 20;
const cols = 10;
const radiusPosition = 10;

const colors = {
    black: '#000000',
    gray: '#eeeeee',
    white: '#FFFFFF',
    green: '#00FF00',
    red: '#FF0000',
    blue: '#0000FF',
    
}

const formations = {
    '4-4-2': {
        gk: {
            x: widthCanvas / 10 * 5,
            y: heithCanvas / 20 * 19
        },
        lb: {
            x: widthCanvas / 10 * 1,
            y: heithCanvas / 20 * 14
        },
        lcb: {
            x: widthCanvas / 10 * 3,
            y: heithCanvas / 20 * 16
        },
        rcb: {
            x: widthCanvas / 10 * 7,
            y: heithCanvas / 20 * 16
        },
        rb: {
            x: widthCanvas / 10 * 9,
            y: heithCanvas / 20 * 14
        },
        lm: {
            x: widthCanvas / 10 * 2,
            y: heithCanvas / 20 * 10
        },
        lcm: {
            x: widthCanvas / 10 * 4,
            y: heithCanvas / 20 * 12
        },
        rcm: {
            x: widthCanvas / 10 * 6,
            y: heithCanvas / 20 * 12
        },
        rm: {
            x: widthCanvas / 10 * 8,
            y: heithCanvas / 20 * 10
        },
        ls: {
            x: widthCanvas / 10 * 4,
            y: heithCanvas / 20 * 7
        },
        rs: {
            x: widthCanvas / 10 * 6,
            y: heithCanvas / 20 * 7
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


export { widthCanvas, heithCanvas, colors, formations, rows, cols, radiusPosition };
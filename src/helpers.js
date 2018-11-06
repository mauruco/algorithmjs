// converter um array[x][y] para um array de uma dimensão = array[(x + y * width) * 4];
const inspect = (obj) => {

    if(process.env.NODE_ENV !== 'development')
        return;

    console.log(`%c${obj.constructor.name}`, 'color: #00FFFF');
    for(let m in obj)
        if(typeof obj[m] === 'function')
            console.log(`%c${m}`, 'color: #FF0000');
    
    for(let m in obj)
        if(typeof obj[m] !== 'function'){
            let type = typeof obj[m];
            console.log(`${type}: ${m}`);
        }
    
}

const print = (n) => {

    if(process.env.NODE_ENV !== 'development')
        return;

    if(typeof n === 'object')
        console.table(n);
    else
        console.log(n);
};

const random = (min, max) => Math.floor(Math.random()*(max-(min)+1)+(min));

const randomArrayEle = (arr) => arr[Math.floor(Math.random() * arr.length)];

const mapRange = (x, inMin, inMax, outMin, outMax) => (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

const rgbToHex = (r, g, b) => ((r << 16) | (g << 8) | b).toString(16);

export {

    inspect,
    print,
    random,
    randomArrayEle,
    mapRange,
    rgbToHex
};
const pixel = (graph, x, y, r = 255, g = 255, b = 255, a = 1, scl = 1) => {

    let pixel = {height: 1 * scl, width: 1 * scl, x: x, y: y};
    let rgb =  ((r << 16) | (g << 8) | b).toString(16);

    graph.fillStyle(`0x${rgb}`, a);
    graph.fillRectShape(pixel);
};

const about = (text) => {

    let body = document.getElementsByTagName('body')[0];
    let about = document.createElement('div');
    text = text.join('<br />');
    about.innerHTML = text;
    about.id = 'about';
    body.appendChild(about);
};

export {
    pixel,
    about
};
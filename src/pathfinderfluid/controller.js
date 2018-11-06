import Phaser from '../Phaser';

const controller = (scene) => {

    return {

        text: () => {

            let opt = document.getElementById('opt');
            opt.innerHTML = '<span class="inline">Meu pathfinder algoritmo!</span>';
        },

        makeGrid: (width, height, scl) => {

            let grid = [];

            for(let i = 0; i < width / scl; i++){

                let x = i ;

                for(let j = 0; j < height / scl; j++) {
                    
                    let y = j;

                    grid[(y + x * width) * 4] = {};
                }
            }

            return grid;
        }
    };
};

export default controller;
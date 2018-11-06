import Phaser from '../Phaser';
import { randomArrayEle, random } from '../helpers';

const controller = (scene) => {

    return {

        makeGrid(obstaclePropability = 10) {

            let grid = [];
            for(let y = 0; y < scene.height / scene.scl; y++){

                grid[y] = [];
                for(let x = 0; x < scene.width / scene.scl; x++){

                    grid[y][x] = new Phaser.Geom.Rectangle(x * scene.scl, y * scene.scl, scene.scl, scene.scl);
                    grid[y][x].options = {

                        isObstacle: false,
                        color: 0xFFFFFF
                    };

                    let rand = Math.random() * 100;

                    if(rand < obstaclePropability) {

                        grid[y][x].options = {

                            ...grid[y][x].options,
                            isObstacle: true,
                            color: 0x000000
                        };
                    }

                    if(!grid[y][x].options.isObstacle){

                        scene.graph.lineStyle(1, grid[y][x].options.color, 1.0);
                        scene.graph.strokeRectShape(grid[y][x]);
                        continue;
                    }
                    
                    scene.graph.fillStyle(grid[y][x].options.color, 1);  
                    scene.graph.fillRectShape(grid[y][x]);
                }
            }
            
            return grid;
        },

        loopThrough: (grid, callBack) => {

            for(let y = 0; y < scene.height / scene.scl; y++)
                for(let x = 0; x < scene.width / scene.scl; x++)
                    callBack(grid[y][x]);
        },
    };
};

export default controller;
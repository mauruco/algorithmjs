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

                        x,
                        y,
                        isEnd: false,
                        isObstacle: false,
                        color: 0xFFFFFF,
                        G: 0,
                        H: 0,
                        F: 0
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

                        scene.graph.fillStyle(grid[y][x].options.color, 1);
                        scene.graph.fillRectShape(grid[y][x]);
                        continue;
                    }
                    
                    scene.graph.fillStyle(grid[y][x].options.color, 1);  
                    scene.graph.fillRectShape(grid[y][x]);
                }
            }

            // ponto de partida
            grid[0][0].options.isEnd = false;
            grid[0][0].options.isObstacle = false;
            grid[0][0].options.color = 0xFFFFFF;
            scene.graph.fillStyle(grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].options.color, 1);
            scene.graph.fillRectShape(grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1]);

            // ponto de chegada
            grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].options.isEnd = true;
            grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].options.isObstacle = false;
            grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].options.color = 0xFFFFFF;
            scene.graph.fillStyle(grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].options.color, 1);
            scene.graph.fillRectShape(grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1]);
            
            return grid;
        },

        loopThrough: (grid, callBack) => {

            for(let y = 0; y < scene.height / scene.scl; y++)
                for(let x = 0; x < scene.width / scene.scl; x++)
                    callBack(grid[y][x]);
        },

        getParents: (place, grid) => {

            let parents = [];
            let y = place.options.y;
            let x = place.options.x;
            
            if(grid[y-1]){
                
                // top
                if(grid[y-1][x])
                    parents.push(grid[y-1][x]);
                // top left
                if(grid[y-1][x-1])
                    parents.push(grid[y-1][x-1]);
                // top right
                if(grid[y-1][x+1])
                    parents.push(grid[y-1][x+1]);
            }
            
            if(grid[y+1]){
                
                // bottom
                parents.push(grid[y+1][x]);
                // top left
                if(grid[y+1][x-1])
                    parents.push(grid[y+1][x-1]);
                // top right
                if(grid[y+1][x+1])
                    parents.push(grid[y+1][x+1]);
            }

            // left
            if(grid[y][x-1])
                parents.push(grid[y][x-1]);
            
                // right
            if(grid[y][x+1])
                parents.push(grid[y][x+1]);

            return parents;
        },

        loopThroughParents: (parents, callBack) => {

            for(let i in parents)
                callBack(parents[i])
        },

        reset(grid) {

            scene.graph.clear();

            scene.ctrl.loopThrough(grid, (place) => {

                if(!place.options.isObstacle){

                    scene.graph.fillStyle(place.options.color, 1);
                    scene.graph.strokeRectShape(place);
                    return;
                }
                
                scene.graph.fillStyle(place.options.color, 1);  
                scene.graph.fillRectShape(place);
            });

            let open = [];
            open[(grid[0][0].options.y + grid[0][0].options.x * scene.width) * 4] = grid[0][0];
            return open;
        }
    };
};

export default controller;
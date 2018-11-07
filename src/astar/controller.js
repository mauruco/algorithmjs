import Phaser from '../Phaser';

const controller = (scene) => {

    return {

        makeGrid(obstaclePropability = 10) {

            let grid = [];
            for(let y = 0; y < scene.height / scene.scl; y++){

                grid[y] = [];
                for(let x = 0; x < scene.width / scene.scl; x++){

                    grid[y][x] = new Phaser.Geom.Rectangle(x * scene.scl, y * scene.scl, scene.scl, scene.scl);
                    grid[y][x].opt = {

                        y,
                        x,
                        isStart: false,
                        isEnd: false,
                        isObstacle: false,
                        isClosed: false,
                        isFullFiled: false,
                        h: (scene.height / scene.scl) + (scene.width / scene.scl) - y - x - 2,
                        hInverted: (scene.height / scene.scl) * y + (scene.width / scene.scl) * x,
                        f: 0
                    };

                    let rand = Math.random() * 100;

                    if(rand < obstaclePropability) {

                        grid[y][x].opt = {

                            ...grid[y][x].opt,
                            isObstacle: true
                        };
                    }
                }
            }

            // ponto de partida
            grid[0][0].opt.isStart = true;
            grid[0][0].opt.isClosed = true;
            grid[0][0].opt.isObstacle = false;
            scene.graph.fillStyle(0xFFFFFF, 1);  
            scene.graph.fillRectShape(grid[0][0]);

            // ponto de chegada
            grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].opt.isEnd = true;
            grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].opt.isClosed = true;
            grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1].opt.isObstacle = false;
            scene.graph.fillStyle(0xFFFFFF, 1);
            scene.graph.fillRectShape(grid[scene.height / scene.scl - 1][scene.width / scene.scl - 1]);
            
            return grid;
        },

        drawGrid: (grid) => {

            scene.ctrl.loopThrough(grid, (place) => {

                // let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl, place.opt.h, style);
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl + 20, place.opt.hInverted, style);

                if(place.opt.isObstacle){

                    scene.graph.fillStyle(0x000000, 1);
                    scene.graph.fillRectShape(place);
                    return;
                }
                
                if(place.opt.isBadWay){
                    
                    
                    scene.graph.fillStyle(0x0000FF, 1);
                    scene.graph.fillRectShape(place);
                    return;
                }
                
                scene.graph.fillStyle(0xFFFFFF, 1);  
                scene.graph.fillRectShape(place);

            });
        },

        loopThrough: (list, callBack) => {

            for(let y in list)
                for(let x in list[y])
                    callBack(list[y][x])
        },

        getParents: (place) => {

            let parents = [];
            let y = place.opt.y;
            let x = place.opt.x;
            
            if(scene.grid[y-1]){
                
                // top
                if(!scene.grid[y-1][x].opt.isObstacle)
                    parents.push(scene.grid[y-1][x]);
                // // top left
                // if(scene.grid[y-1][x-1] && !scene.grid[y-1][x-1].opt.isObstacle)
                //     parents.push(scene.grid[y-1][x-1]);
                // // top right
                // if(scene.grid[y-1][x+1] && !scene.grid[y-1][x+1].opt.isObstacle)
                //     parents.push(scene.grid[y-1][x+1]);
            }
            
            if(scene.grid[y+1]){
                
                // bottom
                if(!scene.grid[y+1][x].opt.isObstacle)
                    parents.push(scene.grid[y+1][x]);
                // // top left
                // if(scene.grid[y+1][x-1] && !scene.grid[y+1][x-1].opt.isObstacle)
                //     parents.push(scene.grid[y+1][x-1]);
                // // top right
                // if(scene.grid[y+1][x+1] && !scene.grid[y+1][x+1].opt.isObstacle)
                //     parents.push(scene.grid[y+1][x+1]);
            }

            // left
            if(scene.grid[y][x-1] && !scene.grid[y][x-1].opt.isObstacle)
                parents.push(scene.grid[y][x-1]);
            
                // right
            if(scene.grid[y][x+1] && !scene.grid[y][x+1].opt.isObstacle)
                parents.push(scene.grid[y][x+1]);

            return parents;
        },
    };
};

export default controller;
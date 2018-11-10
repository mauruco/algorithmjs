import Phaser from '../Phaser';

const controller = (scene) => {

    return {

        makeGrid() {

            let grid = [];
            for(let y = 0; y < scene.height / scene.scl; y++){

                grid[y] = [];
                for(let x = 0; x < scene.width / scene.scl; x++){

                    let realY = y * scene.scl;
                    let realX = x * scene.scl;

                    grid[y][x] = new Phaser.Geom.Rectangle(realX, realY, scene.scl, scene.scl);
                    grid[y][x].opt = {
                        y,
                        x,
                        visited: false,
                        parents: [],
                        walls: [true, true, true, true], // top, right, bottom, left
                        lines: [
                            new Phaser.Geom.Line(realX            , realY               , realX + scene.scl, realY               ),
                            new Phaser.Geom.Line(realX + scene.scl, realY               , realX + scene.scl, realY + scene.scl   ),
                            new Phaser.Geom.Line(realX + scene.scl, realY + scene.scl, realX               , realY + scene.scl   ),
                            new Phaser.Geom.Line(realX            , realY + scene.scl, realX               , realY               )
                        ]
                    };
                }
            }
            
            return grid;
        },

        getParents: (grid) => {
            
            scene.ctrl.loopThrough(grid, (spot) => {

                let y = spot.opt.y;
                let x = spot.opt.x;
                // top
                if(grid[y-1])
                    spot.opt.parents.push(grid[y-1][x]);
                // right
                if(grid[y][x+1])
                    spot.opt.parents.push(grid[y][x+1]);
                // bottom
                if(grid[y+1])
                    spot.opt.parents.push(grid[y+1][x]);
                // left
                if(grid[y][x-1])
                    spot.opt.parents.push(grid[y][x-1]);
            });

            return grid;
        },

        loopThrough: (list, callBack) => {

            for(let y in list)
                for(let x in list[y])
                    callBack(list[y][x])
        },
        
        drawSpot: (spot, current = false) => {

            let backgroundColor = 0x999999;
            if(spot.opt.visited)
                backgroundColor = 0x00007B;
            if(current)
                backgroundColor = 0x7B0000;
            
            scene.graph.fillStyle(backgroundColor, 1);  
            scene.graph.fillRectShape(spot);

            let lineColor =  0xFFFFFF;
            
            spot.opt.walls.filter((wall, i) => {

                if(!wall)
                    return wall;

                scene.graph.lineStyle(1, lineColor, 1.0)
                scene.graph.strokeLineShape(spot.opt.lines[i]);
                return wall;
            });
        },

        getUnVisitedsParents: (spot) => {
            
            // spot ainda tem parents que não foram visitados
            let unVisiteds = [];
            for(let i = 0; i < spot.opt.parents.length; i++)
                if(!spot.opt.parents[i].opt.visited)
                    unVisiteds.push(spot.opt.parents[i]);

            return unVisiteds;
        },

        removeWall: (current, parent) => {
            
            if(current.opt.y < parent.opt.y){
                // current is top from parent
                current.opt.walls[2] = false;
                parent.opt.walls[0] = false;
            }
            if(current.opt.x > parent.opt.x){
                // current is right from parent
                current.opt.walls[3] = false;
                parent.opt.walls[1] = false;
            }
            if(current.opt.y > parent.opt.y){
                // current is bottom from parent
                current.opt.walls[0] = false;
                parent.opt.walls[2] = false;
            }
            if(current.opt.x < parent.opt.x){
                // current is left from parent
                current.opt.walls[1] = false;
                parent.opt.walls[3] = false;
            }
        }
    };
};

export default controller;
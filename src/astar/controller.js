import Phaser from '../Phaser';

const controller = (scene) => {

    return {

        reload: (txt) => {

            let style = {fontFamily: 'Arial', fontSize: '24px', color: '#FF0000', backgroundColor: '#FFFFFF'};
            scene.add.text(50, 50, txt, style);

            let canvas = document.getElementsByTagName('canvas')[0];
            canvas.style.cursor = 'pointer';
            canvas.addEventListener('click', () => {

                window.location.reload();
            });
        },

        makeGrid(obstaclePropability = 10) {

            let grid = [];
            for(let y = 0; y < scene.height / scene.scl; y++){

                grid[y] = [];
                for(let x = 0; x < scene.width / scene.scl; x++){

                    grid[y][x] = new Phaser.Geom.Rectangle(x * scene.scl, y * scene.scl, scene.scl, scene.scl);
                    grid[y][x].opt = {

                        id: (y + x * scene.height) * 4,
                        y,
                        x,
                        h: 0,
                        g: 0,
                        f: 0,
                        isStart: false,
                        isEnd: false,
                        isObstacle: false,
                        isRoute: false,
                        isEmpty: false
                    };

                    let rand = Math.random() * 100;

                    if(rand < obstaclePropability) {

                        grid[y][x].opt = {

                            ...grid[y][x].opt,
                            isObstacle: true
                        };
                    }

                    scene.ctrl.drawPlace(grid[y][x]);
                }
            }
            
            return grid;
        },

        getParentsAndH: (grid, end) => {
            
            scene.ctrl.loopThrough(grid, (place) => {
                
                place.opt.h = Math.abs(place.opt.y - end.opt.y) + Math.abs(end.opt.x - place.opt.x);
                place.opt.parents = scene.ctrl.getParents(grid, place)
            });
        },

        getParents: (grid, place) => {

            let parents = [];
            let y = place.opt.y;
            let x = place.opt.x;
            
            if(grid[y-1]){
                
                // top
                if(!grid[y-1][x].opt.isObstacle)
                    parents.push(grid[y-1][x]);
                
                if(scene.diagonal){

                    // top left
                    if(grid[y-1][x-1] && !grid[y-1][x-1].opt.isObstacle)
                        parents.push(grid[y-1][x-1]);
                    // top right
                    if(grid[y-1][x+1] && !grid[y-1][x+1].opt.isObstacle)
                        parents.push(grid[y-1][x+1]);
                }
            }
            
            if(grid[y+1]){
                
                // bottom
                if(!grid[y+1][x].opt.isObstacle)
                    parents.push(grid[y+1][x]);

                if(scene.diagonal){

                    // top left
                    if(grid[y+1][x-1] && !grid[y+1][x-1].opt.isObstacle)
                        parents.push(grid[y+1][x-1]);
                    // top right
                    if(grid[y+1][x+1] && !grid[y+1][x+1].opt.isObstacle)
                        parents.push(grid[y+1][x+1]);
                }
            }

            // left
            if(grid[y][x-1] && !grid[y][x-1].opt.isObstacle)
                parents.push(grid[y][x-1]);
            
                // right
            if(grid[y][x+1] && !grid[y][x+1].opt.isObstacle)
                parents.push(grid[y][x+1]);

            return parents;
        },

        setStart: (grid) => {

            let ry = Math.floor(Math.random() * (scene.height / scene.scl));
            let rx = Math.floor(Math.random() * (scene.width / scene.scl));

            // ponto de partida
            grid[ry][rx].opt.isStart = true;
            grid[ry][rx].opt.isClosed = true;
            grid[ry][rx].opt.isObstacle = false;
            scene.ctrl.drawPlace(grid[ry][rx]);
            return grid[ry][rx];
        },
        
        setEnd: (grid) => {
            
            let ry = Math.floor(Math.random() * (scene.height / scene.scl));
            let rx = Math.floor(Math.random() * (scene.width / scene.scl));
            
            // ponto de chegada
            grid[ry][rx].opt.isEnd = true;
            grid[ry][rx].opt.isClosed = true;
            grid[ry][rx].opt.isObstacle = false;
            scene.ctrl.drawPlace(grid[ry][rx]);
            return grid[ry][rx];
        },

        loopThrough: (list, callBack) => {

            for(let y in list)
                for(let x in list[y])
                    callBack(list[y][x])
        },
        
        drawPlace: (place) => {

            // let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
            // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl, place.opt.g, style);
            // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl + 12, place.opt.g, style);
            // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl, place.opt.y, style);
            // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl + 12, place.opt.x, style);
            // scene.add.text(place.opt.x * scene.scl + 20, place.opt.y * scene.scl, place.opt.f, style);

            let color =  0x999999;

            if(place.opt.isObstacle)
                color =  0x000000;

            if(place.opt.isEmpty)
                color =  0x00FF00;

            if(place.opt.isRoute)
                color =  0x0000FF;
            
            if(place.opt.isStart || place.opt.isEnd )
                color = 0xFF0000;
            
            scene.graph.fillStyle(color, 1);  
            scene.graph.fillRectShape(place);
        },

        traceBack: (closeds, end) => {

            let currentPlace = end;

            while(true) {

                // pintar
                if(!currentPlace.opt.isStart && !currentPlace.opt.isEnd){

                    currentPlace.opt.isRoute = true;
                    scene.ctrl.drawPlace(currentPlace);
                }
                
                // pegar parents, que estão na lista de closeds
                let parents = [];
                currentPlace.opt.parents.filter((parent) => {
                    if(!closeds[parent.opt.id])
                        return;

                    parents.push(parent);
                });

                // pegar o parente com elemento com o valor menor de G // estou correndo de traz pra frente
                let g = 9**9;
                for(let i = 0; i < parents.length; i++){

                    if(parents[i].opt.isStart){

                        scene.ctrl.reload('DONE! Reload?');
                        return;
                    }

                    // essa casa tem sempre a menor pontuação G
                    if(parents[i].opt.g > g)
                        continue

                    // melhor opção
                    g = parents[i].opt.g;
                    currentPlace = parents[i];
                }

            }
        }
    };
};

export default controller;
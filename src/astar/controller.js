import Phaser from '../Phaser';

const controller = (scene) => {

    return {

        about: (text) => {

            let body = document.getElementsByTagName('body')[0];
            let about = document.createElement('div');
            about.innerHTML = text;
            about.id = 'about';
            body.appendChild(about);
        },

        makeGrid(obstaclePropability = 10) {

            let grid = [];
            for(let y = 0; y < scene.height / scene.scl; y++){

                grid[y] = [];
                for(let x = 0; x < scene.width / scene.scl; x++){

                    grid[y][x] = new Phaser.Geom.Rectangle(x * scene.scl, y * scene.scl, scene.scl, scene.scl);
                    grid[y][x].opt = {

                        i: (y + x * scene.height) * 4,
                        y,
                        x,
                        isStart: false,
                        isEnd: false,
                        isObstacle: false,
                        backTrace: false,
                        h: 0,
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
            
            return grid;
        },

        calcH: (grid, end) => {

            scene.ctrl.loopThrough(grid, (place) => {

                place.opt.h = Math.abs(place.opt.y - end.opt.y) + Math.abs(end.opt.x - place.opt.x);;
            });
        },

        drawGrid: (grid) => {

            scene.ctrl.loopThrough(grid, (place) => {

                // let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl, place.opt.h, style);
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl + 20, place.opt.hInverted, style);

                if(place.opt.isObstacle){

                    scene.ctrl.draw(place, 0x000000)
                    return;
                }
                
                if(place.opt.isStart || place.opt.isEnd ){

                    scene.ctrl.draw(place, 0xFF0000)
                    return;
                }
                
                scene.graph.fillStyle(0x999999, 1);  
                scene.graph.fillRectShape(place);

            });
        },

        setStart: (place) => {

            // ponto de partida
            place.opt.isStart = true;
            place.opt.isClosed = true;
            place.opt.isObstacle = false;
            return place;
        },
        
        setEnd: (place) => {
            
            // ponto de chegada
            place.opt.isEnd = true;
            place.opt.isClosed = true;
            place.opt.isObstacle = false;
            return place;
        },

        loopThrough: (list, callBack) => {

            for(let y in list)
                for(let x in list[y])
                    callBack(list[y][x])
        },

        getParents: (grid, place, closeds = false) => {

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

            if(closeds) {

                let closedsParents = [];
                parents.filter((parent) => {
                    
                    // se parent não fizer parta da lista closeds, ignorar
                    for(let i in closeds) {

                        // se closed foi removido (beco sem saida), ignorar
                        if(!closeds)
                            continue;
                        
                        if(parseInt(i) !== parseInt(parent.opt.i))
                            continue;

                        if(parent.opt.backTrace)
                            continue;
                        
                        closedsParents.push(parent);
                    }
                    
                    return parent;
                });
                
                return closedsParents;
            }

            return parents;
        },
        
        draw: (place, color = 0x00FF00) => {

            scene.graph.fillStyle(color, 1);  
            scene.graph.fillRectShape(place);
        },

        traceBack: (closeds, start, end) => {

            // resentando lista de backtrace
            for(let i in closeds){
                // se foi excluido para resetar, ignorar
                if(!closeds[i])
                    continue;
                closeds[i].opt.backTrace = false;
                if(!closeds[i].opt.isStart && !closeds[i].opt.isEnd)
                    scene.ctrl.draw(closeds[i], 0x00FF00);
            }

            let currentPlace = end;
            let backTrace = [];

            let teste = 150;
            while(true) {

                teste--;

                // pintar
                if(!currentPlace.opt.isStart && !currentPlace.opt.isEnd)
                    scene.ctrl.draw(currentPlace, 0x0000FF);
                
                // adionando a lista de já passei por aqui
                currentPlace.opt.backTrace = true;

                // achei caminho completo
                if(currentPlace.opt.i === start.opt.i) {

                    backTrace[currentPlace.opt.i] = currentPlace.opt.i;
                    if(!currentPlace.opt.isStart && !currentPlace.opt.isEnd)
                        scene.ctrl.draw(currentPlace, 0x0000FF);
                    // console.log('backtrace complete');

                    let style = {fontFamily: 'Arial', fontSize: '24px', color: '#FF0000', backgroundColor: '#FFFFFF'};
                    scene.add.text(50, 50, 'DONE! Reload?', style);
                    scene.ctrl.reload();
                    return;
                }
                
                // pegar parents, que estão na lista de closeds e não estão na de backtrace
                let parents = scene.ctrl.getParents(scene.grid, currentPlace, closeds);
                
                //  estou sem parents, então tô preso e vou resetar, removendo a currentplcae da lista de closeds
                if(parents.length === 0){
                    
                    console.log('im stucky');
                    closeds[currentPlace.opt.i] = false;
                    scene.ctrl.draw(currentPlace);
                    scene.ctrl.traceBack(closeds, start, end);
                    return;
                }

                // só tenho uma opção, então é ela
                if(parents.length === 1){
                    
                    currentPlace = parents[0];
                    continue;
                }
                
                // pegar o parente com elemento com o valor maior h
                let h = 0;
                for(let i = 0; i < parents.length; i++){

                    // pegar parente com maior valor e que não tá na lista bactrace
                    if(parents[i].opt.backTrace || parents[i].opt.h < h)
                        continue;
                        
                    // melhor opção
                    h = parents[i].opt.h;
                    currentPlace = parents[i];
                }

                if(!teste)
                    return;
            }
        },

        reload: () => {

            let canvas = document.getElementsByTagName('canvas')[0];
            canvas.style.cursor = 'pointer';
            canvas.addEventListener('click', () => {

                window.location.reload();
            });
        }
    };
};

export default controller;
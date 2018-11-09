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
                        traceBack: false,
                        h: 0,
                        g: 0,
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

        calcG: (grid, start) => {

            scene.ctrl.loopThrough(grid, (place) => {

                place.opt.g = Math.abs(place.opt.y - start.opt.y) + Math.abs(start.opt.x - place.opt.x);;
            });
        },

        drawGrid: (grid) => {

            scene.ctrl.loopThrough(grid, (place) => {

                let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl, place.opt.h, style);
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl + 12, place.opt.g, style);
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl, place.opt.y, style);
                // scene.add.text(place.opt.x * scene.scl, place.opt.y * scene.scl + 12, place.opt.x, style);
                // scene.add.text(place.opt.x * scene.scl + 20, place.opt.y * scene.scl, place.opt.f, style);

                if(place.opt.isObstacle){

                    scene.ctrl.draw(place, 0x000000);
                    return;
                }
                
                if(place.opt.isStart || place.opt.isEnd ){

                    scene.ctrl.draw(place, 0xFF0000);
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

                        if(parent.opt.traceBack)
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

            // resentando lista de traceBack
            for(let i in closeds){
                // se foi excluido para resetar, ignorar
                if(!closeds[i])
                    continue;
                closeds[i].opt.traceBack = false; // <-------------------------------------------------------------------ISSO TEM QUE MELHORAR
                if(!closeds[i].opt.isStart && !closeds[i].opt.isEnd)
                    scene.ctrl.draw(closeds[i], 0x00FF00);
            }

            let currentPlace = end;
            let traceBack = [];
            let lastPlace = null;

            // a casa atual já foi vista antes e não foi escolhida!
            // então saberei se escholer ela agora que "eu passei por ela e voltei pra ela"
            let alreadysee = [];

            let step = 0;

            let test = 550;
            while(true) {
                test--;
                if(!test)
                    return;

                // pintar
                if(!currentPlace.opt.isStart && !currentPlace.opt.isEnd)
                    scene.ctrl.draw(currentPlace, 0x0000FF);
                
                // adionando a lista de já passei por aqui
                currentPlace.opt.traceBack = true;

                // achei caminho completo   <--------------------------------------------------------------------------------------- isso tem ir para o loop de parents
                if(currentPlace.opt.i === start.opt.i) {

                    traceBack[currentPlace.opt.i] = currentPlace.opt.i;
                    if(!currentPlace.opt.isStart && !currentPlace.opt.isEnd)
                        scene.ctrl.draw(currentPlace, 0x0000FF);
                    // console.log('traceBack complete');

                    let style = {fontFamily: 'Arial', fontSize: '24px', color: '#FF0000', backgroundColor: '#FFFFFF'};
                    scene.add.text(50, 50, 'DONE! Reload?', style);
                    scene.ctrl.reload();
                    return;
                }
                
                // pegar parents, que estão na lista de closeds e não estão na de traceBack
                let parents = scene.ctrl.getParents(scene.grid, currentPlace, closeds);
                
                //  estou sem parents, então tô preso e vou resetar, removendo a currentplcae da lista de closeds
                if(parents.length === 0){
                    
                    console.log('im stucky', currentPlace.opt.y, currentPlace.opt.x, currentPlace.opt.i);
                    closeds[currentPlace.opt.i] = false;
                    scene.ctrl.draw(currentPlace);
                    scene.ctrl.traceBack(closeds, start, end);
                    return;
                }

                lastPlace = currentPlace;

                console.log('step', step, currentPlace.opt.y, currentPlace.opt.x, currentPlace.opt.i);
                step++;
                
                // só tenho uma opção, então é ela
                if(parents.length === 1){
                    
                    currentPlace = parents[0];
                    continue;
                }

                // pegar o parente com elemento com o valor maior força // estou correndo de traz pra frente
                let f = 0;
                for(let i = 0; i < parents.length; i++){

                    // já passei por essa casa, ignore ela
                    if(parents[i].opt.traceBack)
                        continue;

                    // essa casa tem uma pontiação menor dq a já escolhida, igonre ela
                    if(parents[i].opt.f < f)
                        continue

                    // melhor opção
                    f = parents[i].opt.f;
                    currentPlace = parents[i];
                }

                // currentplace já foi visto e não escolhido
                if(alreadysee[currentPlace.opt.i] && alreadysee[currentPlace.opt.i] === true)
                    console.log('see but not cheoiced, why?', currentPlace.opt.y, currentPlace.opt.x, currentPlace.opt.i);

                // vi essass casas e não escolhi
                for(let i = 0; i < parents.length; i++){

                    if(currentPlace.opt.i !== parents[i].opt.i)
                        alreadysee[parents[i].opt.i] = true;
                }
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
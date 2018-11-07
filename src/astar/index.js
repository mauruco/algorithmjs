import Phaser from '../Phaser';
import controller from './controller';

class AStar extends Phaser.Scene {

    static config() {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x999999,
            scene: [AStar]
        };
    }

    constructor() {

        super({key: 'AStar'});
    }

    create() {

        this.ctrl = controller(this);
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 10;
        this.graph = this.add.graphics();
        let obstaclePropability = 35;
        this.grid = this.ctrl.makeGrid(obstaclePropability);

        // lista caminho aberto (open)
        // lista fechado (closed)
        // ponto de partida deve se encontar no lista de abertos
        // LOOP
        // 1. pegar lugar com menor pontução, esse é nosso lugar atual
        // 2. adiconar lugar atual a lista fechada e remover da lista aberta
        // 3. checkar se lugar atual é potno final, encontramos o caminho
        // 4. buiscar parentes
        // 5. para cada parente
        // 5.1 verificar se tá na lista de fechados, se sim, igonorar esse parente
        // 5.2 adicionar se NÃO exista na lista de abrtos, computando a pontuação
        // 5.3 se já existe na lista de abertos e contem um pontuação menor dq a computada no momento
        // 5.3 então fechar luagar atual, resetar todas as lista e algoritmo.
 
        /*
            A potnuação F = G + H
                  G
            0  1  2  4  5x
            A -> | 3 | ->
                 ->      | 1
                         | 2
                         | 3  H
                         | 4
                          B 5

            G é o custo que se tem pra pular de uma casa para outra.da casa A para casa C pode ser = 2, mas da casa B (localização atual é 1). então G é sempre 1.
            H é o custo real do ponto de pártida ao ponto de chegada.

            então a casa (x) tem um custo de (5 passos para cheagr até + um estimado 5 passos para chegar na chegada)
            com H pode se pode ser creativo, imgone adicona um extra de esforço casa a acasa seja um terreno especial (lama, agua, etc..)

        */

        this.reset = () => {

            this.ctrl.drawGrid(this.grid);
            this.openPlaces = [];
            this.closedPlaces = [];
            this.lastPlace = null;
            this.pathFound = false;

            // adicionado campo de partida para array
            this.openPlaces[0] = [this.grid[0][0]];
            this.openPlaces[0][0].opt.f = 0;
        };

        this.reset();
        this.frame = 0;
    }

    update() {

        // this.frame++;
        // if(this.frame < 5)
        //     return;
        // this.frame = 0;

        if(this.pathFound)
            return;


        if(!this.openPlaces.length)
            return;


        // pegando a casa com menor pontuação da lista de abertos
        let f = 999999999999;
        let currrentPlace = null;

        this.ctrl.loopThrough(this.openPlaces, (place) => {

            
            if(!place || place.opt.f > f)
                return;
    
            f = place.opt.f;
            currrentPlace = place;
        });

        // ops, não tenho para onde ir
        if(!currrentPlace) {

            console.log('no way')
            return;
        }

        // pitando casa atual de vermelho
        this.graph.fillStyle(0xFF0000, 1);  
        this.graph.fillRectShape(currrentPlace);

        if(!this.closedPlaces[currrentPlace.opt.y])
            this.closedPlaces[currrentPlace.opt.y] = [];
        if(!this.openPlaces[currrentPlace.opt.y])
            this.openPlaces[currrentPlace.opt.y] = [];

        // adicionando casa atual a closed
        this.closedPlaces[currrentPlace.opt.y][currrentPlace.opt.x] = currrentPlace;
        this.closedPlaces[currrentPlace.opt.y][currrentPlace.opt.x].opt.isClosed = true;
        // removendo a casa dos abertos
        this.openPlaces[currrentPlace.opt.y][currrentPlace.opt.x] = false;

        // se casa atual é final, aehhh
        if(currrentPlace.opt.isEnd) {

            // console.log('path found');
            this.pathFound = true;
            this.graph.fillStyle(0xFF0000, 1);  
            this.graph.fillRectShape(currrentPlace);

            // achei um caminho e agora vou  agora vou pecorrer esse caminho ao contrario
            // criando H do final para o início
            // era isso XD GENIAL
            let finish = false;

            // start é a últimacasa
            let actualPlace = null;
            this.ctrl.loopThrough(this.grid, (place) => {

                if(!place.opt.isEnd)
                    return;
                
                actualPlace = place;
            });

            // pitando
            this.graph.fillStyle(0x0000FF, 1);
            this.graph.fillRectShape(actualPlace);

            let teste = 250;
            
            while(!finish) {

                teste--;

                // pitando
                // console.log(actualPlace.opt);
                this.graph.fillStyle(0x0000FF, 1);
                this.graph.fillRectShape(actualPlace);
                
                // let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
                // this.add.text(actualPlace.opt.x * this.scl, actualPlace.opt.y * this.scl + 35, actualPlace.opt.y + '+' + actualPlace.opt.x, style);
                
                // removendo da lista de markados como closed
                actualPlace.opt.isClosed = false;
                
                // pegar o parente com element o o menor valor hInvertido
                let parents = this.ctrl.getParents(actualPlace);

                // considerando apenas os parents que foram adiconados a lista close
                // let hInverted = actualPlace.opt.hInverted;
                let hInverted = 999999999;

                for(let i = 0; i < parents.length; i++){

                    if(!parents[i].opt.isStart){

                        // verificando se escolha tem parents, ou se entrei em um beco sem saida
                        let parentsFromParent = this.ctrl.getParents(parents[i]);
                        let parentsFromParentHasParent = false;
                        for(let j = 0 ; j < parentsFromParent.length; j++){
                            
                            if(!parentsFromParent[j].opt.isClosed && !parentsFromParent[j].opt.isStart)
                                continue;
                            
                            parentsFromParentHasParent = parentsFromParent[j];
                        }
                        
                        if(!parentsFromParentHasParent)
                            continue;
                        //
                        // verificando se escolha da escolha tem parents, ou se entrei em um beco sem saida XD
                        let parentsFromFromParent = this.ctrl.getParents(parentsFromParentHasParent);
                        let parentsFromFromParentHasParent = false;
                        for(let j = 0 ; j < parentsFromFromParent.length; j++){
                            
                            if(!parentsFromFromParent[j].opt.isClosed && !parentsFromFromParent[j].opt.isStart)
                                continue;
                            
                            parentsFromFromParentHasParent = parentsFromFromParent[j];
                        }
                        
                        if(!parentsFromFromParentHasParent)
                            continue;
                        //
                        // verificando se escolha da escolha da escolha tem parents, ou se entrei em um beco sem saida XD
                        let parentsFromFromFromParent = this.ctrl.getParents(parentsFromParentHasParent);
                        let parentsFromFromFromParentHasParent = false;
                        for(let j = 0 ; j < parentsFromFromFromParent.length; j++){
                            
                            if(!parentsFromFromFromParent[j].opt.isClosed && !parentsFromFromFromParent[j].opt.isStart)
                                continue;
                            
                            parentsFromFromFromParentHasParent = parentsFromFromFromParent[j];
                        }
                        
                        if(!parentsFromFromFromParentHasParent)
                            continue;
                        //
                    }
                    
                    if(parents[i].opt.isClosed === true && parents[i].opt.hInverted < hInverted){
                        
                        hInverted = parents[i].opt.hInverted;
                        actualPlace = parents[i];
                        // console.log('aqui achei um melhor', parents[i].opt.y, parents[i].opt.x, parents[i].opt.isClosed, parents[i])
                    }
                }

                // se só tenho uma opçaõ é melhor el dq nenhuma kkkk
                if(parents.length === 1){

                    // console.log('so tem esse ', parents[0].opt.y, parents[0].opt.x)
                    actualPlace = parents[0];
                }

                // se é a última casa
                if(actualPlace.opt.hInverted === 0) {

                    this.graph.fillStyle(0x0000FF, 1);
                    this.graph.fillRectShape(actualPlace);
                    
                    // let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
                    // this.add.text(actualPlace.opt.x * this.scl, actualPlace.opt.y * this.scl + 35, actualPlace.opt.y + '+' + actualPlace.opt.x, style);
                    
                    finish = true;
                }


                if(!teste){

                    console.log('aqui de erro', actualPlace.opt)
                    console.log('aqui de erro', parents)
                    finish = true;
                    return;
                }
            }

            return;
        }

        // parents
        this.parents = this.ctrl.getParents(currrentPlace);

        let reset = false;
        this.parents.filter((parent) => {

            // this.graph.fillStyle(0xFF0000, 1);
            // this.graph.fillRectShape(parent);


            // identifiquei um caminho ruim, para loop
            if(reset)
                return parent;
            
            let f = 1 + parent.opt.h;  // lembre g é sempre um da casa atual até a casa vizinha
                                       // mas tem o global que vai crescendo conforme vc se movimenta

            let y = parent.opt.y;
            let x = parent.opt.x;
            // se tá na lista de fechados, continue
            if(this.closedPlaces[y] && this.closedPlaces[y][x])
                return parent;

            // se não tá na lista de abertos, computar f e adiconar
            if(!this.openPlaces[y] || !this.openPlaces[y][x]) {

                if(!this.openPlaces[y])
                    this.openPlaces[y] = [];

                parent.opt.f = f;
                this.openPlaces[y][x] = parent;
                return parent;
            }

            return parent;
        });

        if(reset)
            return this.reset();

        // útlima casa visitada
        this.lastPlace = currrentPlace;
    }
}

export default AStar;
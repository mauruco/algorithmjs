import Phaser from '../Phaser';
import controller from './controller';

class AStar extends Phaser.Scene {

    static config() {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x333333,
            scene: [AStar]
        };
    }

    constructor() {

        super({key: 'AStar'});
    }

    create() {

        this.ctrl = controller(this);
        this.ctrl.about('Demontração de algoritmo para buscar o melhor caminho de A a B com base no famoso algoritmo "A*".');
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 20;
        this.graph = this.add.graphics();
        
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
        
        G é o custo que se tem pra pular de uma casa para outra.da casa A para casa C pode ser = 2, mas da casa B (localização atual é 1). 
        Então G é sempre 1.
        H é o custo real que cada casa tem até chegar no ponto final.
        
        então a casa (x) tem um custo de (5 passos para cheagr até + um estimado 5 passos para chegar na chegada)
        Com G pode se pode ser creativo, imgone adicona um extra de esforço casa a acasa seja um terreno especial (lama, agua, etc..)
        No exemplo a baixo não foi necessário utlizar G
        
        */
       
        let obstaclePropability = 30;
        this.grid = this.ctrl.makeGrid(obstaclePropability);

        // this.diagonal = true;
        this.openPlaces = [];
        this.closedPlaces = [];
        this.done = false;


        let ry = Math.floor(Math.random() * (this.height / this.scl));
        let rx = Math.floor(Math.random() * (this.width / this.scl));

        this.start = this.ctrl.setStart(this.grid[ry][rx]);

        ry = Math.floor(Math.random() * (this.height / this.scl));
        rx = Math.floor(Math.random() * (this.width / this.scl));
        this.end = this.ctrl.setEnd(this.grid[ry][rx]);

        this.ctrl.calcH(this.grid, this.end);

        this.ctrl.drawGrid(this.grid);
        this.openPlaces = [];
        this.openPlaces[this.start.opt.i] = this.start;

        // this.frame = 0;
    }

    update() {

        // this.frame++;
        // if(this.frame < 5)
        //     return;
        // this.frame = 0;

        if(this.done)
            return;


        if(!this.openPlaces.length)
            return;

        // pegando a casa com menor pontuação da lista de abertos
        let f = 9**9;
        let currrentPlace = null;

        for(let i in this.openPlaces) {

            if(!this.openPlaces[i])
                continue;


            if(this.openPlaces[i].opt.f > f)
                continue;
    
            f = this.openPlaces[i].opt.f;
            currrentPlace = this.openPlaces[i];
        }

        // ops, não tenho para onde ir
        if(!currrentPlace) {

            let style = {fontFamily: 'Arial', fontSize: '24px', color: '#FF0000', backgroundColor: '#FFFFFF'};
            this.add.text(50, 50, 'NO WAY! Reload?', style);
            this.ctrl.reload();
            this.done = true;
            return;
        }

        // pitando casa atual de vermelho
        if(!currrentPlace.opt.isStart && !currrentPlace.opt.isEnd)
            this.ctrl.draw(currrentPlace);

        // adicionando casa atual a closed
        this.closedPlaces[currrentPlace.opt.i] = currrentPlace;
        
        // removendo a casa dos abertos
        this.openPlaces[currrentPlace.opt.i] = false;

        // se casa atual é final, aehhh
        if(currrentPlace.opt.isEnd) {

            // console.log('path found');
            this.done = true;
            // backtrace rota
            this.ctrl.traceBack(this.closedPlaces, this.start, this.end);
            return;
        }

        // parents
        let parents = this.ctrl.getParents(this.grid, currrentPlace);

        parents.filter((parent) => {
            
            let f = parent.opt.h;   // lembre é  G + H, no meu algo identifiquei uma forma de usar apenas H
            let i = parent.opt.i;
            // se tá na lista de fechados, continue
            if(this.closedPlaces[i])
                return parent;
            
            // se não tá na lista de abertos, computar f e adiconar
            if(!this.openPlaces[parent.opt.i]) {
                
                parent.opt.f = f;
                this.openPlaces[parent.opt.i] = parent;
                return parent;
            }

            return parent;
        });
    }
}

export default AStar;
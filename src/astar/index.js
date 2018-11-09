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
        this.ctrl.about('Minha versão do famoso algoritmo "A*".');
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 10;
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
                    | 1
                    | 2
                    | 3  H
                    | 4
                    B 5
        
        G é o custo que teve para pontuar ela!!!!
        Se vc já viu a casa, vc já deu pontos pra ela, então se vc escolha ela vc continua o G que a casa tem!
        H é o custo real que cada casa tem em relação ao ponto final.
        
        
        então a casa (x) tem um custo de (5 passos para cheagr até + um estimado 5 passos para chegar na chegada)
        Com G/H pode se pode ser creativo, imgone adicona um extra de esforço casa a acasa seja um terreno especial (lama, agua, etc..)

        Conclusão:
        H aponta sempre aponta em direçaõ ao final.
        Utilizando H sem utilizar F, sem tem um algoritmo mai veloz, mas tambem menos eficiente em achar o caminho mais curto.
        G vai sempre apontar para o ponto de partida. Assim ao pecorrer invertidamente só é necessário olhar para o menor valor G.

        SE vc utiliza F ele rastreia mais caminhos.
        
        */
       
        let obstaclePropability = 30;
        this.grid = this.ctrl.makeGrid(obstaclePropability);

        let ry1 = Math.floor(Math.random() * (this.height / this.scl));
        let rx1 = Math.floor(Math.random() * (this.width / this.scl));
        let ry2 = Math.floor(Math.random() * (this.height / this.scl));
        let rx2 = Math.floor(Math.random() * (this.width / this.scl));
        
        this.start = this.ctrl.setStart(this.grid[ry1][rx1]);
        this.end = this.ctrl.setEnd(this.grid[ry2][rx2]);
        this.ctrl.calcH(this.grid, this.end);
        this.g = 0;
        this.ctrl.drawGrid(this.grid);
        // this.diagonal = true;
        this.openPlaces = [];
        this.closedPlaces = [];
            
        for(let i in this.closedPlaces) {
        
            if(this.closedPlaces[i].opt.isObstacle){

                this.ctrl.draw(this.closedPlaces[i], 0x000000);
                continue;
            }
            
            this.ctrl.draw(this.closedPlaces[i], 0x999999);
        }
        
        this.openPlaces = [];
        this.closedPlaces = [];
        this.done = false;
        this.openPlaces[this.start.opt.i] = this.start;
    }

    update() {

        if(this.done)
            return;


        if(!this.openPlaces.length)
            return;

        // pegando a casa com menor pontuação H da lista de abertos
        // TESTE COM SOMENTE H E VEJA O EFEITO
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

        // G
        this.g = currrentPlace.opt.g + 1;

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
            
            let i = parent.opt.i;
            // se tá na lista de fechados, continue
            if(this.closedPlaces[i])
                return parent;
            
            // se não tá na lista de abertos, computar g + f
            if(!this.openPlaces[parent.opt.i]) {
                
                parent.opt.g = this.g; // F = G + H,
                parent.opt.f = parent.opt.g + parent.opt.h; // F = G + H,
                this.openPlaces[parent.opt.i] = parent;
                
                // let style = {fontFamily: 'Arial', fontSize: '12px', color: '#FFFFFF', backgroundColor: '#000000'};
                // this.add.text(parent.opt.x * this.scl, parent.opt.y * this.scl, parent.opt.g, style);
                // this.add.text(parent.opt.x * this.scl + 12, parent.opt.y * this.scl, parent.opt.h, style);
                // this.add.text(parent.opt.x * this.scl + 12, parent.opt.y * this.scl + 12, parent.opt.f, style);

                return parent;
            }

            return parent;
        });
    }
}

export default AStar;
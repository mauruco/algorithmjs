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
        this.scl = 50;
        this.graph = this.add.graphics();
        let obstaclePropability = 20;
        this.grid = this.ctrl.makeGrid(obstaclePropability);

        // lista caminho não explorado (open)
        // lista de caminho explorado (closed) // o melhor caminaho actual
        // 1. começar adicionar casa de partida para lista de closed
        // 2. escolher uma direção
        // 2. escolher a direção mais vantajosa
        // cada casa tem uma pontuação (G + H)
        // G é o custo para chegar na casa do ponto de partida (A) (casa do lado 1, casa do lado da do lado 2 etc..)
        // a cada casa andada G aumenta 1
        // H é o custo para a casa actual até o ponto de chegada (B) estimado pra chegar na chegada
        /*
                  G
            0  1  2  4  5x
            A -> | 3 | ->
                 ->      | 1
                         | 2
                         | 3  H
                         | 4
                          B 5

            então a casa (x) tem um custo de (5 passos para cheagr até + um estimado 5 passos para chegar na chegada)
            com H pode se pode ser creativo, imgone adicona um extra de esforço casa a acasa seja um terreno especial (lama, agua, etc..)

        */
        // Quanto mais perto do H o G estiver mais curta é a distância
        // Mas pode ter momentos que H (off) tá desligado, então o caminho acha talvez não seja o mais curto
        // F = (G + H) (calculado em tempo real)
        //
        // Então  o algoritimo começa
        // 1. Vamos pegar a casa com a menor pontuação (F) da lista de aberto
        // 2. Vamos chamar essa casa de (S)
        // 3. Remova (S) da lista de aberto e adicione a lista de fechado
        // 4. Para cada casa na visão de (TILE) (T) de (S)
        /*
            1. (T) tá na lista de fechados, então ignore
            2. se (T) não estiver na lista de abertos, então adicione (T) a lista de abertos e compute a pontuação de (T)
            3. se (T) estiver na lista aberta verifique sua pontuação computada é menor que (F) e menor então atulize a pontuação de F e seus parentes
        */

        this.open = [];
        this.closed = [];
        this.black = [];

        // // computando pontos de start
        // this.grid[0][0].options.G = 0;
        // this.grid[0][0].options.H = this.height / this.scl - 1 + this.width / this.scl;
        // this.grid[0][0].options.F = this.grid[0][0].options.G + this.grid[0][0].options.H;

        // adiciona start (A)
        this.open[(this.grid[0][0].options.y + this.grid[0][0].options.x * this.height) * 4] = this.grid[0][0];
        this.open = this.ctrl.reset(this.grid);

        this.frame = 0;
        this.G = 0;
    }

    update() {

        // this.frame++;
        // if(this.frame < 5)
        //     return;
        // this.frame = 0;

        if(this.end)
            return;
            
        let actual = null;

        // pintar open
        for(let at in this.open) {
            
            this.graph.fillStyle(0xFF0000, 1);  
            this.graph.fillRectShape(this.open[at]);
            actual = at;
        }

        // se a casa actual é o ponto de chega, finish
        if(this.open[actual].options.isEnd)
            return;


        let parents = this.ctrl.getParents(this.open[actual], this.grid);

        // computar o score F
        let F = this.height/this.scl+this.width/this.scl+999;
        let bestOne = null;

        // aumentar o esforço
        this.G++;

        this.ctrl.loopThroughParents(parents, (parent) => {

            // verificar se é parede
            if(parent.options.isObstacle)
                return;

            // verificar se já existe na lista de closed
            if(this.closed[(parent.options.y + parent.options.x * this.height) * 4])
                return;

            // computar os pontos
            parent.options.F = (this.G + 1) + ((this.height / this.scl) - parent.options.y - 1) + ((this.width / this.scl) - parent.options.x);
            
            // computar melhor potuação
            if(parent.options.F < F){
                
                F = parent.options.F;
                bestOne = parent;
            }
        });

        // se na lista de abertos só existe ponto a e não existe melhor casa para ir
        // então não tem como chegar no final
        if(this.open.length === 1 && !bestOne){

            // console.log('no way');
            return;
        }

        // se a melhor casa já tá na lista de open
        // siginifica que passei por ela e  voltar para ela é a melhor opção
        // então vou adicionar minha casa actual o closed para não volatar para ela
        // resetar o caminho, e começar do 0
        if(this.open[(bestOne.options.y + bestOne.options.x * this.height) * 4]){

            this.closed[actual] = this.open[actual];
            this.open = this.ctrl.reset(this.grid);
            this.G = 0;
            return;
        }

        // adicionando melhor caminho a lista de open
        this.open[(bestOne.options.y + bestOne.options.x * this.height) * 4] = bestOne;

        // se bestone é o final, DONE
        // if(bestOne.options.isEnd)
        //     console.log('end')
    }
}

export default AStar;
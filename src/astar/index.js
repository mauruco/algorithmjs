import Phaser from '../Phaser';
import controller from './controller';

class AStar extends Phaser.Scene {

    static config() {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0xEEEEEE,
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
        let obstaclePropability = 10;
        this.grid = this.ctrl.makeGrid(obstaclePropability);

        // lista aberto
        // lista de fechado
        // 1. começar adicionar o ponta de partida para lista de impossiveis
        // 2. escolher uma direção
        // 2. escolher a direção mais vantajosa
        // cada casa tem uma pontuação (G + H)
        // G é o custo para chegar na casa do ponto de partida (A) (casa do lado 1, casa do lado da do lado 2 etc..)
        // a cada casa andada G aumenta 1
        // qual esforço me custa chegar na próxima casa? Geralmente 1, a segunda2. Mas pode depender do game. atravessa diagonal, agua etc pode custar mais!
        // H é o custo para a casa atual até o ponto de chegada (B) estimado pra chegar na chegada
        /*
            0  1  2  3  4
            A -> -> -> ->
                         | 5
                         | 6
                         | 7
                          B 8

            então a casa (4) tem um custo de (quatro passos para cheagr até + um estimado 4 passos para chegar na chegada)

        */
        // então a pontução de cada casa é o custo que tive pra chegar nela mais o custo que tenho da casa pra chegar na chegada (B)
        // Quanto mais perto do H o G estiver mais curta é a distância
        // Mas pode ter momentos que H (off) tá desligado, então o caminho acha talvez não seja o mais curto
        // F = (G + H)
        //
        // Então  o algoritimo começa
        // 1. Vamos pegar a casa com a menor pontuação (F) da lista de aberto
        // 2. Vamos chamar essa casa de (S)
        // 3. Remova (S) da lista de aberto e adicione a lista de fechado
    }
}

export default AStar;
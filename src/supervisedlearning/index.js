import Phaser from '../Phaser';
import { pixel } from '../tools';
import NeuralNetwork from './NeuralNetwork'; 

class SupervisedLearning extends Phaser.Scene {
    
    static config = () => {
    
        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0xFFFFFF,
            scene: [SupervisedLearning]
        };
    };
    
    constructor() {
    
        super({key: 'SupervisedLearning'});
    }

    create() {

        // entrada são numeros entre 0 e 1
        // saida saõ numeros entre 0 e 1

        this.scl = 5;
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.graph = this.add.graphics();

        this.nn = new NeuralNetwork(2, 4, 1, 0.1);

        window.nn = this.nn;

        this.training = [
            {
                inputs: [0,0],
                outputs: [0]
            },
            {
                inputs: [1,0],
                outputs: [1]
            },
            {
                inputs: [0,1],
                outputs: [1]
            },
            {
                inputs: [1,1],
                outputs: [0]
            },
        ];
    }
    
    update() {
        
        this.graph.clear();

        for(let i = 0; i < 1000; i++){

            let data = this.training[Math.floor(Math.random()*this.training.length)];
            this.nn.train(data.inputs, data.outputs);
        }

        for(let i = 0; i < this.width/this.scl; i++){
            for(let j = 0; j < this.height/this.scl; j++){

                let ip1 = i / (this.height/this.scl); // i / rows
                let ip2 = j / (this.height/this.scl); // j / cols

                let inputs = [ip1, ip2];

                let y = this.nn.predict(inputs);
                y = Math.floor(y[0] * 255 + 1);

                pixel(this.graph, i*this.scl, j*this.scl, y, y, y, 1, 10);
            }
        }
    }
}

export default SupervisedLearning;
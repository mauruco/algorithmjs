import Phaser from '../Phaser';
import Perc from './Perceptron';
import controller from './controller';

class Perceptron extends Phaser.Scene {

    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0xEDEDED,
            scene: [Perceptron]
        };
    };

    constructor() {

        super({key: 'Perceptron'});
    }

    preload() {

        this.load.image('cartesian', 'assets/cartesian.png');
    }

    create() {

        // scene com cartesian clássico (y tá invertido)  
        /*          y
            -x     |        x
            <-------------->
                   |-y      */
    
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.add.image(0, 0, 'cartesian');
        this.camera = this.cameras.add(0, 0, this.width, this.height);
        this.camera.centerOn(0, 0);
        this.camera.setBackgroundColor(0xEDEDED);
        this.graph = this.add.graphics();
        this.ctrl = controller(this);

        // isso é um aformula clásica pra uma linha
        /*
            m e b são cosntantes desejadas
            y = mx + b;
        */
        // y = 0.3 * x + 0.2;
        // calculo q sepra os dados
        this.calcY = (x) => 0.3 * x + 0.2;

        this.points = this.ctrl.makePoints(1000, this.calcY);
        this.perc = new Perc();

        this.i = 0;
    }

    update() {

        // this.i++;
        // if(this.i < 10)
        //     return;
        // this.i = 0;

        this.graph.clear();
        this.ctrl.drawLine(this.calcY);
        // pintando uma linha imaginaria do perceptron
        this.ctrl.drawPerceptronLine(this.perc.weights, this.calcY);

        for(let i = 0; i < this.points.length; i++){

            let inputs = [this.points[i].input1, this.points[i].input2, this.points[i].BIAS];
            let correctAnswer = this.points[i].correctAnswer;
            let output = this.perc.guessAndTrain(inputs, correctAnswer);
            this.ctrl.drawPoint([this.points[i].x, this.points[i].y], output);
        }
    }
}

export default Perceptron;
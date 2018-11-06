import Phaser from '../Phaser';
import Ball from './Ball';

class Wave extends Phaser.Scene {

    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x000000,
            scene: [Wave]
        };
    };

    constructor() {
        
        super({key: 'Wave'});
    }

    text() {

        let opt = document.getElementById('opt');
        opt.innerHTML = '<span class="inline">Seno e cosseno trabalhando juntos!</span>';
    }

    create() {

        this.text();

        this.balls = [];
        for(let i = 0; i < 600; i++)
            this.balls.push(new Ball(this, i, 300, 2));

        this.frequency = 0.1;
        this.frequency2 = 0.1;
        this.amplitude = 25;
    }
    
    update() {

        let beforeFrequency = this.frequency;


        for(let i = 0; i < this.balls.length; i++) {

            this.balls[i].y = this.amplitude * Math.sin(this.frequency);
            this.frequency += 0.5;
        }

        for(let i = 0; i < this.balls.length; i++) {

            this.balls[i].y += this.amplitude * Math.cos(this.frequency2);
            this.frequency2 += 0.3;
        }
        
        for(let i = 0; i < this.balls.length; i++) {
            this.balls[i].y += 300;
            this.balls[i].update();
        }

        this.frequency = beforeFrequency + 0.101;
        this.frequency2 = beforeFrequency + 0.102;
    }
}

export default Wave;
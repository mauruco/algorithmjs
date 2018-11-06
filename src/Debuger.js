import Phaser from './Phaser';

class Debuger extends Phaser.Scene {

    static config = () => {

        setTimeout(() => {

            let canvas = document.getElementsByTagName('canvas')[0];
            canvas.className = 'canvas-border';
        });
    };

    constructor() {

        super({
            key: 'Debuger',
            // active: false,
            // visible: true,
            // pack: false,
            // cameras: null,
            // map: {},
            // physics: {},
            // loader: {},
            // plugins: false,
            // input: {},
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                    gravity: { y: 500 }
                }
            }
        });
    }

    preload() {

        this.load.image('block', 'assets/ready.png');
    }

    create() {

        let block = this.physics.add.image(400, 100, 'block');

        block.setVelocity(100, 200);
        block.setBounce(1, 1); // faz ao colidir, refletir. Se não colide e fica colado a chão/parede
        block.setCollideWorldBounds(true);

        this.txtFps = this.add.text(10, 10, 'fps: 0', { fontSize: '10px', fill: '#000' });
        this.timeElapsed = this.add.text(10, 25, 'time: 0', { fontSize: '10px', fill: '#000' });
        this.delta = this.add.text(10, 40, 'delta: 0', { fontSize: '10px', fill: '#000' });
        // this.delta2 = this.add.text(10, 55, 'delta2: 0', { fontSize: '10px', fill: '#000' });
    }

    update(time, delta) {

        this.txtFps.setText('fps: '+this.game.loop.actualFps);
        this.timeElapsed.setText('time: '+time);
        this.delta.setText('delta: '+delta);
        // this.delta2.setText('delta2: '+time/this.game.loop.actualFps);
    }
}

export default Debuger;
import Phaser from '../Phaser';
import controller from './controller';

class Pathfinderfluid extends Phaser.Scene {
    
    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x000000,
            scene: [Pathfinderfluid]
        };
    };

    constructor() {

        super({key: 'Pathfinderfluid'});
        this.ctrl = controller(this);
    }

    create() {

        this.ctrl.text();
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 50;
        this.grid = this.ctrl.makeGrid(this.width, this.height, this.scl);

        console.log(this.grid);

        this.i = 0;
    }

    update() {

        this.i++;
        if(this.i < 30)
            return;
        this.i = 0;
    }
}

export default Pathfinderfluid;
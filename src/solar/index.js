import Phaser from '../Phaser';
import controller from './controller';

class Solar extends Phaser.Scene {

    worldWH = 0;
    planet = {};
    planetSpeed = 1;
    moon = {};
    moonSpeed = 4;
    config = {
        x: 0,
        y: 0,
        lineStyle: {
            width: 1,
            color: 0x666666,
            alpha: 1
        },
        fillStyle: {
            color: 0x666666,
            alpha: 1
        },
        add: true
    };

    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0xEEEEEE,
            scene: [Solar]
        };
    };

    constructor() {

        // scene key
        super({key: 'Solar', backgroundColor: 0xEEEEEE});
    }

    preload() {

        this.load.image('sun', 'assets/solar/sun.png');
        this.load.image('earth', 'assets/solar/earth.png');
        this.load.image('moon', 'assets/solar/moon.png');
    }

    create() {

        this.ctrl = controller(this);
        this.ctrl.text();
        this.worldWH = this.game.config.width;
        this.planet = this.ctrl.newPlanet(200);
        this.planet = this.ctrl.planetOrbit(this.planet, this.planetSpeed);
        this.moon = this.ctrl.newMoon(70);

        let camera = this.cameras.add(0, 0, this.worldWH, this.worldWH);
        camera.transparent = false;
        camera.setBackgroundColor(0x000000);
        camera.centerOn(0,0);
    }
    
    update() {

        this.planet = this.ctrl.planetOrbit(this.planet, this.planetSpeed);
        this.moon = this.ctrl.moonOrbit(this.moon, this.planet, this.moonSpeed);
    }
}

export default Solar;

import Phaser from '../Phaser';
import controller from './controller';
import PerlinNoise from './PerlinNoise';

class Noise extends Phaser.Scene {

    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x000000,
            scene: [Noise]
        };
    };

    defaultStyles = {lineStyle: {width: 1, color: 0x000000, alpha: 1}, fillStyle: { color: 0x000000, alpha: 1}};

    constructor() {
        
        super({key: 'Noise'});
    }

    create() {

        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 20;
        this.noise = new PerlinNoise();
        this.invert = false;
        this.count = 0;
        
        this.ctrl = controller(this);
        this.ctrl.text();
        this.grid = this.ctrl.makeGrid(this.scl, this.width, this.height);

        this.graph = this.add.graphics();
        this.graph.setDefaultStyles(this.defaultStyles);


        this.ctrl.simpleNoise3d(this.grid, this.graph);
        // this.ctrl.simpleNoise3dUpdate(this.noise, this.grid, this.invert);
        
        this.particles = this.ctrl.makeParticles(this.width, this.height);

        this.points = this.ctrl.simpleNoiseGraph(this.noise, this.width);

        // this.graph.clear();
        // this.ctrl.perlinNoise(this.noise, this.graph, this.width, this.height);
    }


    update() {
        
        // this.graph.clear();
        // invert force
        if(this.count % 480 === 0) {
            
            this.invert = this.invert ? false : true;
            this.count = 0;
            // console.log('invert')
        }
        this.count++;

        this.ctrl.simpleNoise3dUpdate(this.noise, this.grid, this.invert);
        this.ctrl.updateParticles(this.particles, this.grid, this.width, this.height, this.scl, this.graph);
        // this.ctrl.simpleNoiseGraphUpdate(this.noise, this.points, this.graph, this.height, 200);
    }
}

export default Noise;
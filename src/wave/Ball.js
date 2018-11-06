import Phaser from '../Phaser';
import Vector from '../Vector';

class Ball extends Vector{

    defaultStyle = {
        lineStyle: {
            width: 3,
            color: 0x666666,
            alpha: 1
        },
        fillStyle: {
            color: 0x666666,
            alpha: 1
        }
    };

    constructor(scene, x, y, radius) {

        super(x, y);

        this.scene = scene;
        this.radius = radius;

        this.circle = new Phaser.Geom.Circle(this.x, this.y, this.radius);
        this.graph = this.scene.add.graphics();
        this.graph.setDefaultStyles(this.defaultStyle);
        this.graph.strokeCircleShape(this.circle);
    }

    update() {

        this.updateGraph();
    }

    updateGraph() {

        this.circle.setTo(this.x, this.y, this.radius);
        this.graph.clear();
        this.graph.setDefaultStyles(this.defaultStyle);
        this.graph.strokeCircleShape(this.circle);
    }
}

export default Ball;
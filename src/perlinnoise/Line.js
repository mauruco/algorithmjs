import Phaser from '../Phaser';

class Line{

    constructor(graph, x, y, dirX, dirY) {

        this.graph = graph;
        this.x = x;
        this.y = y;
        this.force = {x: dirX, y: dirY};
        this.line = new Phaser.Geom.Line(this.x, this.y, this.x + dirX, this.y + dirY);
        this.point = new Phaser.Geom.Point(this.x, this.y);
    }
    
    update(dirX, dirY, mult) {

        this.force = {x: dirX * mult, y: dirY * mult};

        // this.line.setTo(this.x, this.y, this.x + dirX, this.y + dirY);
        // this.graph.lineStyle(1, 0x000000, 0.1);
        // this.graph.fillStyle(0x000000, 0.1);
        // this.graph.strokeLineShape(this.line);
        // this.graph.fillPointShape(this.point, 3);
    }
}

export default Line;
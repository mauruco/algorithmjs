import Phaser from '../Phaser';
import Vector from '../Vector';
import { random } from '../helpers';

class Particle extends Vector {

    constructor(x, y) {

        super(x, y);
        this.velocity = new Vector(0,0);
        this.acceleration = new Vector(0,0);
        this.particle = new Phaser.Geom.Point(x, y);
    }

    reset(x, y) {

        this.x = x;
        this.y = y;
        this.velocity = new Vector(0,0);
        this.acceleration = new Vector(0,0);
        this.particle.setTo(x,y);
    }

    follow(grid, scl, width, height, graph) {

        let forceX = (scl/2);
        let forceY = (scl/2);

        forceX = Math.floor(this.x / scl ) * scl + (scl/2);
        forceY = Math.floor(this.y / scl ) * scl + (scl/2);

        if(forceX === width + (scl/2))
            forceX = width - (scl/2)
        if(forceY === height + (scl/2))
            forceY = height - (scl/2)
        
        this.acceleration.add(grid[forceY][forceX].line.force);

        this.update(width, height, graph);
    }
    
    update(width, height, graph) {
        
        this.acceleration.normalize();
        this.acceleration.mult(5);
        
        this.velocity.add(this.acceleration);

        this.velocity.limit(3);

        this.add(this.velocity);
        this.acceleration.mult(0);
        
        this.particle.setTo(this.x, this.y);
        graph.fillStyle(0xFFFFFF, 0.01); 
        graph.fillPointShape(this.particle, 5);

        // if(this.x <= 0){

        //     this.x = width;
        //     this.y = random(0, height);
        // }

        // if(this.x >= width){

        //     this.x = 0;
        //     this.y = random(0, height);
        // }

        // if(this.y >= height){

        //     this.y = 0;
        //     this.x = random(0, width);
        // }

        // if(this.y <= 0){

        //     this.y = height;
        //     this.x = random(0, width);
        // }

        if(this.x <= 0 || this.x >= width)
            this.x = random(1, width);

        if(this.y <= 0 || this.y >= height)
            this.y = random(1, height);
    }
}

export default Particle;
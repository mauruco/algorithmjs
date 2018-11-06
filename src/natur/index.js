import Phaser from '../Phaser';
import Vector from '../Vector';
import Ball from './Ball';

class Natur extends Phaser.Scene {

    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0xFFFFFF,
            scene: [Natur]
        };
    };

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

    constructor() {
        
        super({key: 'Natur'});
    }

    init() {
    }
    
    preload() {

        this.load.image('water', 'assets/natur/water.png');

    }

    create() {

        this.world = {x: 600, y: 600};
        this.water = this.add.image(75, 500, 'water');
        
        this.lightBall = new Ball(this, 40, 50, 5, this.world, true);
        this.bigBall = new Ball(this, 90, 50, 10, this.world, true);

        this.sun = new Ball(this, 400, 400, 25, this.world);
        this.planet = new Ball(this, 300, 300, 5, this.world);
        this.planet.applyForce({x: 15, y: 0}); // força inicial

        this.mouseFowler = new Ball(this, 10, 10, 10, this.world);
        this.mouseFowler.mass = 0.1;


        this.pointer = this.input.manager.activePointer;
        // let camera = this.cameras.add(0, 0, 600, 600);
        // camera.transparent = false;
        // camera.setBackgroundColor(0x000000);
        // camera.zoom = 0.25;
        // // camera.centerOn(0,0);


        // oscilação
        this.o = new Ball(this, 300, 50, 20, this.world);
        this.o.angleAcceleration = 0.1;


        //  polar coordinates
        // r é a maginetude
        // a é o angulo (radians)
        // y = r * sin(a)
        // x = r * cos(a)

        this.r = 100;
        this.a = 0.0;

        this.rect = new Phaser.Geom.Rectangle(this.r * Math.cos(this.a), this.r * Math.sin(this.a), 50, 50);
        this.rect.setTo(this.r * Math.cos(this.a), this.r * Math.sin(this.a), 50, 50);
        this.graph = this.add.graphics();
        this.graph.setDefaultStyles(this.defaultStyle);
        this.graph.strokeRectShape(this.rect);
        // translate
        this.graph.x += 300;
        this.graph.y += 300;
    }
    
    update(time) {

        // console.log(time)

        // atração para o mouse
        this.mouse = new Vector(this.pointer.x, this.pointer.y);
        this.mouse.sub(this.mouseFowler);
        this.mouse.setMagnetude(0.5);
        this.mouseFowler.applyForce(this.mouse);
        this.mouseFowler.update();

        // resistencia de agua
        let gravity = new Vector(0, 0.1);
        
        this.lightBall.applySimplegravity(gravity);
        this.bigBall.applySimplegravity(gravity);
        let waterCoeficiente = 0.9;

        if(this.lightBall.y + this.lightBall.radius >=  400){

            let ballM2 = this.lightBall.velocity.magnetude();
            ballM2 = ballM2**2;
            let lightBallWaterResistence = new Vector(0, -0.5 * ballM2 * waterCoeficiente);
            this.lightBall.applyForce(lightBallWaterResistence);
        }

        if(this.bigBall.y + this.bigBall.radius >=  400){

            let ballM2 = this.bigBall.velocity.magnetude();
            ballM2 = ballM2**2;
            let bigBallWaterResistence = new Vector(0, -0.5 * ballM2 * waterCoeficiente);
            this.bigBall.applyForce(bigBallWaterResistence);
        }

        this.lightBall.update();
        this.bigBall.update();

        // gravidade de atraction
        let toSun = new Vector(this.sun.x, this.sun.y);
        toSun.sub(this.planet);
        let mag = toSun.magnetude();

        let atraction = ((this.sun.mass*this.planet.mass)/mag**2) * mag;
        toSun.setMagnetude(atraction);


        this.planet.applyForce(toSun);
        this.planet.update();


        // oscilação
        // sin é um sinus e sempre retorn um valor entre 1 e -1
        // anplitude é o valor da ponta mais baixa para ponto mais alta do sinus (imagine uma magnetude)
        // frequência é a taxa de atulização
        let anplitude = 100;
        let frequency = this.o.angleVelocity;
        this.o.x = anplitude * Math.sin(frequency);
        this.o.x += 300;
        this.o.angleAcceleration += 0.1;
        this.o.update();

        // polar coodirnates
        this.a += 0.1;
        this.rect.setTo(this.r * Math.cos(this.a), this.r * Math.sin(this.a), 50, 50);
        this.graph.clear();
        this.graph.setDefaultStyles(this.defaultStyle);
        this.graph.strokeRectShape(this.rect);
    }
}

export default Natur;
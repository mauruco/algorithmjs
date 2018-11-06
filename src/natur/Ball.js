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

    constructor(scene, x, y, mass, world, onBounds = false) {

        super(x, y);

        //
        /*
            Como força é aplicada em um objeto
            1. force divided by mass
            2. acceleration add force
            3. velocity add acceleration
            4. acceleration reset after all frame
        */

        // newtons 2nd law
        /*
            acceleration = force / mass
        */

        // froça da gravidade
        /*  
            fa = força de atração
            m1 = massa do primeiro objeto
            m2 = massa do segundo objeto
            d  = distância entre m1 e m2 (magnetude da distancia)
            G  = Constante global universal de gravitação (0.3) (simplificar use 1)
            r  = vector qua aponta para direção ( mover para atractor ) r = atractor.sub(mover)
            
            fa = m1 * m2 * G
                ------------- * r
                    d²

            // forma simplificada gravidade simples
            se m1 e m2 == 1, e a distância pode ser deixada de lado (d tbm seria = 1)
            fa = m1 * G

            // gravidade de atraction

            let direction = atractor.get();
            direction.sub(mover);
            let mag = direction.magnetude();
            let magNorm = direction.normalize()
            fa = (atractor.mass * mover.mass * g(1))
                ------------------------------------  * magNormalizada
                            mag²
        */  

        // força de friction
        /*

            f = friction
            ṽ  = vector de velocidade normalizado
            M =  (M) é o coeficiente da friction (a superfice de gelo tem menor que papel lixa)
            ||N|| = (normal força) é a constante de friction = 1
            

            f = -1 * (M||N||) *  ṽ

            expl:

            let friction = ball.velocity.get();
            friction.normalize();
            // coeficiente
            friction.mul(0.1);
            a força é aplicada na direção contrtaria
            friction.mul(-1);
            ball.applyForce(friction);
        */
           
        // drag force (ar, água, fluidos e gases)
        /*
           fg = drag force
           r = (row) densidade
           ||v||² = magnitude da velocide ao quadadro
           a = area de superfice
           cd = coeficiente da desindade
           ṽ = velocidade normalizada
           
           fg = -(1/2) * r * ||v||² * a * cd * ṽ
           
           podemos facilitar nossa vide dizendo q a superfice de os objetos é sempre igual
           fg = -cd * ||v||² * ṽ

           expl:

           let drag = ball.velocity.get();
           // algum coeficiente (água sera miaro q gás)
           c = 0.1;
           v² = drag.magnetude() * drag.magnetude();
           drag.normalize();
           drag.mult(-1);
           drag.mul(c);
           drag.mul(v²);
           ball.applyForce(drag);
        */

        this.scene = scene;
        this.velocity = new Vector(0,0);
        this.acceleration = new Vector(0,0);
        this.mass = mass;
        this.radius = mass * 1;
        
        this.angle = 0;
        this.angleVelocity = 0;        
        this.angleAcceleration = 0;

        this.world = world;
        this.onBounds = onBounds;

        this.circle = new Phaser.Geom.Circle(this.x, this.y, this.radius);
        this.graph = this.scene.add.graphics();
        this.graph.setDefaultStyles(this.defaultStyle);
        this.graph.strokeCircleShape(this.circle);
    }

    applyForce(vForce) {

        // worldbounds
        if(this.y + this.radius >= this.world.y )
        vForce.y = 0;
        
        let force = new Vector(vForce.x, vForce.y);
        force.div(this.mass);
        this.acceleration.add(force);
    }

    applySimplegravity(vForce) {

        // worldbounds
        if(this.onBounds && this.y + this.radius >= this.world.y )
        vForce.y = 0;
        
        let force = new Vector(vForce.x, vForce.y);
        this.acceleration.add(force);
    }
    
    update() {

        this.angleVelocity += this.angleAcceleration;

        
        this.velocity.add(this.acceleration);
        this.add(this.velocity);
        
        // worldbounds
        if(this.onBounds && this.y + this.radius >= this.world.y)
            this.velocity = new Vector(this.velocity.x, 0);

        this.updateGraph();
        this.acceleration.mult(0);
        this.angleAcceleration = 0;
    }

    updateGraph() {

        this.circle.setTo(this.x, this.y, this.radius);
        this.graph.clear();
        this.graph.setDefaultStyles(this.defaultStyle);
        this.graph.strokeCircleShape(this.circle);
    }
}

export default Ball;
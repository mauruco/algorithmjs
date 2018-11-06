import Phaser from '../Phaser';
import { mapRange } from '../helpers';
import { pixel } from '../tools';

class Supershape extends Phaser.Scene {

    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0xFFFFFF,
            scene: [Supershape]
        };
    };

    defaultStyles = {lineStyle: {width: 1, color: 0x000000, alpha: 1}, fillStyle: { color: 0x000000, alpha: 1}};

    constructor() {
        
        super({key: 'Supershape'});
    }

    preload() {

        this.load.image('background', 'assets/supershape/background.png');
    }

    text() {

        let opt = document.getElementById('opt');
        opt.innerHTML = '<span class="inline">Supershape!</span>';
    }

    supershape(theta, m, n) {

        if(!theta)
            return 0;

        let n1, n2, n3;
        let a = 1;
        let b = 1;

        n1 = n2 = n3 = n;

        let part1 = Math.abs((1/a) * Math.cos(m/4*theta))**n2;
        let part2 = Math.abs((1/b) * Math.sin(m/4*theta))**n3;
        let radius = (part1+part2)**-(1/n1);

        // let part1 = Math.abs((1/a) * Math.cos(m/4*theta))**n2;
        // let part2 = Math.abs((1/b) * Math.cos(m/4*theta))**n3;
        // let radius = (part1+part2)**(1/n1);

        return radius;
    }

    doShape(m, n) {

        let steps = 360;
        let theta = 0;
        let increase = 0.1;
        let amplitude = 100;

        for(let i = 0; i < steps/increase; i++) {

            let r = this.supershape(theta, m, n);

            let x = amplitude * r * Math.cos(theta);
            let y = amplitude * r * Math.sin(theta);

            pixel(this.graph, x + this.width/2, y + this.height/2, 0, 0, 0);
            theta += increase;
        }
    }

    create() {

        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.mouse = this.input.mousePointer;
        this.graph = this.add.graphics();
        this.graph.setDefaultStyles(this.defaultStyles);
        this.text();
        
        this.back = this.add.image(this.width/2, this.height/2, 'background');
        this.m = this.add.text(40, 20, 'm = 0', { fontSize: '12px', color: '#000000', backgroundColor: '#FFFFFF' });
        this.n = this.add.text(40, 35, 'n = 0', { fontSize: '12px', color: '#000000', backgroundColor: '#FFFFFF' });
    }
    
    update() {

        this.graph.clear();
        let m = Math.ceil(mapRange(this.mouse.x, 1, this.width, 1, 6));
        let n = mapRange(this.mouse.y, 1, this.height, 0, 1);
        if(m < 0)
        m = 0;
        if(n < 0)
        n = 0.5;
        this.doShape(m, n);
        
        this.m.text = 'm = '+m;
        this.n.text = 'n = '+n;
    }
}

export default Supershape;
import Phaser from '../Phaser';

class Display extends Phaser.Scene {
    
    static config = () => {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x000000,
            scene: [Display]
        };
    };

    constructor() {

        super({key: 'Display'});
    }

    text() {

        let opt = document.getElementById('opt');
        opt.innerHTML = '<span class="inline">Display de 7 segmentos!</span>';
    }

    display (graph, width, height) {

        /*
             --
            |  |
             --
            |  |
             --
            
            a =    --
            f = |    b = |
            g =    --
            e = |    c = |
            d =    --

            D    	abcdefg	    a	    b	    c	    d	    e	    f	    g
            0	    0x7E	    on	    on	    on	    on	    on	    on	    off
            1	    0x30	    off	    on	    on	    off	    off	    off	    off
            2	    0x6D	    on	    on	    off	    on	    on	    off	    on
            3	    0x79	    on	    on	    on	    on	    off	    off	    on
            4	    0x33	    off	    on	    on	    off	    off	    on	    on
            5	    0x5B	    on	    off	    on	    on	    off	    on	    on
            6	    0x5F	    on	    off	    on	    on	    on	    on	    on
            7	    0x70	    on	    on	    on	    off	    off	    off	    off
            8	    0x7F	    on	    on	    on	    on	    on	    on	    on
            9	    0x7B	    on	    on	    on	    on	    off	    on	    on
            A	    0x77	    on	    on	    on	    off	    on	    on	    on
            b	    0x1F	    off	    off	    on	    on	    on	    on	    on
            C	    0x4E	    on	    off	    off	    on	    on	    on	    off
            d	    0x3D	    off	    on	    on	    on	    on	    off	    on
            E	    0x4F	    on	    off	    off	    on	    on	    on	    on
            F	    0x47	    on	    off	    off	    off	    on	    on	    on
        */

        let w = 50;
        let h = 10;

        this.a = new Phaser.Geom.Rectangle(this.width/2-w/2, this.height/2-h/2-h-w, w, h);
        this.b = new Phaser.Geom.Rectangle(this.width/2-h/2+w/2+h/2, this.height/2-w-h/2, h, w);
        this.c = new Phaser.Geom.Rectangle(this.width/2+w/2, this.height/2+h/2, h, w);
        this.d = new Phaser.Geom.Rectangle(this.width/2-w/2, this.height/2+h/2+w, w, h);
        this.e = new Phaser.Geom.Rectangle(this.width/2-h-w/2, this.height/2+h/2, h, w);
        this.f = new Phaser.Geom.Rectangle(this.width/2-h-w/2, this.height/2-w-h/2, h, w);
        this.g = new Phaser.Geom.Rectangle(this.width/2-w/2, this.height/2-h/2, w, h);

        graph.fillStyle(0x666666);
        graph.fillRectShape(this.a);
        graph.fillRectShape(this.b);
        graph.fillRectShape(this.c);
        graph.fillRectShape(this.d);
        graph.fillRectShape(this.e);
        graph.fillRectShape(this.f);
        graph.fillRectShape(this.g);
    }

    reset(graph) {

        graph.fillStyle(0x666666);
        graph.fillRectShape(this.a);
        graph.fillRectShape(this.b);
        graph.fillRectShape(this.c);
        graph.fillRectShape(this.d);
        graph.fillRectShape(this.e);
        graph.fillRectShape(this.f);
        graph.fillRectShape(this.g); 
    }

    show(graph,n) {

        graph.fillStyle(0xFF0000);

        /*        
            1   1   1   1   1   1   1   1
            .   a   b   c   d   e   f   g

            EXPL:

            O numero 5 (abcdefg) == 0x5B
            0x5B seriea em bytes == 1011011

            eu pego o primeiro byte [1]011011
            empurro para direta 6vz (>> 6)
            e assim o byte inteiro agora só é um só [1]  (o contrário << resulta em um numero maior expl: [1]011011 << 2 === [1]01101100 )
            pq os outros numeros a diereita do primeiro foram excluidos
            agora eu poso fazer um operação AND (&)

            n1	n2	igual	
            0	0	0	
            0	1	0	
            1	0	0	
            1	1	1

            se o byte [1] & 1 for 1 então a posição é true.

            agora o mesmo exemplo com o segundo byte 1[0]11011

            1[0]11011 >> 5 = 1[0]

            1[0] & 1 == ?
            
            n1  n2  igual
            10  01  00
        */

        // a
        if(n >> 6 & 1)
            graph.fillRectShape(this.a);
        // b
        if(n >> 5 & 1)
            graph.fillRectShape(this.b);
        // c
        if(n >> 4 & 1)
            graph.fillRectShape(this.c);
        // d
        if(n >> 3 & 1)
            graph.fillRectShape(this.d);
        // e
        if(n >> 2 & 1)
            graph.fillRectShape(this.e);
        // f
        if(n >> 1 & 1)
            graph.fillRectShape(this.f);
        // g
        if(n & 1)
            graph.fillRectShape(this.g);

    }

    create() {

        this.text();
        this.width  = this.game.config.width;
        this.height  = this.game.config.height;
        this.graph = this.add.graphics();
        this.display(this.graph, this.width, this.height);

        this.numbers = [0x7E,0x30,0x6D,0x79,0x33,0x5B,0x5F,0x70,0x7F,0x7B];
        this.index = 0;

        this.i = 0;
    }

    update() {

        this.i++;
        if(this.i < 30)
            return;
        this.i = 0;

        this.graph.clear();
        this.reset(this.graph);
        this.show(this.graph, this.numbers[this.index]);
        this.index++;
        if(this.index > this.numbers.length - 1)
            this.index = 0;
    }
}

export default Display;
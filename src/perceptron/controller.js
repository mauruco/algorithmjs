import Phaser from '../Phaser';
import { mapRange } from '../helpers';

const controller = (scene) => {

    return {

        pixelX: (x) => mapRange(x, -1, 1, -(scene.width>>1), (scene.width>>1)),

        pixelY: (y) =>  mapRange(y, -1, 1, (scene.height>>1), -(scene.height>>1)),

        drawLine: (calcY) => {

            // a fronteira é milha linha que separa os dados
            // a linha vem a partir de um calculo de como separa cada dados
            // expl: y = 3x + 2  // mapeado para  minha -1 até um coordenadas y = 0.3x + 0.2

            let x1 = -1;
            let y1 = calcY(x1);
            let x2 = 1;
            let y2 = calcY(x2);

            // inverti y pra bater com cartesian clássico
            // let line = new Phaser.Geom.Line(mapRange(x1, -1, 1, -(scene.width>>1), mapRange(y1, -1, 1, (scene.height>>2), -(scene.height>>2)),(scene.width>>1)), mapRange(x2, -1, 1, -(scene.width>>1), (scene.width>>1)), mapRange(y2, -1, 1, (scene.height>>2), -(scene.height>>2)));
            let line = new Phaser.Geom.Line(
                scene.ctrl.pixelX(x1),
                scene.ctrl.pixelY(y1),
                scene.ctrl.pixelX(x2),
                scene.ctrl.pixelY(y2)
            );
            scene.graph.lineStyle(1, 0x666666);
            scene.graph.strokeLineShape(line); 
        },

        makePoints: (amount, calcY) => {

            let points = [];
            
            for(let i = 0; i < amount; i++){

                let x = (Math.random() * 2) - 1;
                let y = (Math.random() * 2) - 1;

                let yAbove = calcY(x);
                let correctAnswer = y > yAbove ? 1 : -1;

                points.push({
                    input1: x,
                    input2: y,
                    BIAS: 1,
                    x: scene.ctrl.pixelX(x),
                    y: scene.ctrl.pixelY(y),  // y tá invertido pra funcionar com cartisan clássico
                    correctAnswer
                });
            }

            return points;
        },

        drawPoint: (point, output = false) => {

            let color = 0x999999

            if(output === -1)
                color = 0xFF0000;

            if(output === 1)
                color = 0x00FF00;
            
            scene.graph.fillStyle(color);
            scene.graph.fillPointShape({x: point[0], y:point[1]}, 3);
        },

        drawPerceptronLine: (weights, calcY) => {

            let x1 = -1;
            let y1 = calcY(x1);
            let x2 = 1;
            let y2 = calcY(x2);

            y1 = (-weights[2] - (x1 * weights[0])) / weights[1];
            y2 = (-weights[2] - (x2 * weights[0])) / weights[1];

            let line = new Phaser.Geom.Line(
                scene.ctrl.pixelX(x1),
                scene.ctrl.pixelY(y1),
                scene.ctrl.pixelX(x2),
                scene.ctrl.pixelY(y2)
            );
            scene.graph.lineStyle(1, 0x0000FF);
            scene.graph.strokeLineShape(line);
            /*
            x1 * Weight1 + y1 * Weight2 + WeightBias * 1 = 0

            y1 = (- WeightBias - (x1 * Weight1)) / Weight2
            */
        }
    };
};

export default controller;
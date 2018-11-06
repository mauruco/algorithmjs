import Phaser from '../Phaser';
import Line from './Line';
import Particle from './Particle';
import { random, mapRange } from '../helpers';
import { pixel } from '../tools';

const controller = (scene) => {

    return {

        text: () => {

            let opt = document.getElementById('opt');
            opt.innerHTML = '<span class="inline">A suavidade de Perlin Noise!</span>';
        },

        simpleNoiseGraph: (noise, width) => {

            let points = [];

            let yoff = 0.01;

            for(let i = 0; i < width; i++){

                let point = {
                    
                    yoff: noise.noise2d(0.01, yoff),
                    point: new Phaser.Geom.Point(0,0)
                }

                points.push(point);
                yoff += 0.01;
            }

            return points;
        },

        simpleNoiseGraphUpdate: (noise, points, graph, height, amplitude) => {

            let first = points.shift();

            first.yoff = points[points.length-1].yoff + 0.01;

            points.push(first);

            for(let x = 0; x < points.length; x++) {

                let y =  noise.noise2d(0.01, points[x].yoff);

                points[x].point.setTo(x, y * amplitude + height / 2);
                graph.fillStyle(0x000000, 1); 
                graph.fillPointShape(points[x].point);
            }
    
            graph.strokePoints(points);
        },

        makeGrid: (scl, width, height) => {

            let grid = [];
            let rows = width / scl;
            let cols = height / scl;

            for(let y = 0; y < rows; y++){
        
                let ypos = y * scl + scl / 2;
                grid[ypos] = [];
    
                for(let x = 0; x < cols; x++){
    
                    let xpos = x * scl + scl / 2;
                    grid[ypos][xpos] = {};
                }
            }

            return grid;
        },

        simpleNoise3d: (grid, graph) => {
    
            let amplitude = 0.1;
            let xoff = amplitude;
            let yoff = amplitude;
            let zoff = amplitude;

            for(let y in grid){
                for(let x in grid){

                    grid[y][x] = {

                        xoff: xoff,
                        yoff: yoff,
                        zoff: zoff,
                        line: new Line(graph, parseFloat(x), parseFloat(y), parseFloat(x), parseFloat(y))
                    };
                    xoff += amplitude;
                }
                xoff = amplitude;
                yoff += amplitude;
            }
        },

        simpleNoise3dUpdate: (noise, grid, invert) => {

            let mult = 1;
            if(invert)
                mult = -1;
       
            for(let y in grid) {
                for(let x in grid) {

                    // let angle = noise.noise3d(grid[y][x].xoff, grid[y][x].yoff, z) * Math.PI * Math.PI;
                    // let angle = noise.noise3d(grid[y][x].xoff, grid[y][x].yoff, z) * Math.PI;
                    let angle = noise.noise3d(grid[y][x].xoff, grid[y][x].yoff, grid[y][x].zoff) * 2;
                    // let angle = noise.noise3d(grid[y][x].xoff, grid[y][x].yoff, z);
                    let xdest = 10 * Math.cos(angle);
                    let ydest = 10 * Math.sin(angle);

                    grid[y][x].zoff += 0.001 * mult;
                    grid[y][x].line.update(xdest, ydest, mult);   
                }
            }
        },

        makeParticles: (width, height) => {

            let particles = [];
            for(let i = 0; i < 100; i++){

                let y =  (Math.random() * height * 2) >> 1 + i;
                y = y > height ? height : y;

                particles.push(new Particle((Math.random() * width * 2) >> 1, y));
            }

            return particles;
        },

        updateParticles: (particles, grid, width, height, scl, graph) => {

            for(let i = 0; i < particles.length; i++)
                particles[i].follow(grid, scl, width, height, graph);
        },

        perlinNoise(noise, graph, width, height) {

            let amplitude = 0.01;
            let yoff = amplitude;
            let xoff = amplitude;
    
            for(let y = 0; y < height; y++){
                
                for(let x = 0; x < width; x++){
    
                    let noiseValue = noise.noise3d(xoff, yoff, amplitude);
                    let color = mapRange(noiseValue, -1, 1, 0, 255);
                    
                    pixel(graph, x, y, color, color, color);
                    xoff += amplitude;
                }
                
                xoff = amplitude;
                yoff += amplitude;
            }
        }
    };
};

export default controller;
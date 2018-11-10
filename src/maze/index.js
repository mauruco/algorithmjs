import Phaser from '../Phaser';
import controller from './controller';
import { about } from '../tools';

class Maze extends Phaser.Scene {

    static config() {

        return {
            type: Phaser.AUTO,
            width: 600,
            height: 600,
            backgroundColor: 0x333333,
            scene: [Maze]
        };
    }

    constructor() {

        super({key: 'Maze'});
    }

    create() {
    
        this.ctrl = controller(this);
        about(['<span>Maze algoritmo Recursive backtracker.<span />']);
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 30;
        this.graph = this.add.graphics();
        this.grid = this.ctrl.makeGrid();
        this.grid = this.ctrl.getParents(this.grid);
        this.ctrl.loopThrough(this.grid, (spot) => {

            this.ctrl.drawSpot(spot);
        });
        
        this.current = this.grid[0][0];
        this.stack = [];

        this.done = false;
    }
    
    update() {

        if(this.done){

            this.ctrl.reload('DONE! RELOAD?');
            return;
        }

        // 4.1. Make the chosen cell the current cell and mark it as visited
        this.current.opt.visited = true;

        let unVisitedsParents = this.ctrl.getUnVisitedsParents(this.current);
        
        // 1. If the current cell has any neighbours which have not been visited
        if(unVisitedsParents.length) {
            
            // 1. Choose randomly one of the unvisited neighbours
            let randomParent = unVisitedsParents[Math.floor(Math.random() * unVisitedsParents.length)];
            
            // 2. Push the current cell to the stack
            this.stack.push(this.current);

            // 3. Remove the wall between the current cell and the chosen cell
            this.ctrl.removeWall(this.current, randomParent);

            // this.ctrl.drawSpot(this.current, true);
            this.ctrl.drawSpot(randomParent, true);
            this.ctrl.drawSpot(this.current);
            
            // 4. Make the chosen cell the current cell and mark it as visited
            this.current = randomParent;
            return;
        }

        this.ctrl.drawSpot(this.current);
        
        if(!this.stack.length){
            
            this.done = true;
            return;
        }
        
        // 2.  Else if stack is not empty
        // 2.1 Pop a cell from the stack
        // 2.2 Make it the current cell
        this.current = this.stack.pop();
    }
}

export default Maze;
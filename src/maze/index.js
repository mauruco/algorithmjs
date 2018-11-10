import Phaser from '../Phaser';
import controller from './controller';

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
        this.ctrl.about(['<span>Maze algoritmo Recursive backtracker.<span />']);
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.scl = 50;
        this.graph = this.add.graphics();
        this.grid = this.ctrl.makeGrid();
        this.ctrl.getParents(this.grid);
        this.ctrl.loopThrough(this.grid, (spot) => {
            this.ctrl.drawStop(spot);
        });
        
        this.current = this.grid[0][0];
        // this.current.opt.visited = true;
        this.stack = [];

        this.i = 0;
        this.j = 0;
        this.donw = false;
    }
    
    update() {
        this.i++;
        this.j++;
        if(this.i < 5)
            return;
        this.i = 0;

        if(this.done)
            return;
        
        if(!this.stack.length && this.j !== 1){
                
            console.log('reload')
            this.ctrl.reload();
            return;
        }

        let unVisitedsParents = this.ctrl.getUnVisitedsParents(this.current);

        // 1. If the current cell has any neighbours which have not been visited
        if(unVisitedsParents.length) {

            // this.done = true;
            
            // 1. Choose randomly one of the unvisited neighbours
            let randomParent = this.current.opt.parents[Math.floor(Math.random() * unVisitedsParents.length)];

            // 2. Push the current cell to the stack
            this.stack.push(this.current);

            // 3. Remove the wall between the current cell and the chosen cell
            this.ctrl.removeWall(this.current, randomParent);

            
            // 4. Make the chosen cell the current cell and mark it as visited
            this.current.opt.visited = true;
            randomParent.opt.visited = true;

            this.ctrl.drawStop(this.current, true);
            this.ctrl.drawStop(randomParent);

            this.current = randomParent;
            
            // console.log(this.current.opt.walls, randomParent.opt.walls)

            // console.log(randomParent)
            // console.log(this.current.opt.parents[0])
            return;
        }

        console.log('aqui')
        this.stack.pop();

        // if(check)
        //     this.stack.push(this.current);
    }
}

export default Maze;
import Phaser from './Phaser';
import Solar from './solar';
import Debuger from './Debuger';
import Natur from './natur';
import Wave from './wave';
import Noise from './perlinnoise';
import Supershape from './supershape';
import Display from './display';
import Pathfinderfluid from './pathfinderfluid';
import Perceptron from './perceptron';
import SupervisedLearning from './supervisedlearning';
import AStar from './astar';
import Maze from './maze';

export const sceneLoader = () => {

    let hash = window.location.hash;
    let menu = document.getElementById('menu');
    if(!hash)
        menu.style.display = 'block';

    if(hash === '#debuger')
        new Phaser.Game(Debuger.config());
    
    if(hash === '#solar')
        new Phaser.Game(Solar.config()); 
    
    if(hash === '#naturforce')
        new Phaser.Game(Natur.config());
    
    if(hash === '#wave')
        new Phaser.Game(Wave.config());
    
    if(hash === '#noise')
        new Phaser.Game(Noise.config());
    
    if(hash === '#supershape')
        new Phaser.Game(Supershape.config());

    if(hash === '#display')
        new Phaser.Game(Display.config());

    if(hash === '#pathfinderfluid')
        new Phaser.Game(Pathfinderfluid.config());

    if(hash === '#perceptron')
        new Phaser.Game(Perceptron.config());

    if(hash === '#supervisedlearning')
        new Phaser.Game(SupervisedLearning.config());

    if(hash === '#astar')
        new Phaser.Game(AStar.config());

    if(hash === '#maze')
        new Phaser.Game(Maze.config());
}
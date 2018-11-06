import Phaser from '../Phaser'

const controller = (scene) => {

    return {

        text: () => {

            let opt = document.getElementById('opt');
            opt.innerHTML = '<span class="inline">Curte trigonometria?</span>';
        },

        newPlanet: (orbitRadius) => {

            scene.add.image(0, 0, 'sun');
    
            let planet = {
                orbitCenter: {x: 0, y: 0},
                orbitAngle: 45,
                orbitRadius: orbitRadius,
                center: {x: 0, y: 0},
                hLine: new Phaser.Geom.Line(0,0,0,0),
                oLine: new Phaser.Geom.Line(0,0,0,0),
                aLine: new Phaser.Geom.Line(0,0,0,0),
                hypotenuse: scene.add.graphics(scene.config),
                oppsite: scene.add.graphics(scene.config),
                adjacent: scene.add.graphics(scene.config),
                planet: scene.add.image(0, 0, 'earth'),
                planetRotationsSpeed: 2
            };
    
            let obrbitLine = new Phaser.Geom.Circle(0,0, orbitRadius);
            let obrbit = scene.add.graphics(scene.config);
            obrbit.strokeCircleShape(obrbitLine);
    
            return planet;
        },
    
        planetOrbit: (planet, speed) => {
    
            planet.orbitAngle += speed;
            if(planet.orbitAngle === 360)
                planet.orbitAngle = 0;
    
            let oppsite = Math.sin(planet.orbitAngle/180*Math.PI)*planet.orbitRadius;
            let adjacent = Math.cos(planet.orbitAngle/180*Math.PI)*planet.orbitRadius;
    
            planet.center = {x: adjacent + planet.orbitCenter.x, y: oppsite + planet.orbitCenter.y};
    
            planet.planet.x = planet.center.x;
            planet.planet.y = planet.center.y;
    
            planet.planet.setRotation((planet.orbitAngle * planet.planetRotationsSpeed) * Math.PI / 180);
    
            planet.hLine.setTo(planet.orbitCenter.x, planet.orbitCenter.y, planet.center.x, planet.center.y);
            planet.oLine.setTo(adjacent + planet.orbitCenter.x, planet.orbitCenter.y, adjacent + planet.orbitCenter.x, oppsite + planet.orbitCenter.y);
            planet.aLine.setTo(planet.orbitCenter.x, planet.orbitCenter.y, adjacent + planet.orbitCenter.x, planet.orbitCenter.y);
    
            planet.hypotenuse.clear();
            planet.hypotenuse.strokeLineShape(planet.hLine);
            planet.oppsite.clear();
            planet.oppsite.strokeLineShape(planet.oLine);
            planet.adjacent.clear();
            planet.adjacent.strokeLineShape(planet.aLine);
    
            return planet;
        },
    
        newMoon: (orbitRadius) => {
    
            let moon = {
                orbitCenter: {x: 0, y: 0},
                orbitAngle: 0,
                orbitRadius: orbitRadius,
                center: {x: 0, y: 0},
                hLine: new Phaser.Geom.Line(0,0,0,0),
                oLine: new Phaser.Geom.Line(0,0,0,0),
                aLine: new Phaser.Geom.Line(0,0,0,0),
                hypotenuse: scene.add.graphics(scene.congig),
                oppsite: scene.add.graphics(scene.congig),
                adjacent: scene.add.graphics(scene.congig),
                moonOrbitLine:  new Phaser.Geom.Circle(0, 0, orbitRadius),
                moonOrbitGraph:  scene.add.graphics(scene.congig),
                moon: scene.add.image(0, 0, 'moon'),
                moonRotationsSpeed: 1
            };
    
            return moon;
        },
    
        moonOrbit: (moon, planet, speed) => {
    
            moon.orbitAngle += speed;
            if(moon.orbitAngle === 360)
                moon.orbitAngle = 0;
    
            let oppsite = Math.sin(moon.orbitAngle/180*Math.PI)*moon.orbitRadius;
            let adjacent = Math.cos(moon.orbitAngle/180*Math.PI)*moon.orbitRadius;
    
            moon.center = {x: adjacent + planet.center.x, y: oppsite + planet.center.y};
            moon.moon.x = moon.center.x;
            moon.moon.y = moon.center.y;
    
            moon.moon.setRotation((moon.orbitAngle * moon.moonRotationsSpeed) * Math.PI / 180);
    
            moon.hLine.setTo(planet.center.x, planet.center.y, moon.center.x, moon.center.y);
            moon.oLine.setTo(planet.center.x + adjacent, planet.center.y, planet.center.x + adjacent, planet.center.y + oppsite);
            moon.aLine.setTo(planet.center.x, planet.center.y, planet.center.x + adjacent, planet.center.y);
    
            moon.hypotenuse.clear();
            moon.hypotenuse.strokeLineShape(moon.hLine);
            moon.oppsite.clear();
            moon.oppsite.strokeLineShape(moon.oLine);
            moon.adjacent.clear();
            moon.adjacent.strokeLineShape(moon.aLine);
            
            moon.moonOrbitLine.setTo(planet.center.x, planet.center.y, moon.orbitRadius);
            moon.moonOrbitGraph.clear();
            moon.moonOrbitGraph.strokeCircleShape(moon.moonOrbitLine);
    
            return moon;
        }
    };
};

export default controller;

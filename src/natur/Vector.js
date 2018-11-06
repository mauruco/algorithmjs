

class Vector {

    constructor(x, y) {

        this.x = x;
        this.y = y;
    }
    
    static random = (min, max) => {
        
        let v = new Vector(0,0);
        v.randPosition(min, max);
        return v;
    }
    
    randPosition(min,max) {

        this.x = Math.floor(Math.random()*(max-min+1)+min);
        this.y = Math.floor(Math.random()*(max-min+1)+min);
    }

    get() {

        return new Vector(this.x,this.y);
    }

    add(v) {

        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {

        this.x += v.x * -1;
        this.y += v.y * -1;
    }

    mult(scale) {

        this.x *= scale; 
        this.y *= scale; 
    }

    div(scale) {

        this.x /= scale; 
        this.y /= scale; 
    }

    magnetude() {

        return Math.sqrt(this.x**2 + this.y**2);
    }

    normalize() {

        let mag = this.magnetude();
        this.x = this.x / mag;
        this.y = this.y / mag;
    }

    setMagnetude(newMag) {

        this.normalize();
        this.x *= newMag;
        this.y *= newMag;
    }

    limit(limit) {

        let mag = this.magnetude();
        if(mag > limit)
            this.setMagnetude(limit);
    }
}

export default Vector;
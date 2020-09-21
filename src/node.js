class Node {
    constructor(x, y, r = NODE_RADIUS) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.over = true;
        this.selected = false;
        this.engaged = false;
    }

    update(px, py) {
        this.x = this.x + px
        this.y = this.y + py
    }

    contains(px, py) {
      let d = dist(px, py, this.x, this.y);
      if (d < this.r) {
        return true;
      } else {
        return false;
      }
    }

    intersects(px, py) {
        let d = dist(px, py, this.x, this.y);
        if (d < NODE_RADIUS + this.r) {
            return true;
        } else {
            return false;
        }
    }

    show() {
        push()
        stroke(255)
        if(this.over || this.selected || this.engaged) {
            rectMode(CENTER)
            if(this.over) {
                
            }
            if(this.selected && !this.engaged) {
                fill(200)
            }
            if(this.engaged) {
                for(let i = 1; i < 5; i ++){
                    square(this.x, this.y, this.r * 2 - (i * this.r/10))
                }
            }
            square(this.x, this.y, this.r * 2)
        }
        pop()
    }
}
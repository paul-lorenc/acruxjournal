class Entry extends Node {
    constructor(x, y, r = NODE_RADIUS) {
      super(x,y,r);
      var today = new Date();
      this.dd = String(today.getDate()).padStart(2, '0');
      this.mm = String(today.getMonth() + 1).padStart(2, '0');
      this.yy = today.getFullYear() - 2000;
    }
  
    show() {
      super.show()
      stroke(166, 3, 17);
      strokeWeight(2);
      if(this.engaged) {
          fill(125, 23, 0)
      } else {
          fill(100)
      }
      ellipse(this.x, this.y, this.r * 2);
      text(this.dd, this.x - 7, this.y - 38)
      text(this.mm, this.x - 35, this.y + 30)
      text(this.yy, this.x + 24, this.y + 30)
    }
  }
class Goal extends Node{
    constructor(x, y, r = NODE_RADIUS) {
      super(x,y,r);
      this.EntryArr = []
    }

    push(obj) {
        this.EntryArr.push(obj)
    }
  
    show() {
      super.show()
      stroke(1, 19, 133);
      strokeWeight(2);
      fill(100)
      ellipse(this.x, this.y, this.r * 2);
      text("GOAL", this.x - 7, this.y - 20)
    }
}
class Goal extends Node{
    constructor(x, y, r = NODE_RADIUS) {
      super(x,y,r);
      this.isGoal = true;
      this.EntryArr = []
    }

    push(obj) {
        this.EntryArr.push(obj)
    }
  
    show() {
      super.show()
      push()
      stroke(1, 19, 133);
      strokeWeight(2);
      fill(100)
      ellipse(this.x, this.y, this.r * 2);
      text("GOAL", this.x - 7, this.y - 20)
      pop()
    }
}
class Goal extends Node{
    constructor(x, y, r = NODE_RADIUS) {
      super(x,y,r);
      this.text = ""
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
      rectMode(CENTER)
      textAlign(CENTER)
      var strarr = this.text.split("<")
      if(strarr[0] === "") {
       strarr[0] = "GOAL"
      }
      rect(this.x, this.y, this.r * 2, this.r * 2, 10);
      text(strarr[0], this.x, this.y-35)
      pop()
    }
}
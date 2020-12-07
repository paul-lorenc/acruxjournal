class Entry extends Node {
  constructor(x, y, r = NODE_RADIUS) {
    super(x, y, r);
    var today = new Date();
    this.dd = String(today.getDate()).padStart(2, "0");
    this.mm = String(today.getMonth() + 1).padStart(2, "0");
    this.yy = today.getFullYear() - 2000;
    this.isGoal = false;
    this.text = "";
  }

  show() {
    super.show();
    push();
    stroke(166, 3, 17);
    strokeWeight(2);
    fill(100);
    noFill();
    //ellipse(this.x, this.y, this.r * 2);
    imageMode(CENTER);
    image(entryTexture, this.x, this.y);
    entryTexture.resize(200, 200);
    textFont("Times", 15);
    text(this.dd, this.x - 7, this.y - 68);
    text(this.mm, this.x - 73, this.y + 60);
    text(this.yy, this.x + 58, this.y + 60);
    pop();
  }
}

let Goals = []
let Entries = []
let Nodes = []
var offX = 0
var offY = 0
let NODE_RADIUS = 50
let mousedrag_flag = false
let half_canvas = false
let jornal_editor;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  jornal_editor = createDiv("Hello World");
  jornal_editor.hide()
  jornal_editor.id("textarea")
}

function drawCanvasBorder() {
    if(half_canvas) {
        ww = windowWidth/2
    } else {
        ww = windowWidth
    }
    wh = windowHeight

    strokeWeight(2)
    stroke(200)

    line(6,10,6,wh-10)
    line(10,10,10,wh-10)

    line(12,wh-4, ww-12, wh-4)
    line(12,wh-8, ww-12, wh-8)

    line(ww-6, wh-10, ww-6, 10)
    line(ww-10, wh-10, ww-10, 10)

    line(12,4,ww-12,4)
    line(12,8,ww-12,8)
}

function draw() {
  background(75);
  for (let i = 0; i < Nodes.length; i++) {
      if(Nodes[i].contains(mouseX, mouseY)) {
          Nodes[i].over = true;
      }  else {
          Nodes[i].over = false;
      }
      Nodes[i].show()
  }
  drawCanvasBorder();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    half_canvas = false
    
}

function halfCanvas() {
    resizeCanvas(windowWidth/2, windowHeight);
    half_canvas = true
}

function mousePressed() {
    intersect_flag = false;
    offX = mouseX
    offY = mouseY
    let spotlight_flag = false;
    let spotlightX = 0
    let spotlightY = 0
    for(let i = 0; i < Nodes.length; i++) {
        if(Nodes[i].intersects(mouseX, mouseY)) {
            intersect_flag = true;
        }
        if(Nodes[i].contains(mouseX, mouseY)) {
            if(keyIsPressed && keyCode == 16) {
                Nodes[i].engaged = true;
                Nodes[i].show()
                return
            }
            if(Nodes[i].selected) {
                Nodes[i].selected = false;
            } else {
                Nodes[i].selected = true
                spotlight_flag = true
                spotlightX = windowWidth/4 - Nodes[i].x
                spotlightY = windowHeight/2 - Nodes[i].y
                
            }
        } else {
            Nodes[i].selected = false
            Nodes[i].engaged = false
        }
    }

    if(spotlight_flag) {
        for(let i = 0; i < Nodes.length; i++) {
            Nodes[i].update(spotlightX, spotlightY)
        }
        jornal_editor.show()
        halfCanvas()
    } else {
        jornal_editor.hide()
        windowResized()
    }
    
    if(!intersect_flag && keyIsPressed && keyCode == 16) {
        let e = new Entry(mouseX, mouseY);
        Nodes.push(e);
    } else {
        mousedrag_flag = true;
    }
}

function mouseDragged() {
    if(mousedrag_flag) { 
        offX = mouseX - pmouseX
        offY = mouseY - pmouseY

        for(let i = 0; i < Nodes.length; i++) {
            Nodes[i].update(offX, offY)
        }
    } 
}

function mouseReleased() {
    mousedrag_flag = false;
}

function keyPressed() {
    intersect_flag = false;
    if(keyCode == 8) {
        for(let i = 0; i < Nodes.length; i++) {
            if(Nodes[i].selected) {
                Nodes.splice(i, 1)
            }
        }
    }
    else if(keyCode == 71) {
        for(let i = 0; i < Nodes.length; i++) {
            if(Nodes[i].intersects(mouseX, mouseY)) {
                intersect_flag = true;
            }
        }
        if(!intersect_flag) {
            let g = new Goal(mouseX, mouseY);
            Nodes.push(g);
        }  
    }
}

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
        stroke(255)
        if(this.over || this.selected || this.engaged) {
            rectMode(CENTER)
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
    }
}

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
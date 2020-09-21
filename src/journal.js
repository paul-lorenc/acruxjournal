let Goals = []
let Entries = []
let Nodes = []
var offX = 0
var offY = 0
let NODE_RADIUS = 50
let mousedrag_flag = false
let half_canvas = false
let journal_editor;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  journal_editor = createDiv();
  journal_editor.id('editor_parent');
  journal_text = createElement('textarea');
  journal_text.position(windowWidth/2+windowWidth/50, windowHeight/50)
  journal_text.elt.id = "texteditor";
  journal_paint = new p5(entrybg, 'editor_parent');
  journal_editor.child(journal_text)
  journal_editor.hide()

  goal_display = createDiv();
  goal_display.id('display_parent');
  goal_text = createP("GOALLL!!!!")
  goal_text.position(windowWidth/2+windowWidth/50, windowHeight/50)
  goal_display.child(goal_text)
  goal_canvas = new p5(goalbg, 'display_parent')
  goal_display.hide()
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
    journal_text.position(windowWidth/2, 10)
    resizeCanvas(windowWidth, windowHeight);
    half_canvas = false
    
}

function halfCanvas() {
    resizeCanvas(windowWidth/2, windowHeight);
    half_canvas = true
}

function mousePressed() {
    if(half_canvas && mouseX > windowWidth/2) {
        ignore_flag = true;
        return
    } else {
        ignore_flag = false
    }
    intersect_flag = false;
    offX = mouseX
    offY = mouseY
    let spotlight_flag = false;
    let goal_sel = false;
    let entry_sel = false;
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
                if(Nodes[i].isGoal) {
                    goal_sel = true
                } else {
                    entry_sel = true
                }
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
        halfCanvas()
        if(goal_sel) {
            journal_editor.hide()
            goal_display.show()
            
        } else {
            goal_display.hide()
            journal_editor.show()
        }
    } else {
        journal_editor.hide()
        goal_display.hide()
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
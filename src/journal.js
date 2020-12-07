var Nodes;
var offX = 0;
var offY = 0;
let NODE_RADIUS = 100;

var database;
var NEW_NODE_ID;

let half_canvas = false;
let journal_editor;
let search_state = false;
var search_stack = [];
var ss_idx;

let zoomout = false;
let zoomin = false;

let zoomSc = 1.0;
let zoomX = 1.0;
let zoomY = 1.0;

let global_engaged = [];
let global_selected = [];

function preload() {
  entryTexture = loadImage("assets/entrynodemodel.png");
  goalTexture = loadImage("assets/goalnodemodel.png");
  onHoverTexture = loadImage("assets/onhover.png");
  cornerFeatureTexture = loadImage("assets/cornerfeature.png");
}

async function firebaseInit() {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  database.ref("nodes").once("value", function (snapshot) {
    snapshot.forEach(function (item) {
      var itemVal = item.val();
      Nodes = reviveNodes(itemVal);
    });
  });
}
function firebaseWrite() {
  if (!Nodes.length == 0) {
    database
      .ref("nodes")
      .set({ Nodes })
      .then(function (out) {
        console.log("writting");
        console.log(out);
      });
  }
}

async function setup() {
  Nodes = [];
  await firebaseInit();
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");

  search_bar_div = createDiv();
  search_bar_div.id("search_bar_div");
  search_bar_div.position(windowWidth / 10 + 3, 3);

  search_bar = createInput("");
  search_bar.id("search_bar");
  search_bar.position(-100, -100);
  search_bar.elt.onfocus = function searchfocuswrapper() {
    search_bar_div.elt.style.background = "white";
  };
  search_bar.elt.onblur = function searchblurwrapper() {
    search_bar_div.elt.style.background = "black";
  };
  search_bar.elt.onkeyup = function searchKeyUpWrapper() {
    searchKeyReleased();
    writeit(this, event, "search");
  };

  search_bar_span = createElement("span");
  search_bar_span.elt.id = "writersearch";
  search_bar_div.child(search_bar_span);

  info_bar_container = createDiv();
  info_bar_container.position(5, 3);
  info_bar_container.id("info_bar_container");
  info_bar = createElement("span");
  info_bar.elt.id = "info_bar";
  info_bar_container.child(info_bar);

  journal_editor = createDiv();
  journal_editor.id("editor_parent");
  journal_editor.position(windowWidth / 2, 0);

  journal_text = createElement("textarea");
  journal_text.position(-500, -500);
  journal_text.elt.id = "setter";
  journal_text.elt.focus();
  journal_text.elt.onkeyup = function j_keyuphandler() {
    if (half_canvas) {
      writeit(this, event, "");
    }
  };
  journal_text.elt.onkeydown = function j_keydownhandler() {
    if (half_canvas) {
      writeit(this, event, "");
    }
  };
  journal_text.elt.onkeypress = function writemove() {
    if (half_canvas) {
      writeit(this, event, "");
      moveIt(this.value.length, event);
    }
  };

  j_getter = createDiv();
  j_getter.id("getter");
  j_getter.hide();

  j_getter.position(windowWidth / 2, 0);

  j_writer = createElement("span");
  j_writer.elt.id = "writer";
  j_getter.child(j_writer);

  j_cursor = createElement("b");
  j_cursor.elt.id = "cursor";
  j_getter.child(j_cursor);

  journal_paint = new p5(entrybg, "editor_parent");

  journal_editor.hide();

  goal_display = createDiv();
  goal_display.id("display_parent");

  goal_canvas = new p5(goalbg, "display_parent");
  goal_display.hide();
}
//draws splines between nodes
function drawSplines() {
  for (let i = 0; i < Nodes.length; i++) {
    if (Nodes[i].isGoal) {
      for (let j = 0; j < Nodes[i].EntryArr.length; j++) {
        push();
        var source_node = getNodeByID(Nodes[i].EntryArr[j]);
        let source_over =
          source_node.over || source_node.selected || source_node.engaged;
        let goal_over = Nodes[i].over || Nodes[i].selected || Nodes[i].engaged;
        if (source_over || goal_over) {
          strokeWeight(4.4);
          stroke("white");
        } else {
          strokeWeight(1.5);
          stroke("white");
        }

        noFill();
        let x1 = Nodes[i].x;
        let y1 = Nodes[i].y;
        let x2 = source_node.x;
        let y2 = source_node.y;

        // angle in degrees
        var angleDeg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        angleDeg = 180 - angleDeg;
        d = dist(x1, y1, x2, y2);

        //right side
        if (angleDeg <= 45 || angleDeg >= 315) {
          beginShape();
          curveVertex(x2 - (200 + d), y2);
          curveVertex(x2 + NODE_RADIUS, y2);
          curveVertex(x1 - NODE_RADIUS, y1);
          curveVertex(x1 + (200 + d), y1);
          endShape();
        }
        //above
        else if (angleDeg > 45 && angleDeg <= 135) {
          beginShape();
          curveVertex(x2, y2 + (200 + d));
          curveVertex(x2, y2 - NODE_RADIUS);
          curveVertex(x1, y1 + NODE_RADIUS);
          curveVertex(x1, y1 - (200 + d));
          endShape();
        }
        //left side
        else if (angleDeg > 135 && angleDeg <= 225) {
          beginShape();
          curveVertex(x2 + (200 + d), y2);
          curveVertex(x2 - NODE_RADIUS, y2);
          curveVertex(x1 + NODE_RADIUS, y1);
          curveVertex(x1 - (200 + d), y1);
          endShape();
        } else if (angleDeg > 225 && angleDeg <= 315) {
          beginShape();
          curveVertex(x2, y2 - (200 + d));
          curveVertex(x2, y2 + NODE_RADIUS);
          curveVertex(x1, y1 - NODE_RADIUS);
          curveVertex(x1, y1 + (200 + d));
          endShape();
        }
        pop();
      }
    }
  }
}

// draws border
function drawCanvasBorder() {
  push();
  if (half_canvas) {
    ww = windowWidth / 2;
  } else {
    ww = windowWidth;
  }
  wh = windowHeight;

  strokeWeight(2);
  stroke(255);

  line(6, 4, 6, wh - 10);
  line(10, 4, 10, wh - 10);

  line(12, wh - 4, ww - 12, wh - 4);
  line(12, wh - 8, ww - 12, wh - 8);

  line(ww - 6, wh - 10, ww - 6, 10);
  line(ww - 10, wh - 10, ww - 10, 10);

  line(6, 4, ww - 12, 4);
  line(6, 8, ww - 12, 8);
  cornerFeatureTexture.resize(20, 20);
  image(cornerFeatureTexture, 0, wh - 20);
  image(cornerFeatureTexture, ww - 20, wh - 20);
  image(cornerFeatureTexture, ww - 20, 0);
  pop();
}

function draw() {
  var curDate = Date();
  info_bar.elt.innerHTML = "Paul Lorenc " + curDate;
  cleanText();
  background(0, 0, 0);
  if (!search_state) {
    journal_text.elt.focus();
  }
  if (zoomout) {
    zoomSc = zoomSc - 0.1;
  }
  if (zoomin) {
    zoomSc = zoomSc + 0.1;
  }
  //scale(zoomSc)
  drawSplines();
  for (let i = 0; i < Nodes.length; i++) {
    if (Nodes[i].contains(mouseX, mouseY)) {
      Nodes[i].over = true;
    } else {
      Nodes[i].over = false;
    }
    Nodes[i].show();
  }
  drawCanvasBorder();
  zoomout = false;
  zoomin = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  half_canvas = false;
}

function halfCanvas() {
  resizeCanvas(windowWidth / 2, windowHeight);
  half_canvas = true;
}

// global mousepress handler
function mousePressed() {
  if (half_canvas && mouseX > windowWidth / 2) {
    if (search_state) {
      journal_text.elt.focus();
    }
    return;
  }
  let intersect_flag = false;
  let spotlight_flag = false;
  let spotlightX = 0;
  let spotlightY = 0;
  let spotlightText = "";

  for (let i = 0; i < Nodes.length; i++) {
    if (Nodes[i].intersects(mouseX, mouseY)) {
      intersect_flag = true;
    }
    if (Nodes[i].contains(mouseX, mouseY)) {
      if (global_engaged.length > 0) {
        if (Nodes[i].isGoal && !global_engaged[0].isGoal) {
          Nodes[i].EntryArr.push(global_engaged[0].id);
        } else if (!Nodes[i].isGoal) {
          old_engaged = global_engaged.pop();
          old_engaged.engaged = false;
          Nodes[i].engaged = true;
          global_engaged.push(Nodes[i]);
        }
        return;
      }
      if (keyIsPressed && keyCode == 16) {
        if (global_engaged.length == 0) {
          global_engaged.push(Nodes[i]);
          Nodes[i].engaged = true;
        }
        return;
      }
      if (Nodes[i].selected) {
        global_selected.pop();
        Nodes[i].selected = false;
        spotlight_flag = false;
      } else {
        if (global_selected.length == 1) {
          global_selected.pop();
        }
        global_selected.push(Nodes[i]);
        Nodes[i].selected = true;
        spotlightText = Nodes[i].text;
        spotlight_flag = true;
        spotlightX = windowWidth / 4 - Nodes[i].x;
        spotlightY = windowHeight / 2 - Nodes[i].y;
      }
    } else {
      Nodes[i].selected = false;
      if (search_state) {
        $("search_bar").value = "";
        $("writersearch").innerHTML = "";
        search_state = false;
        search_stack = [];
      }
    }
  }
  if (spotlight_flag) {
    for (let i = 0; i < Nodes.length; i++) {
      Nodes[i].update(spotlightX, spotlightY);
    }
    halfCanvas();
    if (global_selected[0].isGoal) {
      journal_editor.hide();
      goal_display.show();
    } else {
      goal_display.hide();
      journal_editor.show();
    }
    j_getter.show();
    clearSet(spotlightText);
    return;
  } else if (global_selected.length > 0) {
    global_selected[0].text = $("writer").innerHTML;
  }

  if (!spotlight_flag) {
    firebaseWrite();
    j_getter.hide();
    journal_editor.hide();
    goal_display.hide();
    windowResized();
  }

  if (keyIsPressed && keyCode == 16 && global_engaged.length > 0) {
    for (let i = 0; i < Nodes.length; i++) {
      Nodes[i].engaged = false;
    }
    global_engaged.pop();
    return;
  }

  if (!intersect_flag && keyIsPressed && keyCode == 16) {
    let e = new Entry(mouseX, mouseY);
    e.id = uuidv4();
    Nodes.push(e);
    return;
  }
}

function mouseDragged() {
  if (half_canvas && mouseX > windowWidth / 2) {
    return;
  }
  offX = mouseX - pmouseX;
  offY = mouseY - pmouseY;

  for (let i = 0; i < Nodes.length; i++) {
    Nodes[i].update(offX, offY);
  }
}

function mouseReleased() {}

function keyReleased() {
  intersect_flag = false;
  //esc key
  if (keyCode == 27) {
    if (search_state) {
      $("search_bar").value = "";
      $("writersearch").innerHTML = "";
      search_state = false;
      search_stack = [];
      journal_text.elt.focus();
    }
  }

  //ctrl
  if (keyCode == 17) {
    if (!half_canvas) {
      search_state = true;
      search_bar.elt.focus();
    }
  }
  //-
  if (keyCode == 189) {
    zoomout = true;
  }
  //+
  if (keyCode == 187) {
    zoomin = true;
  }
  //delete
  if (keyCode == 8) {
    for (let i = 0; i < Nodes.length; i++) {
      if (Nodes[i].engaged && !half_canvas) {
        delete_id = Nodes[i].id;
        for (let j = 0; j < Nodes.length; j++) {
          if (Nodes[j].isGoal) {
            if (Nodes[j].EntryArr.includes(delete_id)) {
              t_idx = Nodes[j].EntryArr.indexOf(delete_id);
              Nodes[j].EntryArr.splice(t_idx, 1);
            }
          }
        }
        global_engaged.pop();
        Nodes.splice(i, 1);
      }
    }
  }
  //g key
  else if (keyCode == 71) {
    for (let i = 0; i < Nodes.length; i++) {
      if (Nodes[i].intersects(mouseX, mouseY)) {
        intersect_flag = true;
      }
    }
    if (!intersect_flag && !half_canvas && !search_state) {
      let g = new Goal(mouseX, mouseY);
      g.id = uuidv4();
      Nodes.push(g);
    }
  }
}

function searchKeyReleased() {
  //enter during search state
  if (keyCode == 13 && search_state) {
    ss_idx = 0;
    var search_str = $("search_bar").value.toLowerCase();
    if (search_str.charAt(0) == ":") {
      s_cmd = search_str.substring(1);
      switch (s_cmd) {
        case "s":
          firebaseWrite();
          console.log("writing from command terminal!!");
      }
      $("search_bar").value = "";
      $("writersearch").innerHTML = "";
      search_state = false;
      search_stack = [];
      journal_text.elt.focus();
      return;
    }
    for (let i = 0; i < Nodes.length; i++) {
      if (Nodes[i].text.toLowerCase().includes(search_str)) {
        search_stack.push(Nodes[i]);
      }
    }
    if (search_stack.length > 0) {
      if (global_selected.length > 0) {
        global_selected[0].text = $("writer").innerHTML;
        global_selected[0].selected = false;
        global_selected.pop();
      }
      global_selected.push(search_stack[ss_idx]);
      spotlightUpdate(search_stack[ss_idx], Nodes);
      console.log(search_stack.length);
    } else {
      $("search_bar").value = "";
      $("writersearch").innerHTML = "";
      search_state = false;
      search_stack = [];
      journal_text.elt.focus();
    }
  }
  //right arrow during search state
  if (keyCode == 39 && search_state) {
    console.log("right");
    if (ss_idx < search_stack.length - 1) {
      ss_idx = ss_idx + 1;
    }
    if (search_stack.length > ss_idx) {
      if (global_selected.length > 0) {
        global_selected[0].text = $("writer").innerHTML;
        global_selected[0].selected = false;
        global_selected.pop();
      }
      global_selected.push(search_stack[ss_idx]);
      spotlightUpdate(search_stack[ss_idx], Nodes);
    }
  }

  //left arrow during search state
  if (keyCode == 37 && search_state) {
    console.log("left");
    if (ss_idx > 0) {
      ss_idx = ss_idx - 1;
    }
    if (ss_idx >= 0) {
      if (global_selected.length > 0) {
        global_selected[0].text = $("writer").innerHTML;
        global_selected[0].selected = false;
        global_selected.pop();
      }
      global_selected.push(search_stack[ss_idx]);
      spotlightUpdate(search_stack[ss_idx], Nodes);
    }
  }
  return false;
}

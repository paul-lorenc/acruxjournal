var gesture = function (s) {
  s.on = false;
  s.point_stack = [];
  s.last_two = [];
  s.gestures = [];
  s.GESTURE_POINT_NUM = 5;

  s.setup = function () {
    s.createCanvas(windowHeight / 2, windowHeight / 2);
  };

  s.draw = function () {
    s.push();
    s.background("blue");
    s.noFill();
    if (s.point_stack.length === s.GESTURE_POINT_NUM) {
      s.last_two.push(s.point_stack);
      s.point_stack = [];
    }

    if (s.last_two.length === 2) {
      // s.gestures.push({
      //   point_set: s.last_two,
      //   f: ge_pickDrawFunction(),
      // });
      global_drawing.push({
        point_set: s.last_two,
      });
      global_drawing_f.push(ge_pickDrawFunction());
      s.last_two = [];
    }
    for (let j = 0; j < s.point_stack.length; j++) {
      s.ellipse(s.point_stack[j].x, s.point_stack[j].y, 3);
    }
    s.multicurve(s.point_stack);

    for (let k = 0; k < s.last_two.length; k++) {
      s.multicurve(s.last_two[k]);
    }

    for (let i = 0; i < global_drawing.length; i++) {
      s.multicurve(global_drawing[i].point_set[0]);
      s.multicurve(global_drawing[i].point_set[1]);
      f = global_drawing_f[i];
      f(s, global_drawing[i].point_set);
    }
  };

  s.windowResized = function () {
    s.resizeCanvas(windowWidth / 8, (3 * windowHeight) / 8);
  };

  s.mousePressed = function () {
    p = {
      x: s.mouseX,
      y: s.mouseY,
    };
    if (!s.inCanvas(p)) {
      return;
    }
    s.noFill();
    console.log("x: " + s.mouseX);
    console.log("y: " + s.mouseY);
    s.point_stack.push(p);
  };

  s.inCanvas = function (p) {
    if (global_selected.length > 0) {
      if (global_selected[0].isGoal) {
        return false;
      }
    }
    return !(
      p.x < 0 ||
      p.y < 0 ||
      !half_canvas ||
      p.x > s.width ||
      p.y > s.height
    );
  };

  s.multicurve = function (points) {
    var p0, p1, midx, midy;

    s.beginShape();

    if (points.length < 3) {
      return;
    }

    s.vertex(points[0].x, points[0].y);

    for (var i = 1; i < points.length - 2; i += 1) {
      p0 = points[i];
      p1 = points[i + 1];
      midx = (p0.x + p1.x) / 2;
      midy = (p0.y + p1.y) / 2;
      s.quadraticVertex(p0.x, p0.y, midx, midy);
      s.vertex(midx, midy);
    }
    p0 = points[points.length - 2];
    p1 = points[points.length - 1];
    s.quadraticVertex(p0.x, p0.y, p1.x, p1.y);
    s.endShape();
  };
};

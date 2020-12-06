var entrybg = function (s) {
  s.setup = function () {
    s.createCanvas(s.windowWidth / 2, s.windowHeight);
    s.push();
    s.background(0, 0, 0);

    s.gesture = s.createDiv();
    s.gesture.id("gesture");
    s.gesture.position(windowWidth / 8, (3 * windowHeight) / 8);
    s.journal_paint = new p5(gesture, "gesture");
    s.pop();
  };

  s.draw = function () {};

  s.windowResized = function () {
    s.resizeCanvas(s.windowWidth / 2, s.windowHeight / 2);
  };
};

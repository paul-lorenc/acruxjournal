function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = TWO_PI/4; a < TWO_PI+TWO_PI/4; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}

function spotlightUpdate(node, nodes) {
  node.selected = true
  spotlightText = node.text
  spotlight_flag = true
  spotlightX = windowWidth/4 - node.x
  spotlightY = windowHeight/2 - node.y
  for(let i = 0; i < nodes.length; i++) {
      nodes[i].update(spotlightX, spotlightY)
  }
  halfCanvas()
  if(node.isGoal) {
    journal_editor.hide()
    goal_display.show() 
  } else {
    goal_display.hide()
    journal_editor.show()
  }
  j_getter.show()
  clearSet(spotlightText)
  return
}
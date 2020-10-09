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

function containsNodeByID(id) {
  for(let i = 0; i < n.length; i++) {
    if (n[i].id === id) return true
  }
  return false
}

function getNodeByID(id) {
  for(let i = 0; i < Nodes.length; i++) {
    if (Nodes[i].id === id) {
      return Nodes[i]
    }
  }
  return null
}

function reviveNodes(itemVal) {
  let n = []
  itemVal.forEach(function(node) {
    var new_node
    if(node.isGoal) {
        new_node = new Goal(node.x,node.y,node.r)
        new_node.id = node.id
        new_node.text = node.text
        new_node.engaged = false
        new_node.selected = false
        new_node.over = false
        new_node.EntryArr = parseEntryArr(node.EntryArr)
    } else {
        new_node = new Entry(node.x,node.y,node.r)
        new_node.id = node.id
        new_node.text = node.text
        new_node.engaged = false
        new_node.selected = false
        new_node.over = false
        new_node.dd = node.dd
        new_node.mm = node.mm
        new_node.yy = node.yy
    }
    n.push(new_node)
  })
  return n
}

function parseEntryArr(itemVal) {
  if(itemVal == undefined) return []
  let n = []
  itemVal.forEach(function(node) {
    n.push(node)
  })
  return n
}


var entrybg = function(s) {
    s.setup = function() {
        s.createCanvas(s.windowWidth/2,s.windowHeight)
        s.background(75)
        s.push()
        s.rectMode(CENTER)
        s.noFill()
        s.rect(windowWidth/8, 3*windowHeight/4, windowWidth/4 - windowWidth/40, windowWidth/4 -windowWidth/40)
        s.rect(3*windowWidth/8, 3*windowHeight/4, windowWidth/4 - windowWidth/40, windowWidth/4 -windowWidth/40)
        s.pop()
    }

    s.draw = function() {
        s.push()
        s.pop()
    }

    s.windowResized = function() {
        s.resizeCanvas(s.windowWidth/2, s.windowHeight/2)
    }
} 

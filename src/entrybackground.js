var entrybg = function(s) {
    s.setup = function() {
        s.createCanvas(s.windowWidth/2,s.windowHeight) 
    }

    s.draw = function() {
        s.push()
        s.background(58, 64, 74)
        s.rectMode(CENTER)
        s.noFill()
        s.rect(windowWidth/4, windowHeight/2+windowHeight/8, windowWidth/2 - windowWidth/5, windowWidth/2 -windowWidth/5)
        s.pop()
    }

    s.windowResized = function() {
        s.resizeCanvas(s.windowWidth/2, s.windowHeight/2)
    }
} 

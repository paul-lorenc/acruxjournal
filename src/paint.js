var paint = function(s) {
    s.setup = function() {
        s.createCanvas(s.windowWidth/4,s.windowWidth/4)
        s.background(75)
        s.push()
        s.pop()
    }

    s.draw = function() {
        s.push()
        s.curve(0,0,10,10,20,30,50,70)
        s.pop()
    }

    s.windowResized = function() {
        s.resizeCanvas(s.windowWidth/4, s.windowHeight/4)
    }
} 
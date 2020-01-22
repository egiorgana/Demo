let game = {
    start : function(){
        game.stop()
        this.sounds = {
            bg: new sound("./sounds"),
            boom: new sound("./sounds"),
            fire: new sound("./sounds")
        };
        this.c = document.getElementById("c")
        this.g = this.c.getContext("2d")
        this.drops = []
        for (let i = 0; i < 250; i++){
		    let x = randint(0, this.c.width)
		    let y = randint(0, this.c.height)
		    this.drops.push([x, y])
	    }
        this.player1 = new player(260, 90, 20.0, "jugador1.png", "left")
        this.player2 = new player(250, 100, 20.0, "jugador2.png", "right")
        this.interval = setInterval(this.update, 1000 / 60)
    },
    stop : function(){
        this.interval = clearInterval(this.interval) 
    },
    update : function(){
        let g = game.g 
        let c = game.c
        game.clear()
        game.player1.update()
        game.player2.update()
        
        g.font = "50px"
	    g.lineWidth = 4
	    
	    g.fillStyle = "gold"
	    g.fillText("Eliher", 20, 35)
	    if (game.player1.lives >= 0){
		    g.fillRect(20, 50, game.player1.lives * 300 / 20, 30)
	    }
	    
        g.fillStyle = "gold"
    	g.fillText("Villano", game.c.width - 115, 35)
	    if (game.player2.lives >= 0){
		    let l = game.player2.lives * 300 / 20
		    g.fillRect(c.width - 20 - l, 50, l, 30)
	    }
    },
    clear : function(){
        this.g.clearRect(0, 0, this.c.width, this.c.height)
    }
}
//
function sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = "sounds/" + src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    this.sound.style.display = "none"
    document.body.appendChild(this.sound)
    this.play = function(loops = 0) {
        if (loops === -1) this.sound.loop = true;
        else this.sound.loop = false;
        this.sound.play()
    }
    this.stop = function() {
         this.sound.pause()
    }
}
//
function player(width, height, lives, imagePath, side) {
    this.side = side
    this.image = new Image()
    this.image.src = "images/" + imagePath
    this.width = width
    this.height = height
    this.lives = lives
    this.bullets = []
    this.vx = 0
    this.vy = 0 
    this.x = 0
    this.y = 0
    this.rocketsShot = 0
    this.update = function() {
        this.move();
        let n = this.bullets.length
        let p = (this.side === "left") ? game.player2 : game.player1
        for(let i = 0; i < n; i++){
            this.bullets[i].update()
            let b = this.bullets[i]
        }
        game.g.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    this.resetPos = function(){
        this.x = (this.side === "left") ? 0 : game.c.width - this.width
        this.y = randint(140, game.c.height - this.height)
    }
    this.resetPos()
    this.move = function(){
        this.x = clp(this.x + this.vx, 0, game.c.width - this.width)
        this.y = clp(this.y + this.vy, 140, game.c.height - this.height)
    }
    this.fire = function(){
        game.sounds.fire.play()
        this.rocketsShot++
        if (this.rocketsShot < 2){
            var x, y, vx, vy, imagePath
            if (this.side === "left"){
                x = this.x + 60
                y = this.y + 68
                vx = randint(12, 15)
                vy = 0
                imagePath = "bala3.png"
                this.bullets.push(new cohe(x, y, vx, vy, imagePath))
            } else {
                x = this.x + 75
                y = this.y + 70
                vx = randint(-15, -12)
                vy = 0
                imagePath = "bala4.png"
                this.bullets.push(new cohe(x, y, vx, vy, imagePath))
                x = this.x + 95
                y = this.y + 80
                this.bullets.push(new cohe(x, y, vx, vy, imagePath))
            }
        }
    }
}
//
function cohe(x, y, vx, vy, imagePath){
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.width = 120
    this.height = 20
    this.image = new Image()
    this.image.src = "images/" + imagePath
    this.update = function() {
        this.x += vx
        game.g.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}
//
clp = (y, minimum, maximum) => {
    if (y < minimum) return minimum
    else if (y > maximum) return maximum
    return y
}
//
randint = (min, max) => {
    return min + Math.round((max - min) * Math.random())
}
//
window.onload = () => {
    game.start()
    window.onkeydown = (e) => {
        var v = 5
        switch (e.keyCode) {
            case 32:
        	    game.start()
        	    break
            case 88:
        	    game.player1.fire() 
    		    break
			case 65: 
    			game.player1.vy = -v
    			break
            case 90: 
    			game.player1.vy = v
    			break
    		case 16:
    			game.player2.fire()
    			break
    	    case 38: 
    			game.player2.vy = -v
    		    break
    		case 40: 
    		    game.player2.vy = v
    	        break
    	}
    }
    window.onkeyup = (e) => {
    	switch (e.keyCode) {
    		case 88: 
        	    game.player1.rocketsShot = 0
        	    break
    		case 65: 
    		    game.player1.vy = 0 
    		    break
    		case 90: 
    		    game.player1.vy = 0
        	    break
			case 16: 
    		    game.player2.rocketsShot = 0 
    		    break
    		case 38: 
    		    game.player2.vy = 0
    		    break
    		case 40: 
    		    game.player2.vy = 0
    		    break;
    	}
    }
}
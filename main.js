window.onload = function(){
    game.start()
    window.onkeydown = function(e){
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
    }; 
    window.onkeyup = function(e){
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
    };
};

let game = {
    start : function(){
        game.stop()
        this.timer = 0
        this.images = {
            bg : document.getElementById("bg-game"),
            drop : document.getElementById("drop")
        };
        this.sounds = {
            bg: new sound("bg.mp3"),
            boom: new sound("boom.mp3"),
            fire: new sound("fire.mp3")
        };
        // this.sounds.bg.play(-1);
        // this.sounds.bg.volume = 0.1;
        // this.sounds.boom.volume = 0.01;
        // this.sounds.fire.volume = 1.0;
        this.c = document.getElementById("c")
        this.g = this.c.getContext("2d")
        this.drops = []
        for (let i = 0; i < 250; i++){
		    let x = randint(0, this.c.width)
		    let y = randint(0, this.c.height)
		    this.drops.push([x, y])
	    }
        this.player1 = new player(260, 90, 20.0, "player3.png", "left")
        this.player2 = new player(250, 100, 20.0, "monster.png", "right")
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
        
        g.fillStyle = "rgba(255, 255, 255, 0.0)"
        g.fillRect(0, 0, c.width, 140)
        
        g.font = "30px Trebuchet MS"
	    g.lineWidth = 4
	    
	    g.fillStyle = "#20BF55"
	    g.fillText("Capitan", 20, 35)
	    g.strokeStyle = "black"
	    if (game.player1.lives >= 0) {
		    g.fillRect(20, 50, game.player1.lives * 300 / 20, 30)
	    }
	    
	    g.fillStyle = "#01BAEF"
    	g.fillText("Villano", game.c.width - 150, 35)
	    if (game.player2.lives >= 0){
		    let l = game.player2.lives * 300 / 20
		    g.fillRect(c.width - 20 - l, 50, l, 30)
        }
        
	    
	    if (game.player1.lives <= 0) {
	        game.sounds.boom.play()
            game.sounds.bg.stop()
            game.stop()
            g.font = "80px Trebuchet MS"
            g.fillStyle = "yellow"
            g.fillText("PERDISTE", 150, 310)
            g.fillStyle = "orange"
            g.fillText("GANASTE!", c.width - 510, 310)
            g.font = "40px Comic Sans MS"
            g.strokeStyle = "black"
            g.strokeText("ENTER", 470, c.height - 80)
	    } else if (game.player2.lives <= 0) {
            game.sounds.boom.play()
            game.sounds.bg.stop()
            game.stop()
            g.font = "80px Trebuchet MS"
            g.fillStyle = "yellow"
            g.fillText("GANASTE!", 150, 310)
            g.fillStyle = "orange"
            g.fillText("PERDISTE", c.width - 510, 310)
            g.font = "40px Comic Sans MS"
            g.strokeStyle = "black"
            g.strokeText("ENTER", 470, c.height - 80)
        }

    },
    clear : function() {
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
            if (isCollision(b.x + b.width / 2, b.y + b.height / 2, 
                p.x + p.width / 1, p.y + p.height / 2)){
                p.lives -= (this.side === "left") ? 1 : 1
                b.y = -9999
            }
        }
        game.g.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    this.resetPos = function(){
        this.x = (this.side === "left") ? 0 : game.c.width - this.width
        this.y = randint(140, game.c.height - this.height)
    }
    this.resetPos()
    this.move = function(){
        this.x = clamp(this.x + this.vx, 0, game.c.width - this.width)
        this.y = clamp(this.y + this.vy, 140, game.c.height - this.height)
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
                imagePath = "bullet3.png"
                this.bullets.push(new rocket(x, y, vx, vy, imagePath))
            } else {
                x = this.x + 75
                y = this.y + 70
                vx = randint(-15, -12)
                vy = 0
                imagePath = "nose.png"
                this.bullets.push(new rocket(x, y, vx, vy, imagePath))
                x = this.x + 95
                y = this.y + 100
                this.bullets.push(new rocket(x, y, vx, vy, imagePath))
            }
        }
    }
}
//
function rocket(x, y, vx, vy, imagePath){
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
clamp = (y, minimum, maximum) => {
    if (y < minimum) return minimum
    else if (y > maximum) return maximum
    return y
}

randint = (min, max) => {
    return min + Math.round((max - min) * Math.random())
}

isCollision = (x1, y1, x2, y2) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) < 70
}

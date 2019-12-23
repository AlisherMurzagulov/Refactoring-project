Player.prototype = new u();
Player.prototype.constructor = u;
function Player (playerTemplate) {
    this.template = playerTemplate;

    this.sprite = new Sprite(this.template.spriteTemplate);
    this.hitPoints = this.template.hitPoints;

    if (this.template.ws != null) {
        for (var i = 0; i < this.template.ws.length; i++) {
            this.addWeapon(new Weapon(this.template.ws[i], this));
        }
    }
}

Player.prototype.entityType = "Player";

Player.prototype.update = function(delta) {
    this.targetangle  = this.angle;

    if (globaldata.freeRangeMode) {
        this.moveFreeRangeMode();
    } else {
        this.turningspeed = 0;
        this.targetangle = null;
        if (this.angle != 0) {
            // Rotate back to facing forwards
            this.targetangle = 0;
            var desiredAngle = this.getTargetAngle(this.x, this.y - 1);
            this.setturningspeed(desiredAngle);
        }
        this.moveNormal();
    }
    
    this.fireIfPossible = globaldata.inputShoot;
    
    u.prototype.update.call(this, delta);
    
    this.moveInsideDrawingArea();
}

Player.prototype.moveNormal = function() {
    if (globaldata.inputGo) {
        var desiredAngle = this.getTargetAngle(globaldata.inputGoX, globaldata.inputGoY);
        
        var distance = this.getDistance(globaldata.inputGoX, globaldata.inputGoY);

        if (distance < 10) { // TODO: setting this lower causes a strange bug
            this.speed = 0;
        } else if (distance < 15) {
            this.speed = this.template.speed / 2;
        } else {
            this.speed = this.template.speed;
        }

        this.targetangle  = desiredAngle;
    } else {
        this.targetangle  = 0;

        var moveX = 0;
        var moveY = 0;

        if (globaldata.inputRight) moveX++;
        if (globaldata.inputLeft) moveX--;
        if (globaldata.inputDown) moveY++;
        if (globaldata.inputUp) moveY--;

        if (moveX == 0) {
            if (moveY > 0) this.targetangle  = Math.PI;
        } else if (moveX < 0) {
            this.targetangle  = -Math.PI / 2;
            this.targetangle  -= moveY * (Math.PI / 4);
        } else {
            this.targetangle  = Math.PI / 2;
            this.targetangle  += moveY * (Math.PI / 4);
        }

        if (moveX != 0 || moveY != 0) {
            this.speed = this.template.speed;
        } else {
            this.speed = 0;
        }
    }
}

Player.prototype.moveFreeRangeMode = function() {
    if (globaldata.inputUp) {
        this.speed = this.template.speed;
    } else if (globaldata.inputDown) {
        this.speed = -this.template.speed;
    } else {
        this.speed = 0;
    }
    
    if (globaldata.inputLeft) {
        this.turningspeed = -3;
    } else if (globaldata.inputRight) {
        this.turningspeed = 3;
    } else {
        this.turningspeed = 0;
    }
    
    if (globaldata.inputGo) {
        var desiredAngle = this.getTargetAngle(globaldata.inputGoX, globaldata.inputGoY);

        var angleDiff = desiredAngle - this.angle;
        
        if (Math.abs(angleDiff) < 0.1) {
            this.turningspeed = 0;
            this.targetangle = null;
        } else {
            this.setturningspeed(desiredAngle);
            this.targetangle = desiredAngle;
        }

        var distance = this.getDistance(globaldata.inputGoX, globaldata.inputGoY);

        if (distance < 10) {
            this.speed = 0;
        } else if (distance < 20) {
            this.speed = this.template.speed / 2;
        } else {
            this.speed = this.template.speed;
        }
    } else {
        this.targetangle = null;
    }
}

Player.prototype.getDistance = function(targetX, targetY) {
    var x = targetX - this.x;
    var y = targetY - this.y;

    return Math.sqrt((x * x) + (y * y));
}

// TODO: change the name of this
Player.prototype.gettargetangle = function(targetX, targetY) {
    var x = targetX - this.x;
    var y = targetY - this.y;

    var distance = Math.sqrt((x * x) + (y * y));
    x = x / distance;
    y = y / distance;
    
    var desiredAngle = Math.acos(x);        
    if (y < 0) {
        desiredAngle = -desiredAngle; 
    }
    desiredAngle += Math.PI / 2;
    if (desiredAngle > Math.PI) {
        desiredAngle -= 2 * Math.PI;
    }
    if (desiredAngle <= -Math.PI) {
        desiredAngle += 2 * Math.PI;
    }

    return desiredAngle;
}

Player.prototype.setturningspeed = function(desiredAngle) {
    var angleDiff = desiredAngle - this.angle;

    if ((angleDiff > 0 && angleDiff < Math.PI) ||
        (angleDiff < 0 && angleDiff < -Math.PI)) {
        this.turningspeed = 8;
    } else {
        this.turningspeed = -8;
    }
}

// Stops the player leaving the screen
Player.prototype.moveInsideDrawingArea = function() {
    if (this.x - (this.width() / 2) < globaldata.left) {
        this.x = globaldata.left + (this.width() / 2);
    } else if (this.x + (this.width() / 2) > globaldata.right) {
        this.x = globaldata.right - (this.width() / 2);
    }
    
    if (this.y - (this.height() / 2) < globaldata.top) {
        this.y = globaldata.top + (this.height() / 2);
    } else if (this.y + (this.height() / 2) > globaldata.bottom) {
        this.y = globaldata.bottom - (this.height() / 2);
    }
}

function PlayerTemplate() {
    this.spriteTemplate = null;
    this.spriteTemplateDead = null;
    this.ws = null;
    this.speed = 0;
    this.hitPoints = 0;
    this.deadSound = null;
    this.collissionSound = null;
}

PlayerTemplate.prototype.generate = function() {
    return new Player(this);
}

PlayerTemplate.prototype.clone = function() {
    var clone = new PlayerTemplate();
    clone.spriteTemplate = this.spriteTemplate;
    clone.spriteTemplateDead = this.spriteTemplateDead;
    clone.ws = this.ws == null ? null : this.ws.slice(0);
    clone.speed = this.Speed;
    clone.hitPoints = this.hitPoints;
    return clone;
}


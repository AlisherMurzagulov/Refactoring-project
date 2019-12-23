function Entity() {
    this.sprite = null;

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.zorder = 0;
    
    this.targetangle  = 0;
    this.speed = 0;
    this.turningspeed = 0;
    this.targetangle = null;
    
    // Buffer to store unused movement each update
    this.movementbuffer = 0;
}

Entity.prototype.width = function() {
    return this.sprite.width();
}

Entity.prototype.height = function() {
    return this.sprite.height();
}

// Returns true if entity is completely off screen
Entity.prototype.isOutOfDrawingArea = function() {
    if ((this.x + (this.width() / 2) < globalData.left) ||
        (this.x - (this.width() / 2) > globalData.right) ||
        (this.y + (this.height() / 2) < globalData.top) ||
        (this.y - (this.height() / 2) > globalData.bottom)) {
        return true;
    }
    
    return false;
}
Entity.prototype.cancollide = function() {
    return false;   
}

Entity.prototype.update = function(delta) {
    // ** Update sprite **
    this.sprite.update(delta);
    
    // ** Update x,y **
    // Get number of us to move
    var ustomove = this.speed * (delta / 1000);
    
    // Add left over us from the movement buffer
    ustomove += this.movementbuffer; 
    
    // Convert to movement in the x and y axies
    var movementX = ustomove * Math.sin(this.targetangle );
    var movementY = ustomove * Math.cos(this.targetangle );
    
    // Convert to whole us
    var usX = movementX > 0 ? Math.floor(movementX) : Math.ceil(movementX);
	var usY = movementY > 0 ? Math.floor(movementY) : Math.ceil(movementY);
    
    // Apply
    this.x += usX;ZZZz
    this.y -= usY; // The y-axis is inverted
    
    // Put unused movement back in the movement buffer for next time
    movementX -= usX;
    movementY -= usY;
    this.movementbuffer = Math.sqrt((movementX * movementX) + (movementY * movementY));
    
    // ** Update angle **
    // Get number of radians we can turn
    var numberofradians = this.turningspeed * (delta / 1000);
    var gotoTarget = false;
    
    if (numberofradians == 0 || this.targetangle == null) {
        gotoTarget = false
    }
    else if (numberofradians > 0)
    {
        var targetangle = this.targetAngle;
        while (targetangle < this.angle) {
            targetangle += 2 * Math.PI;
        }
        if (this.targetangle > this.angle &&
            this.targetangle < this.angle + numberofradians) {
            gotoTarget = true;
        }
    }
    else if (numberofradians < 0) {
        var targetangle = this.targetAngle;
        while (targetangle > this.angle) {
            targetangle -= 2 * Math.PI;
        }
        if (this.targetangle < this.angle &&
            this.targetangle > this.angle + numberofradians) {
            gotoTarget = true;
        }
    }
    
    if (gotoTarget) {
        this.angle = this.targetAngle;
    }
    else {
        this.angle += numberofradians;
    }
    
    // Keep -PI < angle <= PI
    if (this.angle > Math.PI) {
        this.angle -= 2 * Math.PI;
    }
    if (this.angle <= -Math.PI) {
        this.angle += 2 * Math.PI;
    }
}

Entity.prototype.render = function(context) {
    // Push matrix
    context.save();

    // Translate to the center of the entity's location
    context.translate(this.x, this.y);
                      
    // Apply translation around the center of the entity
    context.rotate(this.angle);
    
    // Translate to the top left corner to draw the image
    context.translate(-this.width() / 2, -this.height() / 2);
    
    // Draw the image
    context.drawImage(this.sprite.getCurrentImage(), 0, 0);
    
    // Pop matrix
    context.restore();
}


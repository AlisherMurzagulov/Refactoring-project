Decoration.prototype = new Entity();
Decoration.prototype.constructor = Entity;
function Decoration(decorationtemplate) {
    this.template = decorationtemplate;
    
    this.sprite = new Sprite(this.template.spritetemplate);
    this.speed = this.template.speed;
    this.turningspeed = this.template.turningspeed;
}

function decorationtemplate() {
    this.spritetemplate = null;
    this.speed = 200;
    this.turningspeed = 0;
}

decorationtemplate.prototype.generate = function() {
    return new Decoration(this);
}

decorationtemplate.prototype.clone = function() {
    var clone = new decorationtemplate();
    clone.spritetemplate = this.spritetemplate;
    clone.speed = this.speed;
    clone.turningspeed = this.turningspeed;
    return clone;
}


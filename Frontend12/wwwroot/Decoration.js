Decoration.prototype = new Entity();
Decoration.prototype.constructor = Entity;
function Decoration(decorationTemplate) {
    this.template = decorationTemplate;
    
    this.sprite = new Sprite(this.template.spriteTemplate);
    this.speed = this.template.speed;
    this.turningspeed = this.template.turningspeed;
}

function DecorationTemplate() {
    this.spriteTemplate = null;
    this.speed = 200;
    this.turningspeed = 0;
}

DecorationTemplate.prototype.generate = function() {
    return new Decoration(this);
}

DecorationTemplate.prototype.clone = function() {
    var clone = new DecorationTemplate();
    clone.spriteTemplate = this.spriteTemplate;
    clone.speed = this.speed;
    clone.turningspeed = this.turningspeed;
    return clone;
}

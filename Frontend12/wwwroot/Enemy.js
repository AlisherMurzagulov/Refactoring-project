Enemy.prototype = new Unit();
Enemy.prototype.constructor = Unit;
function Enemy(enemytemplate, point) {
    this.template = enemytemplate;
    
    this.sprite = new Sprite(this.template.spritetemplate);
    this.speed = this.template.speed;
    this.hitpoints = this.template.hitpoints;

    if (this.template.ws != null)
    {
        for (var i = 0; i < this.template.ws.length; i++) {
            this.addWeapon(new Weapon(this.template.ws[i], this));
        }
    }

    this.fireifpossible = true;
}

Enemy.prototype.entityType = "Enemy";

Enemy.prototype.getspritetemplatedead = function() {
    return this.template.spritetemplatedead;
}

function enemytemplate() {
    this.spritetemplate = null;
    this.spritetemplatedead = null;
    this.ws = null;
    this.speed = 0;
    this.hitpoints = 0;
    this.cash = 0;
    this.deadSound = null;
    this.collissionSound = null;
}

enemytemplate.prototype.generate = function() {
    return new Enemy(this);
}

enemytemplate.prototype.clone = function() {
    var clone = new enemytemplate();
    clone.spritetemplate = this.spritetemplate;
    clone.spritetemplatedead = this.spritetemplatedead;
    clone.ws = this.ws == null ? null : this.ws.slice(0);
    clone.speed = this.speed;
    clone.hitpoints = this.hitpoints;
    clone.cash = this.cash;
    clone.deadSound = this.deadSound;
    return clone;
}


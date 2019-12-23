Enemy.prototype = new u();
Enemy.prototype.constructor = u;
function Enemy(enemyTemplate) {
    this.template = enemyTemplate;
    
    this.sprite = new Sprite(this.template.spriteTemplate);
    this.speed = this.template.speed;
    this.hitPoints = this.template.hitPoints;

    if (this.template.ws != null)
    {
        for (var i = 0; i < this.template.ws.length; i++) {
            this.addWeapon(new Weapon(this.template.ws[i], this));
        }
    }

    this.fireIfPossible = true;
}

Enemy.prototype.entityType = "Enemy";

Enemy.prototype.getSpriteTemplateDead = function() {
    return this.template.spriteTemplateDead;
}

function EnemyTemplate() {
    this.spriteTemplate = null;
    this.spriteTemplateDead = null;
    this.ws = null;
    this.speed = 0;
    this.hitPoints = 0;
    this.cash = 0;
    this.deadSound = null;
    this.collissionSound = null;
}

EnemyTemplate.prototype.generate = function() {
    return new Enemy(this);
}

EnemyTemplate.prototype.clone = function() {
    var clone = new EnemyTemplate();
    clone.spriteTemplate = this.spriteTemplate;
    clone.spriteTemplateDead = this.spriteTemplateDead;
    clone.ws = this.ws == null ? null : this.ws.slice(0);
    clone.speed = this.speed;
    clone.hitPoints = this.hitPoints;
    clone.cash = this.cash;
    clone.deadSound = this.deadSound;
    return clone;
}


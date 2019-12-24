Enemy.prototype = new Unit();
Enemy.prototype.constructor = Unit;
function Enemy(enemyTemplate) {
    this.template = enemyTemplate;
    
    this.sprite = new Sprite(this.template.spriteTemplate);
    this.speed = this.template.speed;
    this.hitPoints = this.template.hitPoints;

    if (this.template.weaponTemplates != null) {
        for (var i = 0; i < this.template.weaponTemplates.length; i++) {
            this.addWeapon(new Weapon(this.template.weaponTemplates[i], this));
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
    this.weaponTemplates = null;
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
    clone.weaponTemplates = this.weaponTemplates == null ? null : this.weaponTemplates.slice(0);
    clone.speed = this.speed;
    clone.hitPoints = this.hitPoints;
    clone.cash = this.cash;
    clone.deadSound = this.deadSound;
    return clone;
}


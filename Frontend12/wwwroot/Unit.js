u.prototype = new Entity();
u.prototype.constructor = Entity;
function u() {
    this.fireIfPossible = false;
    
    this.hitPoints = 0;

    this.weapons_ = null;
    this.dying_ = false;
}

u.prototype.cancollide = function() {
    return !this.dying_;
}

u.prototype.takeDamage = function(hitPoints) {
    this.hitPoints -= hitPoints;
    
    if (this.hitPoints <= 0) {
        this.startDying();
        return true;
    }
    return false;
}

u.prototype.playCollissionSound = function() {
    if (this.template.collissionSound != null) {
        playSound(this.template.collissionSound)
    }
}

u.prototype.startDying = function() {
    if (this.dying_) {
        return;
    }
    this.dying_ = true;

    this.sprite = new Sprite(this.template.spriteTemplateDead);
    this.sprite.loop = false;
    this.speed = 0;

    if (this.template.deadSound != null) {
        playSound(this.template.deadSound)
    }
}

u.prototype.getSpriteTemplateDead = function() {}

u.prototype.addWeapon = function(weapon) {
    if (this.weapons_ == null) {
        this.weapons_ = [];
    }
    this.weapons_[this.weapons_.length] = weapon;
}

u.prototype.update = function(delta) {
    if (this.weapons_ != null) {
        for (var i = 0; i < this.weapons_.length; i++) {
            this.weapons_[i].update(delta);

            if (this.fireIfPossible && this.weapons_[i].canWeaponFire()) {
                this.weapons_[i].fireIfPossible();
            }
        }
    }

    Entity.prototype.update.call(this, delta);
}


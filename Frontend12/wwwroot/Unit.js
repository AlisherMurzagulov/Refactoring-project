Unit.prototype = new Entity();
Unit.prototype.constructor = Entity;
function Unit() {
    this.fireifpossible = false;
    
    this.hitpoints = 0;

    this.weapons_ = null;
    this.dying_ = false;
}

Unit.prototype.canCollide = function() {
    return !this.dying_;
}

Unit.prototype.takeDamage = function(hitpoints) {
    this.hitpoints -= hitpoints;
    
    if (this.hitpoints <= 0) {
        this.startDying();
        return true;
    }
    return false;
}

Unit.prototype.playCollissionSound = function() {
    if (this.template.collissionSound != null) {
        playSound(this.template.collissionSound)
    }
}

Unit.prototype.startDying = function() {
    if (this.dying_) {
        return;
    }
    this.dying_ = true;

    this.sprite = new Sprite(this.template.spritetemplatedead);
    this.sprite.loop = false;
    this.speed = 0;

    if (this.template.deadSound != null) {
        playSound(this.template.deadSound)
    }
}

Unit.prototype.isDead = function() {
    if (this.dying_) {
        return this.sprite.animationEnded;
    }
    return this.hitpoints <= 0 || Entity.prototype.isDead.call(this);
}

Unit.prototype.getspritetemplatedead = function() {}

Unit.prototype.addWeapon = function(weapon) {
    if (this.weapons_ == null) {
        this.weapons_ = [];
    }
    this.weapons_[this.weapons_.length] = weapon;
}

Unit.prototype.update = function(delta) {
    if (this.weapons_ != null) {
        for (var i = 0; i < this.weapons_.length; i++) {
            this.weapons_[i].update(delta);

            if (this.fireifpossible && this.weapons_[i].canweaponfire()) {
                this.weapons_[i].fireifpossible();
            }
        }
    }

    Entity.prototype.update.call(this, delta);
}


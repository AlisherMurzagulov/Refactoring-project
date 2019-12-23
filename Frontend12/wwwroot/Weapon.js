function Weapon(w, u) {
    this.w = w;
    this.u_ = u;
    
    this.timeUntilNextFire = 0;
}

Weapon.prototype.update = function(delta) {
    this.timeUntilNextFire -= delta;
    if (this.timeUntilNextFire < 0) {
        this.timeUntilNextFire = 0;
    }
}

Weapon.prototype.canWeaponFire = function() {
    return this.timeUntilNextFire == 0;
}

Weapon.prototype.fireIfPossible = function() {
    if (this.timeUntilNextFire == 0) {
        var projectile = new Projectile(this, this.u_.zorder - 0.5);
        globalData.newEntities.push(projectile);
    
        this.timeUntilNextFire = this.w.reloadTime;
    }
}

Weapon.prototype.getu = function() {
    return this.u_;
}

function w() {
    this.spriteTemplate = null;
    this.spriteTemplateDead = null;
    this.reloadTime = 0;
    this.speed = 0;
    this.damage = 0;
    this.xPositionPrc = 0;
    this.yPositionPrc = 0;
    this.offsetAngle = 0;
    this.fireSound = null;
}

w.prototype.clone = function() {
    var clone = new w();
    clone.spriteTemplate = this.spriteTemplate;
    clone.spriteTemplateDead = this.spriteTemplateDead;
    clone.reloadTime = this.reloadTime;
    clone.speed = this.speed;
    clone.damage = this.damage;
    clone.xPositionPrc = this.xPositionPrc;
    clone.yPositionPrc = this.yPositionPrc;
    clone.offsetAngle = this.offsetAngle;
    return clone;
}


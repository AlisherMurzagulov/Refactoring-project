function Weapon(w, unit) {
    this.w = w;
    this.unit_ = unit;
    
    this.timeuntilnextfire = 0;
}

Weapon.prototype.update = function(delta) {
    this.timeuntilnextfire -= delta;
    if (this.timeuntilnextfire < 0) {
        this.timeuntilnextfire = 0;
    }
}

Weapon.prototype.canweaponfire = function() {
    return this.timeuntilnextfire == 0;
}

Weapon.prototype.fireifpossible = function() {
    if (this.timeuntilnextfire == 0) {
        var projectile = new Projectile(this, this.unit_.zorder - 0.5);
        globalData.newEntities.push(projectile);
    
        this.timeuntilnextfire = this.w.reloadTime;
    }
}

Weapon.prototype.getUnit = function() {
    return this.unit_;
}

function w() {
    this.spritetemplate = null;
    this.spritetemplatedead = null;
    this.reloadTime = 0;
    this.speed = 0;
    this.damage = 0;
    this.xpositionprc = 0;
    this.ypositionprc  = 0;
    this.offsetangle = 0;
    this.fireSound = null;
}

w.prototype.clone = function() {
    var clone = new w();
    clone.spritetemplate = this.spritetemplate;
    clone.spritetemplatedead = this.spritetemplatedead;
    clone.reloadTime = this.reloadTime;
    clone.speed = this.speed;
    clone.damage = this.damage;
    clone.xpositionprc = this.xpositionprc;
    clone.ypositionprc  = this.ypositionprc ;
    clone.offsetangle = this.offsetangle;
    return clone;
}


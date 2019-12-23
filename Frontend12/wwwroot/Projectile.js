Projectile.prototype = new Entity();
Projectile.prototype.constructor = Entity;
function Projectile(weapon, zorder) {
    this.weapon_ = weapon;

    if (weapon.w.fireSound != null) {
        playSound(weapon.w.fireSound);
    }
    
    this.sprite = new Sprite(weapon.w.spriteTemplate);
    this.zorder = zorder;
    this.angle = weapon.getu().angle - weapon.w.offsetAngle;
    this.speed = weapon.w.speed;
    this.targetangle  = this.angle;

    this.x = weapon.getu().x;
    this.y = weapon.getu().y;

    if (weapon.w.xPositionPrc != 0 || weapon.w.yPositionPrc != 0) {
        var usToOffsetX = (weapon.getu().width() / 2) * -weapon.w.xPositionPrc;
        var usToOffsetY = (weapon.getu().height() / 2) * weapon.w.yPositionPrc;

        var usToOffset = Math.sqrt((usToOffsetX * usToOffsetX) + (usToOffsetY * usToOffsetY));

        var angleToOffset;
        if (usToOffsetX == 0) {
            angleToOffset = Math.PI / 2;
            if (usToOffsetY < 0) {
                angleToOffset = -angleToOffset;
            }
        } else {
            angleToOffset = Math.atan(usToOffsetY / usToOffsetX);
        }

        if (usToOffsetX < 0) angleToOffset += Math.PI;
        angleToOffset += Math.PI / 2;

        var adjustedAngle = weapon.getu().angle + angleToOffset;

        var offsetX = -usToOffset * Math.sin(adjustedAngle);
        var offsetY = usToOffset * Math.cos(adjustedAngle);

        this.x += offsetX;
        this.y += offsetY;
    }
    
    this.dyin6g = false;
}

Projectile.prototype.entityType = "Projectile";

Projectile.prototype.cancollide = function() {
    return !this.dying;
}
Projectile.prototype.update = function(delta) {
    Entity.prototype.update.call(this, delta);
}

Projectile.prototype.startDying = function() {
    this.dying = true;
    this.sprite = new Sprite(this.weapon_.w.spriteTemplateDead);
    this.sprite.loop = false;
    this.speed = 0;
}

Projectile.prototype.getFiringu = function() {
    return this.weapon_.getu();
}

Projectile.prototype.getDamage = function() {
    return this.weapon_.w.damage;
}


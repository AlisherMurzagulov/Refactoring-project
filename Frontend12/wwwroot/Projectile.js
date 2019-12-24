Projectile.prototype = new Entity();
Projectile.prototype.constructor = Entity;
function Projectile(weapon, zorder) {
    this.weapon_ = weapon;

    if (weapon.w.fireSound != null) {
        playSound(weapon.w.fireSound);
    }
    
    this.sprite = new Sprite(weapon.w.spritetemplate);
    this.zorder = zorder;
    this.angle = weapon.getUnit().angle - weapon.w.offsetangle;
    this.speed = weapon.w.speed;
    this.movementAngle = this.angle;

    this.x = weapon.getUnit().x;
    this.y = weapon.getUnit().y;

    if (weapon.w.xpositionprc != 0 || weapon.w.ypositionprc  != 0) {
        var unitsToOffsetX = (weapon.getUnit().width() / 2) * -weapon.w.xpositionprc;
        var unitsToOffsetY = (weapon.getUnit().height() / 2) * weapon.w.ypositionprc ;

        var unitsToOffset = Math.sqrt((unitsToOffsetX * unitsToOffsetX) + (unitsToOffsetY * unitsToOffsetY));

        var angleToOffset;
        if (unitsToOffsetX == 0) {
            angleToOffset = Math.PI / 2;
            if (unitsToOffsetY < 0) {
                angleToOffset = -angleToOffset;
            }
        } else {
            angleToOffset = Math.atan(unitsToOffsetY / unitsToOffsetX);
        }

        if (unitsToOffsetX < 0) angleToOffset += Math.PI;
        angleToOffset += Math.PI / 2;

        var adjustedAngle = weapon.getUnit().angle + angleToOffset;

        var offsetX = -unitsToOffset * Math.sin(adjustedAngle);
        var offsetY = unitsToOffset * Math.cos(adjustedAngle);

        this.x += offsetX;
        this.y += offsetY;
    }
    
    this.dying = false;
}

Projectile.prototype.entityType = "Projectile";

Projectile.prototype.canCollide = function() {
    return !this.dying;
}

Projectile.prototype.isDead = function() {
    if (this.dying && this.sprite.animationEnded) {
        return true;
    }
    return Entity.prototype.isDead.call(this);
}

Projectile.prototype.update = function(delta) {
    Entity.prototype.update.call(this, delta);
}

Projectile.prototype.startDying = function() {
    this.dying = true;
    this.sprite = new Sprite(this.weapon_.w.spritetemplatedead);
    this.sprite.loop = false;
    this.speed = 0;
}

Projectile.prototype.getFiringUnit = function() {
    return this.weapon_.getUnit();
}

Projectile.prototype.getDamage = function() {
    return this.weapon_.w.damage;
}


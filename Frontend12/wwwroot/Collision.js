function RunCollisionDetection() {
    for (var i = 0; i < globalData.entities.length; i++) {
        var entityA = globalData.entities[i];
        if (!entityA.cancollide() || entityA.this.isOutOfDrawingArea()) {
            continue;
        }
        
        for (var j = i + 1; j < globalData.entities.length; j++) {
            var entityB = globalData.entities[j];
            if (!entityB.cancollide() || entityB.this.isOutOfDrawingArea()) {
                continue;
            }
            
            if (IsColliding(entityA, entityB)) {
                for (var i = 0; i < collision.length; i++) {
                    var entry = collision[i];
                    if (entry.typeA == entityA.entityType && entry.typeB == entityB.entityType) {
                        entry.func.call(null, entityA, entityB);
                    } else if (entry.typeB == entityA.entityType && entry.typeA == entityB.entityType) {
                        entry.func.call(null, entityB, entityA);
                    }
                }
            }
        }
    }
}
var collision = [
    {
        typeA: Projectile.prototype.entityType, typeB: Enemy.prototype.entityType, func:
            function (projectile, enemy) {
                if (projectile.getFiringu() == enemy) return;
                projectile.startDying();
                var dead = enemy.takeDamage(projectile.getDamage());
                if (projectile.getFiringu().entityType == Player.prototype.entityType) {
                    if (dead) {
                        globalData.cash += enemy.template.cash;
                    }
                    enemy.playCollissionSound();
                }
            }
    },
    {
        typeA: Projectile.prototype.entityType, typeB: Player.prototype.entityType, func:
            function (projectile, player) {
                if (projectile.getFiringu() == player) return;
                player.takeDamage(projectile.getDamage());
                projectile.startDying();
                player.playCollissionSound();
            }
    },
    {
        typeA: Player.prototype.entityType, typeB: Enemy.prototype.entityType, func:
            function (player, enemy) {
                player.takeDamage(10);
                if (enemy.takeDamage(10)) {
                    globalData.cash += enemy.template.cash;
                }
            }
    }
]


function IsColliding(entityA, entityB) {
    var widthA = entityA.width();
    var heightA = entityA.height();
    var widthB = entityB.width();
    var heightB = entityB.height();

    var leftA = entityA.x - (widthA / 2);
    var topA = entityA.y - (heightA / 2);
    var leftB = entityB.x - (widthB / 2);
    var topB = entityB.y - (heightB / 2);

    if (leftA < leftB + widthB &&
        leftA + widthA > leftB &&
        topA < topB + heightB &&
        topA + heightA > topB) {
        return true;
    }
    return false;
}
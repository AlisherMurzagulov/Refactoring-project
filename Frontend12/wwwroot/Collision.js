function RunCollisionDetection() {
    for (var i = 0; i < globalData.entities.length; i++) {
        var A = globalData.entities[i];
        if (!A.canCollide() || A.isDead()) {
            continue;
        }
        
        for (var j = i + 1; j < globalData.entities.length; j++) {
            var B = globalData.entities[j];
            if (!B.canCollide() || B.isDead()) {
                continue;
            }
            
            if (IsColliding(A, B)) {
                CallCollisionFunction(A, B);
            }
        }
    }
}

function IsColliding(A, B) {
    var widthA = A.width();
    var heightA = A.height();
    var widthB = B.width();
    var heightB = B.height();

    var leftA = A.x - (widthA / 2);
    var topA = A.y - (heightA / 2);
    var leftB = B.x - (widthB / 2);
    var topB = B.y - (heightB / 2);

    if (leftA < leftB + widthB &&
        leftA + widthA > leftB &&
        topA < topB + heightB &&
        topA + heightA > topB) {
        return true;
    }
    return false;
}

function CallCollisionFunction(A, B) {
    for (var i = 0; i < collisionFunctions.length; i++) {
        var entry = collisionFunctions[i];
        if (entry.typeA == A.entityType && entry.typeB == B.entityType) {
            entry.func.call(null, A, B);
        } else if (entry.typeB == A.entityType && entry.typeA == B.entityType) {
            entry.func.call(null, B, A);
        }
    }
}

var collisionFunctions = [
    {typeA : Projectile.prototype.entityType, typeB : Enemy.prototype.entityType, func : 
    function(projectile, enemy) {
        if (projectile.getFiringUnit() == enemy) return;
        projectile.startDying();
        var dead = enemy.takeDamage(projectile.getDamage());
        if (projectile.getFiringUnit().entityType == Player.prototype.entityType) {
            if (dead) {
                globalData.cash += enemy.template.cash;
            }
            enemy.playCollissionSound();
        }
    }},
    {typeA : Projectile.prototype.entityType, typeB : Player.prototype.entityType, func : 
    function(projectile, player) {
        if (projectile.getFiringUnit() == player) return;
        player.takeDamage(projectile.getDamage());
        projectile.startDying();
        player.playCollissionSound();
    }},
    {typeA : Player.prototype.entityType, typeB : Enemy.prototype.entityType, func : 
    function(player, enemy) {
        player.takeDamage(10);
        if (enemy.takeDamage(10)) {
            globalData.cash += enemy.template.cash;
        }
    }}
]


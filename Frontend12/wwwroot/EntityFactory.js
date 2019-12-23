function EntityFactory(template, avgNumPerSecond) {
    this.template = template;
    this.avgNumPerSecond = avgNumPerSecond;
    this.spawnFrom = EntityFactory.spawnFromEnum.TOP;
    this.initialAngle = 0;
}

EntityFactory.spawnFromEnum = {
    TOP: 0,
    BOTTOM: 1,
    LEFT: 2,
    RIGHT: 3
}

EntityFactory.prototype.tryGenerate = function(delta, zorder) {
    var probability = this.avgNumPerSecond * (delta / 1000);
    
    if (Math.random() < probability) {
        var entity = this.template.generate();
        if (entity.entityType == Enemy.prototype.entityType && globalData.game.levelDurationExceeded()) {
            // TODO: This is a bit of a hack
            return;
        }
        globalData.newEntities.push(entity);
        
        switch (this.spawnFrom) {
            case EntityFactory.spawnFromEnum.TOP:
                entity.x = EntityFactory.getRandomEntityPosition(globalData.left, globalData.right, entity.width());
                entity.y = globalData.top - (entity.height() / 2) + 1;
                break;
            case EntityFactory.spawnFromEnum.BOTTOM:
                entity.x = EntityFactory.getRandomEntityPosition(globalData.left, globalData.right, entity.width());
                entity.y = globalData.bottom + (entity.height() / 2) - 1;
                break;
            case EntityFactory.spawnFromEnum.LEFT:
                entity.x = globalData.left - (entity.width() / 2) + 1;
                entity.y = EntityFactory.getRandomEntityPosition(globalData.top, globalData.bottom, entity.height());
                break;
            case EntityFactory.spawnFromEnum.RIGHT:
                entity.x = globalData.right + (entity.width() / 2) - 1;
                entity.y = EntityFactory.getRandomEntityPosition(globalData.top, globalData.bottom, entity.height());
                break;
        }

        entity.angle = this.initialAngle;
        entity.targetangle  = this.initialAngle;
        entity.zorder = zorder;
    }
}

EntityFactory.getRandomEntityPosition = function(from, to, entitySize) {
    return Math.floor((Math.random() * (to - entitySize)) + (entitySize / 2) + from);
}


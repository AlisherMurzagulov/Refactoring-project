function Mod(modURI, assetPath) {
    
    this.modURI = modURI;
    this.assetPath = assetPath ? assetPath : '';
    
    this.parsed = false;
    this.broken = false;
    
    this.spritetemplates = new Object();
    this.soundTemplates = new Object();
    this.decorationtemplates = new Object();
    this.enemytemplates = new Object();
    this.ws = new Object();
    this.levelTemplates = new Object();
    this.playerTemplate = null;

    this.onLoad = null;
    this.onError = null;

    this.imagesLoaded = [];
    this.audiosLoaded = [];
    this.loaded = false;
}

Mod.prototype.load = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", this.modURI, false);
    xmlhttp.send();
    
    var xmlDoc = xmlhttp.responseXML;
    
    // TODO: version checks etc
    
    // Parse the xml until it's loaded
    var rootNode = xmlDoc.documentElement;
    while (!this.parsed && !this.broken) {
        this.parsed = true;
        this.broken = true;
        this.parseRootNode(rootNode);
    }

    if (this.broken) {
        alert("The mod file is broken!");
    }
}

Mod.prototype.isLoaded = function() {
    if (this.loaded) {
        return true;
    }

    if (this.loadPrc() == 1) {
        return true;
    }
}

Mod.prototype.loadPrc = function() {
    var loadedCount = 0;
    var total = this.imagesLoaded.length + this.audiosLoaded.length;
    var i;

    for (i = 0; i < this.imagesLoaded.length; i++) {
        if (this.imagesLoaded[i]) {
            loadedCount++;
        }
    }

    for (i = 0; i < this.audiosLoaded.length; i++) {
        if (this.audiosLoaded[i].readyState > 2) {
            loadedCount++;
        }
    }

    if (loadedCount == total) {
        this.loaded = true;
        this.imagesLoaded = [];
        this.audiosLoaded = [];
        return 1;
    }
    return loadedCount / total;
}

Mod.prototype.watchImageAsset = function(image) {
    var nextIndex = this.imagesLoaded.length;
    var imagesLoaded = this.imagesLoaded;

    imagesLoaded[nextIndex] = false;
    
    image.onload = function() {
        imagesLoaded[nextIndex] = true;
    };
}

Mod.prototype.watchAudioAsset = function(audio) {
    var nextIndex = this.audiosLoaded.length;
    var audiosLoaded = this.audiosLoaded;

    audiosLoaded[nextIndex] = audio;
}

Mod.prototype.parseRootNode = function(rootNode) {
    for (var i = 0; i < rootNode.childNodes.length; i++) {
        var childNode = rootNode.childNodes[i];
        switch (rootNode.childNodes[i].nodeName) {
            case "spritetemplates":
                this.parseTemplateCollectionNode(childNode, "spritetemplate");
                break;
            case "soundTemplates":
                this.parseTemplateCollectionNode(childNode, "soundTemplate");
                break;
            case "decorationtemplates":
                this.parseTemplateCollectionNode(childNode, "decorationtemplate");
                break;
            case "enemytemplates":
                this.parseTemplateCollectionNode(childNode, "enemytemplate");
                break;
            case "ws":
                this.parseTemplateCollectionNode(childNode, "w");
                break;
            case "levelTemplates":
                this.parseTemplateCollectionNode(childNode, "levelTemplate");
                break;
            case "playerTemplate":
                if (this.playerTemplate == null && !this.parsePlayerTemplateNode(childNode)) {
                    this.parsed = false;
                }    
                break;
            default:
                break;
        }
    }
}

Mod.prototype.parseTemplateCollectionNode = function(node, childrenNodeName) {
    for (var i = 0; i < node.childNodes.length; i++) {
        this.parseTemplateNode(node.childNodes[i], childrenNodeName);
    }
}

Mod.prototype.parseTemplateNode = function(node, nodeName) {
    if (node.nodeType != Node.ELEMENT_NODE) {
        return;
    }
    
    var templateType;
    var templateList;
    var parseFunc;
    
    switch (nodeName) {
        case "spritetemplate":
            templateType = spritetemplate;
            templateList = this.spritetemplates;
            parseFunc = this.parsespritetemplateNode;
            break;
        case "soundTemplate":
            templateType = SoundTemplate;
            templateList = this.soundTemplates;
            parseFunc = this.parseSoundTemplateNode;
            break;
        case "decorationtemplate":
            templateType = decorationtemplate;
            templateList = this.decorationtemplates;
            parseFunc = this.parsedecorationtemplateNode;
            break;
        case "enemytemplate":
            templateType = enemytemplate;
            templateList = this.enemytemplates;
            parseFunc = this.parseenemytemplateNode;
            break;
        case "w":
            templateType = w;
            templateList = this.ws;
            parseFunc = this.parsewNode;
            break;
        case "levelTemplate":
            templateType = LevelTemplate;
            templateList = this.levelTemplates;
            parseFunc = this.parseLevelTemplateNode;
            break;
        default:
            return;
    }
    
    var entitySrcName = node.getAttribute('src');
    var entityName = node.getAttribute('name');
    
    var entity = null;
    var entitySrc = null;
    
    // If this entity has already been loaded, return it
    entity = templateList[entityName];
    if (entity != null) {
        return entity;
    }
    
    // If there is a src attribute, fetch the source entity
    if (entitySrcName != null) {
        entitySrc = templateList[entitySrcName];
        // If the source hasn't been loaded yet, we'll need another pass
        if (entitySrc == null) {
            this.parsed = false;
            return;
        }
    }

    // If this node has no children, we don't need to create a new entity
    if (node.childNodes.length == 0) {
        return entitySrc;
    }
    
    // Create a new entity or create a copy of the source entity
    if (entitySrc == null) {
        entity = new templateType();
    } else {
        entity = entitySrc.clone();
    }
    
    // Call template specific function to parse node data into entity
    if (!parseFunc.call(this, node, entity)) {
        // A referenced entity isn't loaded yet, we'll need another pass
        this.parsed = false;
        return;
    }
    
    // If this entity has a name, store this entity in the list
    if (entityName != null) {
        templateList[entityName] = entity;
    }

    // If we don't make it this far in a single pass, the mod is broken
    this.broken = false;
    
    return entity;
}

Mod.prototype.parsespritetemplateNode = function(node, entity) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "images":
                var imageNodes = childNode.getElementsByTagName("image");
                var images = [];
                for (var j = 0; j < imageNodes.length; j++) {
                    var image = new Image();
                    var seq = imageNodes[j].getAttribute("seq");
                    image.src = this.assetPath + imageNodes[j].childNodes[0].nodeValue;
                    this.watchImageAsset(image);
                    images[seq] = image;
                }
                for (j = 0; j < images.length; j++) {
                    if (images[j]) {
                        entity.images.push(images[j]);
                    }
                }
                break;
            default:    
                break;
        }
    }
    
    return true;
}

Mod.prototype.parseSoundTemplateNode = function(node, entity) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "filename":
                entity.filename = this.assetPath + childNode.childNodes[0].nodeValue;

                var audio = entity.createAudioElement();
                // NOTE: FF3.6 hangs at the loading screen with the next line. Works in FF4.
                this.watchAudioAsset(audio);
                break;
            default:    
                break;
        }
    }
    
    if (entity.filename == null) {
        return false;
    }
    return true;
}

Mod.prototype.parsedecorationtemplateNode = function(node, entity) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "spritetemplate":
                entity.spritetemplate = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "speed":
                entity.speed = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "turningspeed":
                entity.turningspeed = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            default:    
                break;
        }
    }
    
    if (entity.spritetemplate == null) {
        return false;
    }
    return true;
}

Mod.prototype.parseenemytemplateNode = function(node, entity) {
    var wsLoaded = true;
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "spritetemplate":
                entity.spritetemplate = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "spritetemplatedead":
                entity.spritetemplatedead = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "w":
                wsLoaded = false;
                var w = this.parseTemplateNode(childNode, 'w');
                if (w != null) {
                    if (entity.ws == null) {
                        entity.ws = [];
                    }
                    entity.ws[entity.ws.length] = w;
                    wsLoaded = true;
                }
                break;
            case "speed":
                entity.speed = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "hitpoints":
                entity.hitpoints = parseInt(childNode.childNodes[0].nodeValue);
                break;
            case "cash":
                entity.cash = parseInt(childNode.childNodes[0].nodeValue);
                break;
            case "deadSound":
                entity.deadSound = this.parseTemplateNode(childNode, 'soundTemplate');
                break;
            case "collissionSound":
                entity.collissionSound = this.parseTemplateNode(childNode, 'soundTemplate');
                break;
            default:    
                break;
        }
    }
    
    if (entity.spritetemplate == null || entity.spritetemplatedead == null || !wsLoaded) {
        return false;
    }
    return true;
}

Mod.prototype.parsewNode = function(node, entity) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "spritetemplate":
                entity.spritetemplate = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "spritetemplatedead":
                entity.spritetemplatedead = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "reloadTime":
                entity.reloadTime = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "speed":
                entity.speed = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "damage":
                entity.damage = parseInt(childNode.childNodes[0].nodeValue);
                break;
            case "xpositionprc":
                entity.xpositionprc = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "ypositionprc ":
                entity.ypositionprc  = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "offsetangle":
                entity.offsetangle = this.parseAngle(childNode);
                break;
            case "fireSound":
                entity.fireSound = this.parseTemplateNode(childNode, 'soundTemplate');
                break;
            default:    
                break;
        }
    }
    
    if (entity.spritetemplate == null || entity.spritetemplatedead == null) {
        return false;
    }
    return true;
}

Mod.prototype.parseLevelTemplateNode = function(node, entity) {
    var loaded = true;
    
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "duration":
                entity.duration = parseInt(childNode.childNodes[0].nodeValue);
                break;
            case "entityFactories":
                for (var j = 0; j < childNode.childNodes.length; j++) {
                    if (childNode.childNodes[j].nodeName != "entityFactory") continue;
                    var entityFactoryNode = childNode.childNodes[j];

                    var template;
                    var avgNumPerSecond;
                    var spawnFrom;
                    var initialAngle;
                    
                    for (var k = 0; k < entityFactoryNode.childNodes.length; k++) {
                        var efChildNode = entityFactoryNode.childNodes[k];
                        
                        switch (efChildNode.nodeName) {
                            case "avgNumPerSecond":
                                avgNumPerSecond = parseFloat(efChildNode.childNodes[0].nodeValue);
                                break;
                            case "spawnFrom":
                                spawnFrom = efChildNode.childNodes[0].nodeValue;
                                break;
                            case "initialAngle":
                                initialAngle = this.parseAngle(efChildNode);
                                break;
                                
                            case "decorationtemplate":
                            case "enemytemplate":
                                template = this.parseTemplateNode(efChildNode, efChildNode.nodeName);
                                break;
                            default:
                                break;
                        }
                    }
                    
                    var entityFactory = new EntityFactory(template, avgNumPerSecond);
                    entityFactory.spawnFrom = EntityFactory.spawnFromEnum[spawnFrom.toUpperCase()];
                    entityFactory.initialAngle = initialAngle;
                    entity.entityFactories.push(entityFactory);
                    if (entityFactory.template == null) {
                        loaded = false;
                    }
                }

                break;
            default:    
                break;
        }
    }
    
    return loaded;
}

Mod.prototype.parsePlayerTemplateNode = function(node) {
    var entity = new PlayerTemplate();
    var wsLoaded = true;
    
    for (var i = 0; i < node.childNodes.length; i++) {
        var childNode = node.childNodes[i];
        
        switch (childNode.nodeName) {
            case "spritetemplate":
                entity.spritetemplate = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "spritetemplatedead":
                entity.spritetemplatedead = this.parseTemplateNode(childNode, 'spritetemplate');
                break;
            case "w":
                wsLoaded = false;
                var w = this.parseTemplateNode(childNode, 'w');
                if (w != null) {
                    if (entity.ws == null) {
                        entity.ws = [];
                    }
                    entity.ws[entity.ws.length] = w;
                    wsLoaded = true;
                }
                break;
            case "speed":
                entity.speed = parseFloat(childNode.childNodes[0].nodeValue);
                break;
            case "hitpoints":
                entity.hitpoints = parseInt(childNode.childNodes[0].nodeValue);
                break;
            case "deadSound":
                entity.deadSound = this.parseTemplateNode(childNode, 'soundTemplate');
                break;
            case "collissionSound":
                entity.collissionSound = this.parseTemplateNode(childNode, 'soundTemplate');
                break;
            default:    
                break;
        }
    }
    
    this.playerTemplate = entity;
    
    if (entity.spritetemplate == null || entity.spritetemplatedead == null || !wsLoaded) {
        return false;
    }
    return true;
}

Mod.angleEnum = {
    UP: 0,
    DOWN: Math.PI,
    LEFT: Math.PI / 2,
    RIGHT: -Math.PI / 2
}

Mod.prototype.parseAngle = function(node) {
    var angle = NaN;

    if (node.childNodes.length > 0) {
        angle = parseFloat(node.childNodes[0].nodeValue);
        if (angle != NaN) {
            return angle;
        }
    }
    
    var entitySrcName = node.getAttribute('src');

    if (entitySrcName != null) {
        angle = Mod.angleEnum[entitySrcName.toUpperCase()];
    }

    return angle;
}


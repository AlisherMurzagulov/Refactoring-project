function playSound(soundTemplate) {
    if (!globalData.playSound) {
        return;
    }
    if (globalData.sounds == null) {
        globalData.sounds = new Array();
    }
    if (globalData.sounds[soundTemplate.filename] == null) {
        globalData.sounds[soundTemplate.filename] = new Array();
    }
    var audioList = globalData.sounds[soundTemplate.filename];

    var audio = null;
    for (var i = 0; i < audioList.length; i++) {
        if (audioList[i].ended) {
            audio = audioList[i];
        }
    }

    if (audio == null) {
        audio = soundTemplate.createAudioElement();
        audioList[audioList.length] = audio;
        pos = audioList.length - 1;
        //debug("New sound slot created for: " + soundTemplate.filename);
    }
    
    audio.play();
}
 
function SoundTemplate() {
    this.filename = "";
}

SoundTemplate.prototype.createAudioElement = function() {
    return new Audio(this.filename);
}

SoundTemplate.prototype.clone = function() {
    var clone = new SoundTemplate();
    clone.filename = this.filename;
    return clone;
}


function initUserInput(canvas) {
    document.onkeydown = keyDownHandler;
    document.onkeyup = keyUpHandler;
    document.onkeypress = keyPressHandler;
    
    canvas.addEventListener("mousedown", mouseDownHandler, false);
    canvas.addEventListener("mouseup", mouseUpHandler, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);
}

function keyDownHandler(event) {
    setInputVar(event.k, true);
}

function keyUpHandler(event) {
    setInputVar(event.k, false);
}

function keyPressHandler(event) {
    var key = String.fromCharCode(event.charCode);
    switch (key) {
        case 'r': 
            globalData.freeRangeMode = !globalData.freeRangeMode;
            break;
        case 's': 
            globalData.playSound = !globalData.playSound;
            break;
        case 'p': 
            if (globalData.game.isPaused()) {
                globalData.game.start();
            } else {
                globalData.game.pause();
            }
            break;
        default:
            break;
    }
}

function mouseDownHandler(event) {
    globalData.inputGo = true;
    globalData.inputGoX = event.clientX - event.currentTarget.offsetLeft;
    globalData.inputGoY = event.clientY - event.currentTarget.offsetTop;
}

function mouseUpHandler(event) {
    globalData.inputGo = false;
}

function mouseMoveHandler(event) {
    globalData.inputGoX = event.clientX - event.currentTarget.offsetLeft;
    globalData.inputGoY = event.clientY - event.currentTarget.offsetTop;
}

function setInputVar(k, state)
{
    if (k == 37)
        globalData.inputLeft = state;
    if (k == 38)
        globalData.inputUp = state;
    if (k == 39)
        globalData.inputRight = state;
    if (k == 40)
        globalData.inputDown = state;
    if (k == 17)
        globalData.inputShoot = state;
}


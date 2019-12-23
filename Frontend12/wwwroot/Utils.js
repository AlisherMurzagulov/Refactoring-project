function Utils() { }

Utils.prototype.DrawProgressBar = function(context, x, y, width, height, prc) {
    var value = 3;
    var BAR = '#009900';
    var BORDER = '#009900';
    var BACKGROUND = "#000000";

    context.fillStyle = BACKGROUND;
    context.fillRect(x, y, width, height);

    context.strokeStyle = BORDER;
    context.lineWidth = 1;
    context.strokeRect(x, y, width, height);

    if (prc > 0) {
        var totalProgressHeight = height - (2 * value);
        var progressHeight = totalProgressHeight * prc;

        var barX = x + value;
        var barY = (y + height) - value - progressHeight;
        var barWidth = width - (2 * value);
        var barHeight = progressHeight;

        context.fillStyle = BAR;
        context.fillRect(barX, barY, barWidth, barHeight);
    }
}

Utils.prototype.DisplayMessage = function(context, message,title) {
    context.fillStyle = '#009900';
    context.font = '24px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText(message, globalData.game.totalCanvasWidth() / 2, globalData.game.totalCanvasHeight() / 3);
}


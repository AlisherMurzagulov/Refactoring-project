function Utils() { }

Utils.prototype.DrawProgressBar = function(context, x, y, width, height, prc) {
    var BAR_TO_BORDER_GAP = 3;
    var BAR_STYLE = '#009900';
    var BORDER_STYLE = '#009900';
    var BACKGROUND_STYLE = "#000000";

    context.fillStyle = BACKGROUND_STYLE;
    context.fillRect(x, y, width, height);

    context.strokeStyle = BORDER_STYLE;
    context.lineWidth = 1;
    context.strokeRect(x, y, width, height);

    if (prc > 0) {
        var totalProgressHeight = height - (2 * BAR_TO_BORDER_GAP);
        var progressHeight = totalProgressHeight * prc;

        var barX = x + BAR_TO_BORDER_GAP;
        var barY = (y + height) - BAR_TO_BORDER_GAP - progressHeight;
        var barWidth = width - (2 * BAR_TO_BORDER_GAP);
        var barHeight = progressHeight;

        context.fillStyle = BAR_STYLE;
        context.fillRect(barX, barY, barWidth, barHeight);
    }
}

Utils.prototype.DisplayMessage = function(context, message) {
    context.fillStyle = '#009900';
    context.font = '24px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText(message, globalData.game.totalCanvasWidth() / 2, globalData.game.totalCanvasHeight() / 3);
}


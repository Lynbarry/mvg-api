"use strict";

let Line = function (lineNumber, lineDestination, lineDepartureIn) {
    this.lineNumber = lineNumber;
    this.lineDestination = lineDestination;
    this.lineDepartureIn = parseInt(lineDepartureIn);
};

Line.prototype.valueOf = function () {
    return this.lineDepartureIn;
}

Line.prototype.toString = function lineToString() {
    return "\r\n" + this.lineDepartureIn +
        "\tLine " + this.lineNumber +
        ":\t" + this.lineDestination;
}

exports = module.exports = Line
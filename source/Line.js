"use strict";

let Line = function (lineNumber, lineDestination, lineDepartureIn, lineType) {
    this.lineNumber = lineNumber;
    this.lineDestination = lineDestination;
    this.lineDepartureIn = parseInt(lineDepartureIn);
    this.lineType = lineType;
};

Line.prototype.valueOf = function () {
    return this.lineDepartureIn;
}

Line.prototype.toString = function lineToString() {
    return `\r\n ${this.lineDepartureIn} \t ${this.lineType} ${this.lineNumber}:\t ${this.lineDestination}`;
}

exports = module.exports = Line
"use strict";

/**
 * @param {String} lineNumber 'The number of the line, for example 'U6'.
 * @param {String} lineDestination The name of the destination station.
 * @param {Number} lineDepartureIn The time until departure in minutes.
 * @param {String} lineType The type of line, for example 'UBAHN'.
 */
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
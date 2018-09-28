"use strict";

/**
 * @param {String} lineNumber 'The number of the line, for example '6'.
 * @param {String} lineDestination The name of the destination station.
 * @param {Number} lineDepartureIn The time until departure in minutes.
 * @param {String} lineType The type of line, for example 'u'.
 */
let Line = function (lineNumber, lineDestination, lineDepartureIn, lineType) {
    this.lineNumber = getLineNumber(lineNumber);
    this.lineDestination = lineDestination;
    this.lineDepartureIn = parseInt(lineDepartureIn);
    this.lineType = lineType;
};

Line.prototype.valueOf = function () {
    return this.lineDepartureIn;
}

Line.prototype.toString = function lineToString() {
    return `\r\n ${this.lineDepartureIn} \t ${this.lineName()}:\t ${this.lineDestination}`;
}

Line.prototype.lineName = function() {
    switch(this.lineType) {
        case 'u':
            return `U${this.lineNumber}`;
        case 's':
            return `S${this.lineNumber}`;
        case 'b':
            return `Bus ${this.lineNumber}`;
        case 't':
            return `Tram ${this.lineNumber}`;
        default:
            return `${this.lineType} ${this.lineNumber}`;
    }
}

function getLineNumber(mvgLineNumber) {
    return parseInt(mvgLineNumber.match(/\d+/g)[0])
}


exports = module.exports = Line
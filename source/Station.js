"use strict";

let Station = function (name) {
    this.name = name;
}

Station.prototype.toString = function stationToString() {
    return "\r\n" + this.name
}

exports = module.exports = Station
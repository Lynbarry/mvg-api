"use strict";

let Station = function (name) {
    this.name = name;
}

Station.prototype.toString = function stationToString() {
    return "\r\n" + this.name
}

Station.prototype.getStationName = function getStationName() {
    return this.name
}

exports = module.exports = Station
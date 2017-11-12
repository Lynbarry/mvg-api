"use strict";
const mvg = require('./mvgApi');

let Station = function (name) {
    this.name = name;
};

Station.prototype.toString = function stationToString() {
    return "\r\n" + this.name
};

Station.prototype.getStationName = function getStationName() {
    return this.name
};

Station.prototype.getDepartures = function getStationDepartures() {
    mvg.getDepartures(this.name).then(departures => {
            console.log(departures.toString());
        }
    );
};

exports = module.exports = Station;
"use strict";
const cheerio = require("cheerio");
const request = require("request");
const util = require('util');

var Line = function(lineNumber, lineDestination, lineDepartureIn) {
    this.lineNumber = lineNumber;
    this.lineDestination = lineDestination;
    this.lineDepartureIn = parseInt(lineDepartureIn);
};

Line.prototype.valueOf = function() {
    return this.lineDepartureIn;
}

Line.prototype.toString = function lineToString() {
    return "\r\nLine " + this.lineNumber + ": " + this.lineDestination + " " + this.lineDepartureIn;
}

function compareLines(lineA, lineB) {
    return lineA.lineDepartureIn - lineB.lineDepartureIn;
}

function sendStationRequest(station) {
    const requestUrl = 'http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=' + station;
    request(requestUrl, (error, response, body) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(body);
            const lines = $('.rowEven, .rowOdd');
            let linesArr = [];

            lines.map((index, element) => {
                var cheerioElement = $(element);
                const lineNumber = getLineNumber(cheerioElement);
                const lineName = getDestinationName(cheerioElement);
                const lineDepartureIn = getLineDepartureIn(cheerioElement); 
                linesArr.push(new Line(lineNumber, lineName, lineDepartureIn));

            });

            let linesSorted = linesArr.sort(compareLines);
        } else {
            console.log("Error: " + error);
        }
    });
}

function getLineNumber(cheerioElement) {
    return cheerioElement.find('.lineColumn').text()
}

function getDestinationName(cheerioElement) {
    return cheerioElement.find('.stationColumn').text().trim()
}

function getLineDepartureIn(cheerioElement) {
    return cheerioElement.find('.inMinColumn').text(); 
}

exports.getDepartures = function(station) {
    sendStationRequest(station);
}

sendStationRequest("Harras");
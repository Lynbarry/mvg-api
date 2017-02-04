"use strict";
const request = require('request');
const htmlparser = require('htmlparser2');
const select = require('soupselect').select;
const util = require('util');

function logNested(object) {
    console.log("logging");
    console.log(util.inspect(object, {showHidden: false, depth: null}));
}

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

function createLineFromDomData(line) {
    const lineNumber = line.children[1].children[0].data.trim();
    const lineDestination = line.children[3].children[0].data.trim();
    const lineDepartureIn = line.children[5].children[0].data.trim();
    return new Line(lineNumber, lineDestination, lineDepartureIn);
}

function compareLines(lineA, lineB) {
    return lineA.lineDepartureIn - lineB.lineDepartureIn;
}

function isStationUnambiguous(dom) {
    const headerStationColumn = select(dom, ".headerStationColumn");
    return headerStationColumn.length > 0;
}

const handler = new htmlparser.DomHandler((error, dom) => {
    logNested(dom);
    if (isStationUnambiguous(dom)) {
        var station = select(dom, ".headerStationColumn")[0].children[0].data;
        var time = select(dom, ".serverTimeColumn")[0].children[0].data;
        var linesEven = select(dom, ".rowEven").map((line) => createLineFromDomData(line));
        var linesOdd = select(dom, ".rowOdd").map((line) => createLineFromDomData(line));

        var lines = linesEven.concat(linesOdd).sort(compareLines);
        return lines;
    } else {
        console.log(select(dom, ".departureTable li a").map(listElement => listElement.children[0].data));
    }
});

const parser = new htmlparser.Parser(handler);

function sendStationRequest(station) {
    const requestUrl = 'http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=' + station;
    request(requestUrl, (error, response, body) => {
        if(!error && response.statusCode == 200) {
            var a = parser.write(body);            
            var b = parser.done();            
        } else {
            console.log("Error: " + error);
        }
    });
}

var p1 = new Promise((resolve, reject) => {
    sendStationRequest("Harras", resolve, reject)
});

exports.getDepartures = function(station) {
    sendStationRequest(station);
}

exports.line = function(a,b,c) {
    return new Line(a,b,c);
};
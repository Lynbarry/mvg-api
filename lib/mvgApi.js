"use strict";
const cheerio = require("cheerio");
const request = require("request");
const Line = require("./Line");
const iconv = require("iconv-lite");

/**
 * Get the departures for a certain station.
 *
 * @station String The name of the station you want to get the departures for.
 * @options Array An array of the types of transportation you want to have shown.
 *          Can be one or more of the following:
 *          "ubahn", "sbahn", "tram", "bus"
 *          If not provided, departures for all kinds of transit are shown.
 */
function getDepartures(station, options) {

    let transitParams = buildTransitParams(options);

    const requestUrl = 'https://cors-anywhere.herokuapp.com/https://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle='.concat(station).concat(transitParams);

    const linesPromise = new Promise((resolve, reject) => {
        request.get({uri: requestUrl, encoding: null}, (error, response, body) => {
            if (!error && response.statusCode == 200) {

                const cheerioPage = initCheerio(body);
                const lines = cheerioPage('.rowEven, .rowOdd');
                const linesArr = extractLineInfo(lines, cheerioPage);
                const linesSorted = sortLines(linesArr);

                resolve(linesSorted);
            } else if (!error) {
                console.log("Connection error, status code: " + response.statusCode);
                reject(response.statusCode);
            } else {
                console.log("Error: " + error);
                reject(error);
            }
        });
    });

    return linesPromise;
}

function buildTransitParams(options) {
    let transitParams = "";
    if (typeof options != 'undefined') {
        options.forEach(transitType => {
            transitParams = transitParams.concat("&").concat(transitType).concat("=checked");
        });
    }
    return transitParams;
}

function initCheerio(body) {
    const utf8string = convertIsoResponseToUtf8(body);
    return cheerio.load(utf8string);
}

function convertIsoResponseToUtf8(body) {
    return iconv.decode(new Buffer(body), "ISO-8859-1");
}

function extractLineInfo(lines, cheerioPage) {
    const linesArr = [];
    lines.map((index, element) => {
        const cheerioElement = cheerioPage(element);
        const line = getLineFromCheerioElement(cheerioElement);
        linesArr.push(line);
    });
    return linesArr;
}

function getLineFromCheerioElement(cheerioElement) {
    const lineNumber = getLineNumber(cheerioElement);
    const lineName = getDestinationName(cheerioElement);
    const lineDepartureIn = getLineDepartureIn(cheerioElement);

    return new Line(lineNumber, lineName, lineDepartureIn)
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

function sortLines(linesArr) {
    return linesArr.sort(compareLines);
}

function compareLines(lineA, lineB) {
    return lineA.lineDepartureIn - lineB.lineDepartureIn;
}

exports.getDepartures = getDepartures;
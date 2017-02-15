"use strict";
const cheerio = require("cheerio");
const request = require("request");
const Line = require("./Line");
const iconv = require("iconv");

function getDepartures(station) {
    const requestUrl = 'http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=' + station;

    const linesPromise = new Promise((resolve, reject) => {
            request({uri: requestUrl, encoding: null}, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    
                    const cheerioPage = initCheerio(body);
                    const lines = cheerioPage('.rowEven, .rowOdd');
                    const linesArr = extractLineInfo(lines, cheerioPage);
                    const linesSorted = sortLines(linesArr);

                    resolve(linesSorted);
                } else if (!error) {
                    console.log("Connection error, status code: " + response.statusCode);
                    reject(status);
                } else {
                    console.log("Error: " + error);
                    reject(error);
                }
            });
    });

    return linesPromise;
}

function initCheerio(body) {
    const utf8string = convertIsoResponseToUtf8(body);
    const cheerioPage = cheerio.load(utf8string);
    return cheerioPage;
}

function convertIsoResponseToUtf8(body) {
    const conversion = new iconv.Iconv('iso-8859-1', 'utf-8');
    const conversionBuffer = conversion.convert(body);
    const utf8string = conversionBuffer.toString("utf-8");
    return utf8string;
}

function extractLineInfo(lines, cheerioPage) {
    const linesArr = [];
    lines.map((index, element) => {
        const cheerioElement = cheerioPage(element);
        const line = getLineFromCheerioElement(cheerioElement)
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
"use strict";
const request = require("request");
const Line = require("./Line");
const defaultApi = "https://www.mvg-live.de/ims/dfiStaticAuswahl.svc";

const mvgHeader = {
    "X-MVG-Authorization-Key": "5af1beca494712ed38d313714d4caff6"
}

/**
 * Departure endpoint. Returns Json in the form of:
 * 
 * {
        "departures": [
            {
                "departureTime": 1510687290000,
                "product": "b",
                "label": "X30",
                "destination": "Ostbahnhof",
                "live": true,
                "lineBackgroundColor": "#5c947d",
                "departureId": -1297847819,
                "sev": false
            },
            ...
        ]
    }
 */
const departureIdEndpoint = (id) => `https://www.mvg.de/fahrinfo/api/departure/${id}?footway=0`;

/**
 * Station endpoint. Can be used with IDs or station names.
 * 
 * Returns Json in the form of:
 * 
 * {
        "locations": [
            {
                "type": "station",
                "latitude": 48.116876,
                "longitude": 11.536213,
                "id": 1130,
                "place": "München",
                "name": "Harras",
                "hasLiveData": false,
                "hasZoomData": true,
                "products": [
                    "b",
                    ...
                ],
                "lines": {
                    "tram": [],
                    "nachttram": [],
                    "sbahn": [
                        "7"
                    ],
                    "ubahn": [
                        "6"
                    ],
                    "bus": [
                        "53",
                        ...
                    ],
                    "nachtbus": [
                        "40",
                        "41"
                    ],
                    "otherlines": []
                }
            }
        ],...
    }
 */
const stationEndpoint = (identifier) => `https://www.mvg.de/fahrinfo/api/location/query?q=${identifier}`;

function getDepartures(stationName, options, apiRedirectUrl) {
    return getStationId(stationName)
    .then(stationId =>  getDeparturesById(stationId, options, apiRedirectUrl));
}

function getStationId(stationName, apiRedirectUrl) {
    return getStationByName(stationName).then(station => station.id);
}

function getStationByName(stationName, apiRedirectUrl) {
    let requestUri = stationEndpoint(stationName);

    if (typeof apiRedirectUrl == "string") {
        requestUri = `${apiRedirectUrl}${requestUri}`;
    }

    return requestPromise(requestUri)
    .then(requestBody => handleJSON(requestBody))    
    .then(jsonBody => getStationFromJSON(jsonBody));
}

function requestPromise(requestUri) {
    return new Promise((resolve, reject) => {
        request.get({uri: requestUri, encoding: null, headers: mvgHeader}, (error, response, body) => {
            handleRequest(error, response, body, resolve, reject);
        });
    });
}

function handleRequest(error, response, body, resolve, reject) {
    if (successfulRequest(error, response)) {
        resolve(body)
    } else if (!error) {
        console.error(`Connection error, status code: ${response.statusCode}.`);
        reject(response.statusCode);
    } else {
        console.error(`Error: ${error}`);
        reject(error);
    }
}

function successfulRequest(error, response) {
    return !error && response.statusCode == 200;
}

function handleJSON(requestBody) {
    return new Promise((resolve, reject) => {
        try{
            resolve(JSON.parse(requestBody));
        } catch (syntaxException) {
            console.error(`Could not parse JSON because of invalid syntax: ${syntaxException}`);
            reject(syntaxException)
        }
    });
}

function getStationFromJSON(jsonBody) {
    return new Promise((resolve, reject) => {
        try {
            const station = jsonBody.locations[0];
            resolve(station);
        } catch (exception) {
            console.error(`JSON wasn't formatted as expected: ${exception}`);
            reject(exception);
        }     
    });
}

function getDeparturesById(stationId, options, apiRedirectUrl) {
    let requestUri = departureIdEndpoint(stationId);

    if (typeof apiRedirectUrl == "string") {
        requestUri = `${apiRedirectUrl}${requestUri}`;
    }

    return requestPromise(requestUri)
    .then(requestBody => handleJSON(requestBody))
    .then(jsonBody => getLinesFromJSON(jsonBody, options));
}

function getLinesFromJSON(jsonBody, options) {
    return new Promise((resolve, reject) => {
        const departures = jsonBody.departures;
        try {
            const lines = convertDeparturesToLine(departures)
            const filteredLines = filterLines(lines, options);
            resolve(filteredLines);
        } catch (exception) {
            console.error(`Could not get Lines from JSON: ${exception}`);
            reject(exception);
        }
    });
}

function convertDeparturesToLine(departures) {
    return departures.map(departure => {
        return new Line(departure.label, departure.destination, calculateTimeOffset(departure.departureTime), departure.product)
    });
}

function filterLines(lines, options) {
    if (typeof(options) != "undefined") {
        return lines.filter(line => {
            return options.includes(line.lineType);
        });
    } else {
        return lines;
    }
}

function calculateTimeOffset(time) {
    return Math.round((time - Date.now()) / 60000);
}

exports.getDepartures = getDepartures;
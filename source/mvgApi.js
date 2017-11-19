"use strict";
const cheerio = require("cheerio");
const request = require("request");
const Line = require("./Line");
const iconv = require("iconv-lite");
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

const stationNameEndpoint = (name) => `https://www.mvg.de/fahrinfo/api/location/queryWeb?q=${name}`;

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
                    "u",
                    "s"
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
                        "54",
                        "130",
                        "132",
                        "134",
                        "X30"
                    ],
                    "nachtbus": [
                        "40",
                        "41"
                    ],
                    "otherlines": []
                }
            }
        ]
    }
 */
const stationEndpoint = (identifier) => `https://www.mvg.de/fahrinfo/api/location/query?q=${identifier}`;


function getStationByName(stationName) {
    const requestUri = stationEndpoint(stationName);

    return requestPromise(requestUri)
    .then(requestBody => handleJSON(requestBody))    
    .then(jsonBody => getStationFromJSON(jsonBody));
}

function getStationFromJSON(jsonBody) {
    return new Promise((resolve, reject) => {
        try {
            const station = jsonBody.locations[0];
            resolve(station);
        } catch (exception) {
            console.log(`JSON wasn't formatted as expected: ${exception}`);
            reject(exception);
        }     
    });
}

function requestPromise(requestUri) {
    return new Promise((resolve, reject) => {
        request.get({uri: requestUri, encoding: null, headers: mvgHeader}, (error, response, body) => {
            handleRequest(error, response, body, resolve, reject);
        });
    });
}

function handleJSON(requestBody) {
    return new Promise((resolve, reject) => {
        try{
            resolve(JSON.parse(requestBody));
        } catch (syntaxException) {
            console.log(`Could not parse JSON because of invalid syntax: ${syntaxException}`);
            reject(syntaxException)
        }
    });
}

function getDeparturesById(stationId, options) {
    const requestUri = departureIdEndpoint(stationId);

    return requestPromise(requestUri)
    .then(requestBody => handleJSON(requestBody))
    .then(jsonBody => getDeparturesFromJSON(jsonBody));
}

function getDeparturesFromJSON(jsonBody) {
    return new Promise((resolve, reject) => {
        const departures = jsonBody.departures;
        departures.map(departure => {
            departure.departureIn = calculateTimeOffset(departure.departureTime);
        });
        if (typeof(options) != "undefined") {
            const filteredDepartures = departures.filter(departure => {                            
                return options.includes(departure.product);
            });
            resolve(filteredDepartures);
        } else {
            resolve(departures);
        } 
    });
}

function handleRequest(error, response, body, resolve, reject) {
    if (successfulRequest(error, response)) {
        resolve(body)
    } else if (!error) {
        console.log(`Connection error, status code: ${response.statusCode}.`);
        reject(response.statusCode);
    } else {
        console.log(`Error: ${error}`);
        reject(error);
    }
}

function successfulRequest(error, response) {
    return !error && response.statusCode == 200;
}

function getStationId(stationName) {
    return getStationByName(stationName).then(station => station.id);
}

function calculateTimeOffset(time) {
    return Math.round((time - Date.now()) / 60000);
}

function getDepartures(stationName, options) {
    const departuresPromise = getStationId(stationName)
    .then(stationId => {
            return getDeparturesById(stationId, options);
    })
    return departuresPromise;
}

exports.getDepartures = getDepartures;
exports.getDeparturesById = getDeparturesById;
exports.getStationId = getStationId;
exports.getStationByName = getStationByName;
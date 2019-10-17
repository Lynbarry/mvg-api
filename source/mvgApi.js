"use strict";
const request = require("request");
const Line = require("./Line");

const mvgHeader = {
    "X-MVG-Authorization-Key": "5af1beca494712ed38d313714d4caff6"
}

/**
 * Departure endpoint. Returns Json in the form of:
 * 
 * {
        "servingLines": [
            {
                "destination": "Aying",
                "sev": false,
                "partialNet": "mvv",
                "product": "SBAHN",
                "lineNumber": "S7",
                "divaId": "01007"
            },
            ...
        ],
        "departures": [
            {
                "departureTime": 1521389340000,
                "product": "BUS",
                "label": "53",
                "destination": "Münchner Freiheit",
                "live": true,
                "lineBackgroundColor": "#0d5c70",
                "departureId": -1966429330,
                "sev": false
            },
            ...
        ]
    }
 */
const departureIdEndpoint = (id) => `https://www.mvg.de/api/fahrinfo/departure/${id}?footway=0`;

/**
 * Station endpoint. Can be used with IDs or station names.
 * 
 * Returns Json in the form of:
 * 
{
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
                "BUS",
                "UBAHN",
                "SBAHN"
            ],
            "lines": {
                "tram": [],
                "nachttram": [],
                "sbahn": [
                    "S7"
                ],
                "ubahn": [
                    "U6"
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
                    "N40",
                    "N41"
                ],
                "otherlines": []
            }
        }
    ]
}
 */
const stationEndpoint = (identifier) => `https://www.mvg.de/api/fahrinfo/location/query?q=${encodeURI(identifier)}`;

/**
 * @param {String} stationName 'The name of the station, for example 'Hauptbahnhof'.
 * @param {Array<String>} [transportTypes] 'Optional: The types of transport, for example ['u', 's']. If not provided, all types will be used.'
 * @param {String} [apiRedirectUrl] 'An optional redirect URL.'
 */
function getDepartures(stationName, transportTypes, apiRedirectUrl) {
    return getStationId(stationName, apiRedirectUrl)
    .then(stationId =>  getDeparturesById(stationId, transportTypes, apiRedirectUrl));
}

function getStationId(stationName, apiRedirectUrl) {
    return getStationByName(stationName, apiRedirectUrl).then(station => station.id);
}

function getStationByName(stationName, apiRedirectUrl) {
    let requestUri = stationEndpoint(stationName);

    if (typeof apiRedirectUrl == "string") {
        requestUri = `${apiRedirectUrl}/${requestUri}`;
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

function getDeparturesById(stationId, transportTypes, apiRedirectUrl) {
    let requestUri = departureIdEndpoint(stationId);

    if (typeof apiRedirectUrl == "string") {
        requestUri = `${apiRedirectUrl}/${requestUri}`;
    }

    return requestPromise(requestUri)
    .then(requestBody => handleJSON(requestBody))
    .then(jsonBody => getLinesFromJSON(jsonBody, transportTypes));
}

function getLinesFromJSON(jsonBody, transportTypes) {
    return new Promise((resolve, reject) => {
        const departures = jsonBody.departures;
        try {
            const lines = convertDeparturesToLine(departures)
            const filteredLines = filterLines(lines, transportTypes);
            resolve(filteredLines);
        } catch (exception) {
            console.error(`Could not get Lines from JSON: ${exception}`);
            reject(exception);
        }
    });
}

function convertDeparturesToLine(departures) {
    return departures.map(departure => {
        return new Line(departure.label, departure.destination, calculateTimeOffset(departure.departureTime), convertMvgLineTypeToMyLineType(departure.product))
    });
}

function convertMvgLineTypeToMyLineType(lineType) {
    switch(lineType) {
        case 'UBAHN':
            return 'u';
        case 'SBAHN':
            return 's';
        case 'REGIONAL_BUS':
        case 'BUS':
            return 'b';
        case 'TRAM':
            return 't';
        default:
            return lineType;
    }
}

function filterLines(lines, transportTypes) {
    if (typeof(transportTypes) != "undefined") {

        return lines.filter(line => {
            return transportTypes.includes(line.lineType);
        });
    } else {
        return lines;
    }
}

function calculateTimeOffset(time) {
    return Math.round((time - Date.now()) / 60000);
}

exports.getDepartures = getDepartures;
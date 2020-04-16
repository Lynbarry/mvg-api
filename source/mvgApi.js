"use strict";
const needle = require("needle");
const Line = require("./Line");

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
const departureIdEndpoint = id =>
  `https://www.mvg.de/api/fahrinfo/departure/${id}?footway=0`;

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
const stationEndpoint = identifier =>
  `https://www.mvg.de/api/fahrinfo/location/query?q=${encodeURI(identifier)}`;

/**
 * @param {String} stationName 'The name of the station, for example 'Hauptbahnhof'.
 * @param {Array<String>} [transportTypes] 'Optional: The types of transport, for example ['u', 's']. If not provided, all types will be used.'
 * @param {String} [apiRedirectUrl] 'An optional redirect URL.'
 */
function getDepartures(stationName, transportTypes, apiRedirectUrl) {
  return getStationId(stationName, apiRedirectUrl).then(stationId => {
    return getDeparturesById(stationId, transportTypes, apiRedirectUrl);
  });
}

function getStationId(stationName, apiRedirectUrl) {
  let requestUri = stationEndpoint(stationName);

  if (typeof apiRedirectUrl == "string") {
    requestUri = `${apiRedirectUrl}/${requestUri}`;
  }

  return needle("get", requestUri, {
    response_timeout: 3000,
    open_timeout: 3000
  })
    .then(resp => {
      return resp.body.locations[0].id;
    })
    .catch(err => {
      console.log(err);
    });
}

function getDeparturesById(stationId, transportTypes, apiRedirectUrl) {
  let requestUri = departureIdEndpoint(stationId);
  if (typeof apiRedirectUrl == "string") {
    requestUri = `${apiRedirectUrl}/${requestUri}`;
  }

  return needle("get", requestUri, {
    response_timeout: 3000,
    open_timeout: 3000
  })
    .then(resp => {
      const departures = resp.body.departures;
      const lines = convertDeparturesToLine(departures);
      const filteredLines = filterLines(lines, transportTypes);
      return filteredLines;
    })
    .catch(err => {});
}

function convertDeparturesToLine(departures) {
  return departures.map(departure => {
    return new Line(
      departure.label,
      departure.destination,
      calculateTimeOffset(departure.departureTime),
      convertMvgLineTypeToMyLineType(departure.product)
    );
  });
}

function convertMvgLineTypeToMyLineType(lineType) {
  switch (lineType) {
    case "UBAHN":
      return "u";
    case "SBAHN":
      return "s";
    case "REGIONAL_BUS":
    case "BUS":
      return "b";
    case "TRAM":
      return "t";
    default:
      return lineType;
  }
}

function filterLines(lines, transportTypes) {
  if (typeof transportTypes != "undefined") {
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

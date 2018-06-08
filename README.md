mvg-api
=======

[![Build Status](https://img.shields.io/travis/Lynbarry/mvg-api/master.svg)](https://travis-ci.org/Lynbarry/mvg-api)


Node API for MVG departures.

## Installation

    npm install @lynbarry/mvg-api


## Usage

The "getDepartures" function takes up to three parameters:
* __station__: A String containing the name of the desired station.
* __transportTypes__: A list of strings containing the types of transport that are supposed to be shown. (u = ubahn, s = sbahn, b = bus, t = tram)
* __apiRedirectUrl (Optional)__: A String containing the URL of a redirect endpoint. If given, the requests will be sent to `apiRedirectUrl/mvgEndpoint`. You may need this to get around CORS problems when making requests in the frontend. Defaults to the mvg-URL.

### Example


    const mvgApi = require('@lynbarry/mvg-api');

    mvgApi.getDepartures('Harras', ['u', 's', 'b', 't']).then(lines => {
        console.log(lines);
    });


Output is a list of departures:

```
[ { [Number: 0]
    lineNumber: '6',
    lineDestination: 'Klinikum Großhadern',
    lineDepartureIn: 0,
    lineType: 'u' },
  { [Number: 4]
    lineNumber: '6',
    lineDestination: 'Garching-Forschungszentrum',
    lineDepartureIn: 4,
    lineType: 'u' },
  { [Number: 11]
    lineNumber: '6',
    lineDestination: 'Klinikum Großhadern',
    lineDepartureIn: 11,
    lineType: 'u' },
    ...
```

You can also use the `toString` method to get a list in human readable form:

```
2	U6:	Garching-Forschungszentrum,
8	U6:	Klinikum Großhadern,
9	U6:	Fröttmaning,
13	U6:	Garching-Forschungszentrum,
15	U6:	Klinikum Großhadern,
```

## Tests

    npm test

## Contributing

    In lieu of a formal style guide, take care to maintain the existing coding style.
    Add unit tests for any new or changed functionality. Lint and test your code. 
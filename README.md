mvg-api
=======

[![Build Status](https://travis-ci.org/Lynbarry/mvg-api.svg?branch=master)](https://travis-ci.org/Lynbarry/mvg-api)

Node API for MVG departures.

## Installation

    npm install @lynbarry/mvg-api


## Usage

The "getDepartures" function takes up to three parameters:
* __station__: A String containing the name of the desired station.
* __options__: A list of strings containing the types of transport that are supposed to be shown.
* __apiUrl (Optional)__: A String containing the URL of the desired API endpoint. Can be used to get around CORS problems. Defaults to the mvg-URL.

### Example


    const mvgApi = require('@lynbarry/mvg-api');

    mvgApi.getDepartures('Harras', ['ubahn', 'sbahn', 'bus', 'tram']).then(lines => {
        console.log(lines);
    });


Output is a list of departures in human readable form.

## Tests

    npm test

## Contributing

    In lieu of a formal style guide, take care to maintain the existing coding style.
    Add unit tests for any new or changed functionality. Lint and test your code.
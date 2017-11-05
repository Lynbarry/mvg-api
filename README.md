mvg-api
=======

[![Build Status](https://travis-ci.org/Lynbarry/mvg-api.svg?branch=master)](https://travis-ci.org/Lynbarry/mvg-api)

Node API for MVG departures.

## Installation

    npm install @lynbarry/mvg-api


## Usage

    const mvgApi = require('@lynbarry/mvg-api');

    mvgApi.getDepartures('Harras', ['ubahn', 'sbahn', 'bus', 'tram']).then(lines => {
        console.log(lines.toString());
    });

    Output is a list of departures in human readable form.

## Tests

    npm test

## Contributing

    In lieu of a formal style guide, take care to maintain the existing coding style.
    Add unit tests for any new or changed functionality. Lint and test your code.
var assert = require('assert');
var sinon = require('sinon');
var mvg_api = require('../lib/mvg_api');

describe('MVG API', () => {
    describe('getDepartures', () => {
        it('should return something.', () => {
            // GIVEN
            const lineNumber = 1;
            const lineDestination = 'Destination';
            const lineDepartureIn = 10;

            // WHEN

            // THEN
            return mvg_api.getDepartures("Harras").then(lines => {
                assert.equal([], lines);
            })
        });
    });
});
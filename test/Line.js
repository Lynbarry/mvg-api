var assert = require('assert');
var Line = require('../lib/Line')

describe('Line', () => {
    describe('constructor', () => {
        it('should create a Line object with the correct values.', () => {
            // GIVEN
            const lineNumber = 1;
            const lineDestination = 'Destination';
            const lineDepartureIn = 10;

            // WHEN
            const testLine = new Line(lineNumber, lineDestination, lineDepartureIn);

            // THEN
            assert.equal(1, testLine.lineNumber);
            assert.equal('Destination', testLine.lineDestination);
            assert.equal(10, testLine.lineDepartureIn);
        });
    });
});
var assert = require('assert');
var Line = require('../lib/Line')

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });      
    });
});

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
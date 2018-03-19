var assert = require('assert');
var Line = require('../source/Line')

describe('Line', () => {
    describe('constructor', () => {
        it('should create a Line object with the correct values for bus line.', () => {
            // GIVEN
            const lineNumber = '53';
            const lineDestination = 'Destination';
            const lineDepartureIn = 10;
            const lineType = 'b';

            // WHEN
            const testLine = new Line(lineNumber,
                lineDestination,
                lineDepartureIn,
                lineType);

            // THEN
            assert.strictEqual(53, testLine.lineNumber);
            assert.strictEqual('Destination', testLine.lineDestination);
            assert.strictEqual(10, testLine.lineDepartureIn);
            assert.strictEqual('b', testLine.lineType);
        });

        it('should create a Line object with the correct values for ubahn line.', () => {
            // GIVEN
            const lineNumber = 'U6';
            const lineDestination = 'Destination';
            const lineDepartureIn = 10;
            const lineType = 'u';

            // WHEN
            const testLine = new Line(lineNumber,
                lineDestination,
                lineDepartureIn,
                lineType);

            // THEN
            assert.strictEqual(6, testLine.lineNumber);
            assert.strictEqual('Destination', testLine.lineDestination);
            assert.strictEqual(10, testLine.lineDepartureIn);
            assert.strictEqual('u', testLine.lineType);

        });
    });
});

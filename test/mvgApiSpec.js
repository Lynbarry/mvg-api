var assert = require('chai').assert;
var sinon = require('sinon');
var mvg_api = require('../source/mvgApi');
var request = require('request');
var fs = require('fs');
var path = require('path');
var Line = require('../source/Line')


var filePath = path.join(__dirname, 'testContent.html');

const localFile = false;

describe('mvgApi', () => {
    describe('.getDepartures', () => {
        describe('(valid data)', () => {

            before(() => {
                const response = {
                    statusCode: 200
                }

                const fakeResponse = fs.readFileSync(filePath, {encoding: 'utf-8'}).toString();

                sinon
                    .stub(request, 'get')
                    .yields(false, response, fakeResponse);
            });

            after(function () {
                request.get.restore();
            });

            it('should return all 20 departures.', () => {
                // GIVEN
                const lineNumber = 1;
                const lineDestination = 'Destination';
                const lineDepartureIn = 10;

                // WHEN
                return mvg_api.getDepartures("Harras").then(lines => {

                    // THEN
                    assert.equal(20, lines.length);
                })
            });


            it('should contain a correct line.', () => {
                // GIVEN
                const testLine = new Line('S7', 'Wolfratshausen', 3)

                // WHEN
                return mvg_api.getDepartures("Harras").then(lines => {

                    // THEN
                    assert.deepEqual(lines[1], testLine);
                })
            });
        });

        /*
        describe('(invalid data)', () => {
            it('should reject for status other than 200.', () => {
                // GIVEN
                const response = {
                    statusCode: 404
                }

                const fakeResponse = fs.readFileSync(filePath, {encoding: 'utf-8'}).toString();

                sinon
                    .stub(request, 'get')
                    .yields(false, response, fakeResponse);

                // WHEN
                return mvg_api.getDepartures("Harras").then(lines => {

                   // THEN
                });
            });
        });
        */
    });
    describe('defaultApi', () => {
        describe('reachable', () => {
            it('should answer', () => {
                //GIVEN
                const response = {statusCode: 200};
                // WHEN
                return mvg_api.getDepartures('Hauptbahnhof')
            })
        })
    })
});

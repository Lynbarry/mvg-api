var assert = require('chai').assert;
var sinon = require('sinon');
var mvg_api = require('../source/mvgApi');
var request = require('request');
var fs = require('fs');
var path = require('path');
var Line = require('../source/Line')


var locationFilePath = path.join(__dirname, 'testLocation.json');
var departureFilePath = path.join(__dirname, 'testDeparture.json');

const mvgHeader = {
    "X-MVG-Authorization-Key": "5af1beca494712ed38d313714d4caff6"
}

function setUp(response) {
    const fakeLocationResponse = fs.readFileSync(locationFilePath, {encoding: 'utf-8'}).toString();
    const fakeDepartureResponse = fs.readFileSync(departureFilePath, {encoding: 'utf-8'}).toString();

    const getRequest = sinon.stub(request, 'get');

    getRequest.withArgs({uri: "https://www.mvg.de/api/fahrinfo/location/query?q=Harras", encoding: null, headers: mvgHeader})
        .yields(false, response, fakeLocationResponse);

    getRequest.withArgs({uri: "https://www.mvg.de/api/fahrinfo/departure/1130?footway=0", encoding: null, headers: mvgHeader})
        .yields(false, response, fakeDepartureResponse);
}

describe('mvgApi', () => {
    describe('.getDepartures', () => {
        describe('(valid data)', () => {

            before(() => {
                const response = {
                    statusCode: 200
                }

                setUp(response);
            });

            after(function(){
                request.get.restore();
            });

            it('should return all 30 departures.', () => {
                // GIVEN
                const lineNumber = 1;
                const lineDestination = 'Destination';
                const lineDepartureIn = 10;

                // WHEN
                return mvg_api.getDepartures("Harras").then(lines => {

                    // THEN
                    assert.equal(30, lines.length);
                })
            });
            

            it('should contain a correct line.', () => {
                // GIVEN
                const departureIn = Math.round((1538025210000 - Date.now()) / 60000);
                const testDeparture = new Line('68', 'Silberhornstraße', departureIn, 'b')

                // WHEN
                return mvg_api.getDepartures("Harras").then(departures => {

                    // THEN
                    assert.deepEqual(departures[0], testDeparture);
                })
            });
        });


        describe('(failed request)', () => {

            before(() => {
                const response = {
                    statusCode: 404
                }
                setUp(response);
            });

            after(function(){
                request.get.restore();
            });

            it('should reject for status other than 200.', () => {
                // GIVEN

                // WHEN
                return mvg_api.getDepartures("Harras").catch(error => {

                    // THEN
                    assert.equal(error, 404);
                });
            });
        });
    });
});

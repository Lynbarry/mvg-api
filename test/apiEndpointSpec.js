const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('request');

const mvgHeader = {
    "X-MVG-Authorization-Key": "5af1beca494712ed38d313714d4caff6"
}

/*
* I make assumptions about the MVG api. If it changes, the library
* may break.
* 
* To find out if that happens, I include some tests that chech the 
* MVG api directly.
*/

describe('The MVG Endpoint for', () => {
    describe('stations', () => {
        it('should return a response with the expected JSON structure.', (done) => {
            // GIVEN
            const stationEndpoint = 'https://www.mvg.de/api/fahrinfo/location/query?q=Hauptbahnhof';

            // WHEN
            request.get(
                {
                    uri: stationEndpoint,
                    encoding: null,
                    headers: mvgHeader
                }, (error, response, body) =>
                {
                    // THEN
                    expect(JSON.parse.bind(body)).to.not.throw('Couldn\t parse JSON.');
                    const bodyJson = JSON.parse(body);

                    assert.isArray(bodyJson.locations, "Locations array is not present .");
                    assert.isAbove(bodyJson.locations.length, 0, "No location found in the returned JSON.")
                    const station = bodyJson.locations[0];

                    assert.containsAllKeys(station, ['id'], "JSON for station did not contain station id.")                    
                    
                    done();
                }
            )
        })
    })

    describe('departures', () => {
        it('should return a response with the expected JSON structure.', (done) => {
            // GIVEN
            const departureIdEndpoint = 'https://www.mvg.de/api/fahrinfo/departure/6?footway=0';

            // WHEN
            request.get(
                {
                    uri: departureIdEndpoint,
                    encoding: null,
                    headers: mvgHeader
                }, (error, response, body) =>
                {
                    // THEN
                    expect(JSON.parse.bind(body)).to.not.throw('Couldn\t parse JSON.');
                    const bodyJson = JSON.parse(body);

                    assert.isArray(bodyJson.departures, "Departures array is not present .");
                    assert.isAbove(bodyJson.departures.length, 0, "No departures found in the returned JSON.")
                    const departure = bodyJson.departures[0];

                    const expectedKeys = ['label', 'destination', 'departureTime', 'product'];
                    assert.containsAllKeys(departure, expectedKeys, "JSON for departure did not contain station id.");

                    const product = departure.product;
                    assert.oneOf(product, ['UBAHN', 'SBAHN', 'BUS', 'REGIONAL_BUS', 'TRAM'], 'The type of transportation was of unknown kind.')

                    const label = departure.label;

                    expect(label).to.satisfy((label) => {
                        switch(product){
                            case 'UBAHN': return label.startsWith('U');
                            case 'SBAHN': return label.startsWith('S');
                            default: return !isNaN(parseInt(label));
                        }
                    })

                    done();
                }
            )
        })
    })
})
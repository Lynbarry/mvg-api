const mvg = require('./index');
const Station = require('./source/Station')

mvg.getDepartures('Harras', ['ubahn']).then(lines => {
    console.log(lines.toString());
});

mvg.getSuggestions('Hau').then(stations => {
    console.log(stations.toString());
});

mvg.getDeparturesBySuggestion('Hau').then(departures => {
    console.log(departures.toString());
});

const newStation = new Station('Hauptbahnhof');

newStation.getDepartures();
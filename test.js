const mvg = require('./index');

mvg.getDepartures('Harras', ['ubahn']).then(lines => {
    console.log(lines.toString());
});

mvg.getSuggestions('Hau').then(stations => {
    console.log(stations.toString());
});

mvg.getDeparturesBySuggestion('Hau').then(departures => {
    console.log(departures.toString());
});
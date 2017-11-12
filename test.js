var lines = require('./index');

lines.getDepartures('Harras', ['ubahn']).then(lines => {
    console.log(lines.toString());
});

lines.getSuggestions('Hau').then(stations => {
    console.log(stations.toString());
});
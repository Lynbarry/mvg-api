var lines = require('./index');

lines.getDepartures('Hauptbahnhof', ['UBAHN', 'SBAHN', 'BUS', 'TRAM']).then(lines => {
    console.log(lines.toString());
});

lines.getDepartures('Hauptbahnhof', ['UBAHN', 'SBAHN', 'BUS', 'TRAM']).then(lines => {
    console.log(lines);
});

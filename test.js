var lines = require('./index');

lines.getDepartures('Harras', ['UBAHN', 'SBAHN', 'BUS', 'TRAM']).then(lines => {
    console.log(lines.toString());
});

lines.getDepartures('Harras', ['SBAHN']).then(lines => {
    console.log(lines);
});

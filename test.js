var lines = require('./index');

lines.getDepartures('Hauptbahnhof', ['u', 's', 'b', 't']).then(lines => {
    //console.log(lines.toString());
});

lines.getDepartures('Hauptbahnhof', ['u', 's', 'b', 't']).then(lines => {
    //console.log(lines);
});

lines.getDepartures('Harras', ['u', 's', 'b', 't']).then(lines => {
    console.log(lines);
});

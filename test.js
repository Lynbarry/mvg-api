var lines = require('./index');

lines.getDepartures('Harras', ['u']).then(lines => {
    console.log(lines.toString());
});

lines.getDepartures('Harras', ['u']).then(lines => {
    console.log(lines);
});

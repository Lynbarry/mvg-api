var lines = require('./index');

lines.getDepartures('Harras', ['ubahn']).then(lines => {
    console.log(lines.toString());
});

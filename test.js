var lines = require('./index');

lines.getDepartures('Harras').then(lines => {
    console.log(lines.toString());
});

var lines = require("./index");

lines.getDepartures("Hauptbahnhof", ["u", "s", "b", "t"]).then((lines) => {
  console.log("getDepartures for Hauptbahnhof as String");
  console.log(lines.toString());
});

lines.getDepartures("Hauptbahnhof", ["u", "s", "b", "t"]).then((lines) => {
  console.log("getDepartures for Hauptbahnhof as array");
  console.log(lines);
});

lines.getDepartures("Harras", ["u", "s", "b", "t"]).then((lines) => {
  console.log("getDepartures for Harras as array");
  console.log(lines);
});

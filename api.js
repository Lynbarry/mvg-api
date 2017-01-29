"use strict";
const request = require('request');
const htmlparser = require('htmlparser2');
const select = require('soupselect').select;
const util = require('util');

/*
const parser = new htmlparser.Parser({
    onopentag: (name, attribs) => {
        if(name === "td" && attribs.class === "headerStationColumn"){
            console.log("Station: " + 
        }
    }
});
*/

function logNested(object) {
    console.log("logging");
    console.log(util.inspect(object, {showHidden: false, depth: null}));
}

var Line = function(line) {
    this.lineNumber = parseInt(line.children[1].children[0].data.trim());
    this.lineDestination = line.children[3].children[0].data.trim();
    this.lineDepartureIn = line.children[5].children[0].data.trim();
};

function isStationUnambiguous(dom) {
    const headerStationColumn = select(dom, ".headerStationColumn");
    return headerStationColumn.length > 0;
}

const handler = new htmlparser.DomHandler((error, dom) => {
    if (isStationUnambiguous(dom)) {
    var station = select(dom, ".headerStationColumn")[0].children[0].data;
    var time = select(dom, ".serverTimeColumn")[0].children[0].data;
    var linesEven = select(dom, ".rowEven");
    var linesOdd = select(dom, ".rowOdd");
    var lines = mergeSorted(linesEven, linesOdd);
    console.log(lines.map((line) => new Line(line)));
    } else {
        console.log(select(dom, ".departureTable li a").map(listElement => listElement.children[0].data));
    }
});
const parser = new htmlparser.Parser(handler);

function mergeSorted(a, b) {
  var answer = new Array(a.length + b.length), i = 0, j = 0, k = 0;
  while (i < a.length && j < b.length) {
    if (a[i].lineDepartureIn < b[j].lineDepartureIn) {
        answer[k] = a[i];
        i++;
    }else {
        answer[k] = b[j];
        j++;
    }
    k++;
  }
  while (i < a.length) {
    answer[k] = a[i];
    i++;
    k++;
  }
  while (j < b.length) {
    answer[k] = b[j];
    j++;
    k++;
  }
  return answer;
}

request('http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=Joh', (error, response, body) => {
    if(!error && response.statusCode == 200) {
        console.log(body);
        parser.write(body);
        parser.done();
    } else {
        console.log("Error: " + error);
    }
});

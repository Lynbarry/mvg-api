"use strict";

const request = require('request');
const parse5 = require('parse5');
const util = require('util');
const http = require('http');

function logNested(object) {
    console.log("logging");
    console.log(util.inspect(object, {showHidden: false, depth: null}));
}

const parser = new parse5.SAXParser();

parser.on('startTag', (text, attrs) => {
    console.log(text);
    console.log(attrs);
});

function sendStationRequest(station) {
    const requestUrl = 'http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=' + station;
    http.get(requestUrl, res => {        
        res.pipe(parser);
    });
}

function logComplex(document) {
    logNested(document
        .childNodes[1] //html
        .childNodes[2] //body
        .childNodes[3] //table departureTable departureView
        .childNodes[1] //tbody
        .childNodes[0] //tr
        .childNodes[1] //td headerStationColumn
        .childNodes[0].value
    );
}

sendStationRequest('Harras');
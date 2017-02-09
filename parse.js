"use strict";

const request = require('request');
const parse5 = require('parse5');
const util = require('util');
const http = require('http');

function logNested(object) {
    console.log("logging");
    console.log(util.inspect(object, {showHidden: false, depth: null}));
}

function sendStationRequest(station) {
    const requestUrl = 'http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=' + station;
    request(requestUrl, (error, response, body) => {
        const document = parse5.parse(body);

        const station = getOriginStation(document);

     
        console.log(station);

        const destinations = getDestinations(document);   
    });
}

function getOriginStation(document) {
    return document
        .childNodes[1] //html
        .childNodes[2] //body
        .childNodes[3] //table departureTable departureView
        .childNodes[1] //tbody
        .childNodes[0] //tr
        .childNodes[1] //td headerStationColumn
        .childNodes[0].value
}

function getDestinations(document) {
    console.log("destinations");

    document
        .childNodes[1]
        .childNodes[2]
        .childNodes[3]
        .childNodes[1]
        .childNodes
        .map(childNode => {
            console.log("childNode:")
            if (childNode.childNodes != undefined) {
                
                console.log(childNode.childNodes[1].childNodes[1].childNodes[0].value)
            }
            
        });

    // Number
    console.log(document
        .childNodes[1] //html
        .childNodes[2] //body
        .childNodes[3] //table departureTable departureView
        .childNodes[1] //tbody
        .childNodes[2] //tr
        .childNodes[1] //td lineColumn
        .childNodes[0]
        .value
    )

    // Destination
    console.log(document
        .childNodes[1] //html
        .childNodes[2] //body
        .childNodes[3] //table departureTable departureView
        .childNodes[1] //tbody
        .childNodes[2] //tr
        .childNodes[3] //td lineColumn
        .childNodes[0]
        .value.trim()
    )
  
  // Time until
  console.log(document
        .childNodes[1] //html
        .childNodes[2] //body
        .childNodes[3] //table departureTable departureView
        .childNodes[1] //tbody
        .childNodes[2] //tr
        .childNodes[5] //td lineColumn
        .childNodes[0]
        .value
    )
    
        
        
        /*
        .childNodes.map( childNode => {
            return childNode
        })
        */
}

sendStationRequest('Harras');
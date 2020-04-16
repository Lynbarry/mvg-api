const needle = jest.fn();

const testLocation = {
  body: {
    locations: [
      {
        type: "station",
        latitude: 48.116876,
        longitude: 11.536213,
        id: 1130,
        place: "München",
        name: "Harraas",
        hasLiveData: false,
        hasZoomData: true,
        products: ["BUS", "UBAHN", "SBAHN"],
        lines: {
          tram: [],
          nachttram: [],
          sbahn: ["S7"],
          ubahn: ["U6"],
          bus: ["53", "54", "130", "132", "134", "X30"],
          nachtbus: ["N40", "N41"],
          otherlines: [],
        },
      },
    ],
  },
};

const testDeparture = (departureTime) => {
  return {
    departureTime,
    product: "BUS",
    label: "134",
    destination: "Fürstenried West U",
    live: false,
    delay: 1,
    cancelled: false,
    lineBackgroundColor: "#0d5c70",
    departureId: `3efe6e0519e0b2194d4162db2e4af4d9#${departureTime}#de:09162:1130`,
    sev: false,
    platform: "",
  };
};

const testDepartures = {
  body: {
    departures: [testDeparture(Date.now())],
  },
};

needle.setupSuccess = function () {
  needle
    .mockResolvedValueOnce(testLocation)
    .mockResolvedValueOnce(testDepartures);
};

needle.setupFailure = function () {
  needle.mockRejectedValueOnce("Test Error");
};

module.exports = needle;

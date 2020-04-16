const mvg_api = require("./mvgApi");

jest.mock("needle");

describe("mvgApi", () => {
  it("should return the expected departures for valid data", () => {
    require("needle").setupSuccess();
    return mvg_api.getDepartures("Harras").then((lines) => {
      expect(lines).toHaveLength(1);
    });
  });

  it("should contain a correct line", () => {
    require("needle").setupSuccess();
    return mvg_api.getDepartures("Harras").then((departures) => {
      expect(departures[0].lineDestination).toEqual("Fürstenried West U");
    });
  });

  it("should reject for a status other than 200", () => {
    require("needle").setupFailure();
    return mvg_api.getDepartures("Harras").catch((err) => {
      expect(err).toBeDefined();
    });
  });
});

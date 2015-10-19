"use strict";

var utils = RiseVision.Common.LoggerUtils,
  params = {
    "widget": "video",
    "event": "load",
    "displayId": "abc123",
    "eventDetails": "Widget loaded"
  };

describe("getInsertData", function() {
  var data = null;

  before(function() {
    data = utils.getInsertData(params);
  });

  it("should return an object containing insertId property", function() {
    expect(data.rows[0].insertId).to.exist;
    expect(data.rows[0].insertId).to.be.a("string");
  });

  it("should return an object containing widget property", function() {
    expect(data.rows[0].json.widget).to.exist;
    expect(data.rows[0].json.widget).to.be.a("string");
    expect(data.rows[0].json.widget).to.equal(params.widget);
  });

  it("should return an object containing event property", function() {
    expect(data.rows[0].json.event).to.exist;
    expect(data.rows[0].json.event).to.be.a("string");
    expect(data.rows[0].json.event).to.equal(params.event);
  });

  it("should return an object containing display_id property", function() {
    expect(data.rows[0].json.display_id).to.exist;
    expect(data.rows[0].json.display_id).to.be.a("string");
    expect(data.rows[0].json.display_id).to.equal(params.displayId);
  });

  it("should return an object containing ts property", function() {
    expect(data.rows[0].json.ts).to.exist;
    expect(data.rows[0].json.ts).to.be.a("string");
  });

  it("should return an object containing event_details property", function() {
    expect(data.rows[0].json.event_details).to.exist;
    expect(data.rows[0].json.event_details).to.be.a("string");
    expect(data.rows[0].json.event_details).to.equal(params.eventDetails);
  });

  it("should set event_details property to an empty string", function() {
    data = utils.getInsertData({ "event": params.event, "displayId": params.displayId });

    expect(data.rows[0].json.event_details).to.equal("");
  });
});

describe("getTable", function() {
  it("should return the correct table name", function() {
    var tableName = "test",
      date = new Date(),
      year = date.getUTCFullYear(),
      month = date.getUTCMonth() + 1,
      day = date.getUTCDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    expect(utils.getTable(tableName)).to.equal(tableName + year + month + day);
  });
});

describe("log", function() {
  var logger = RiseVision.Common.Logger,
    interval = 3580000,
    token = "my-token",
    data = { "access_token": token },
    json = JSON.stringify(data),
    xhr, clock, requests;

  before(function() {
    xhr = sinon.useFakeXMLHttpRequest();

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };

    clock = sinon.useFakeTimers();
  });

  beforeEach(function() {
    requests = [];

    clock.tick(interval);
    logger.log(params);

    // Respond to refresh token request.
    requests[0].respond(200, { "Content-Type": "text/json" }, json);
  });

  after(function() {
    xhr.restore();
    clock.restore();
  });

  it("should make a POST request", function() {
    expect(requests[1].method).to.equal("POST");
  });

  it("should make a request to the correct URL", function() {
    expect(requests[1].url).to.contain("https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Widget_Events/tables/events");
    expect(requests[1].url).to.contain("/insertAll");
  });

  it("should set the Content-Type header", function() {
    expect(requests[1].requestHeaders["Content-Type"]).to.equal("application/json;charset=utf-8");
  });

  it("should set the Authorization header", function() {
    expect(requests[1].requestHeaders.Authorization).to.equal("Bearer " + token);
  });

  it("should send string data in the body", function() {
    expect(requests[1].requestBody).to.contain('{"kind":"bigquery#tableDataInsertAllRequest","skipInvalidRows":false,"ignoreUnknownValues":false,"rows":[{"insertId":');
    expect(requests[1].requestBody).to.contain('"json":{"widget":"' + params.widget + '","event":"' + params.event + '","display_id":"' + params.displayId + '","event_details":"' + params.eventDetails + '","ts":');
  });

  it("should not make a request if widget is empty", function() {
    requests = [];

    clock.tick(interval);
    logger.log({
      "widget": "",
      "event": params.event,
      "displayId": params.displayId,
      "eventDetails": params.eventDetails
    });

    expect(requests.length).to.equal(0);
  });

  it("should not make a request if event is empty", function() {
    requests = [];

    clock.tick(interval);
    logger.log({
      "widget": params.widget,
      "event": "",
      "displayId": params.displayId,
      "eventDetails": params.eventDetails
    });

    expect(requests.length).to.equal(0);
  });
});

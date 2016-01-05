"use strict";

var utils = RiseVision.Common.LoggerUtils,
  params = {
    "event": "load",
    "display_id": "abc123",
    "company_id": "def456",
    "event_details": "Widget loaded"
  };

function getDateSuffix() {
  var date = new Date(),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth() + 1,
    day = date.getUTCDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return year + month + day;
}

describe("RiseVision.Common.LoggerUtils", function() {
  describe("getInsertData", function() {
    var data = null;

    before(function() {
      data = utils.getInsertData(params);
    });

    it("should return an object containing insertId property", function() {
      expect(data.rows[0].insertId).to.exist;
      expect(data.rows[0].insertId).to.be.a("string");
    });

    it("should return an object containing company_id property", function() {
      expect(data.rows[0].json.company_id).to.exist;
      expect(data.rows[0].json.company_id).to.be.a("string");
      expect(data.rows[0].json.company_id).to.equal(params.company_id);
    });

    it("should return an object containing event property", function() {
      expect(data.rows[0].json.event).to.exist;
      expect(data.rows[0].json.event).to.be.a("string");
      expect(data.rows[0].json.event).to.equal(params.event);
    });

    it("should return an object containing display_id property", function() {
      expect(data.rows[0].json.display_id).to.exist;
      expect(data.rows[0].json.display_id).to.be.a("string");
      expect(data.rows[0].json.display_id).to.equal(params.display_id);
    });

    it("should return an object containing ts property", function() {
      expect(data.rows[0].json.ts).to.exist;
      expect(data.rows[0].json.ts).to.be.a("string");
    });

    it("should return an object containing event_details property", function() {
      expect(data.rows[0].json.event_details).to.exist;
      expect(data.rows[0].json.event_details).to.be.a("string");
      expect(data.rows[0].json.event_details).to.equal(params.event_details);
    });

  });

  describe("getTable", function() {
    it("should return the correct table name", function() {
      var tableName = "test";

      expect(utils.getTable(tableName)).to.equal(tableName + getDateSuffix());
    });
  });

  describe("getIds", function() {
    var rpcSpy;

    beforeEach(function () {
      rpcSpy = sinon.spy(gadgets.rpc, "call");
    });

    afterEach(function () {
      gadgets.rpc.call.restore();
    });

    it("should make an RPC call and return Company ID and Display ID", function() {
      utils.getIds(function(companyId, displayId) {
        expect(companyId).to.equal('"companyId"');
        expect(displayId).to.equal('"displayId"');
        expect(rpcSpy).to.have.been.called.once;
      });
    });

    it("should not make another RPC call but should still return Company ID and Display ID", function() {
      utils.getIds(function(companyId, displayId) {
        expect(companyId).to.equal('"companyId"');
        expect(displayId).to.equal('"displayId"');
        expect(rpcSpy).to.not.have.been.called;
      });
    });

    it("should return undefined if no callback parameter is passed", function() {
      expect(utils.getIds()).to.equal(undefined);
    });

    it("should return undefined if callback parameter is not a function", function() {
      expect(utils.getIds("callback")).to.equal(undefined);
    });
  });

  describe("getFileFormat", function() {
    it("should return the file format from a file url", function() {
      var fileUrl = "http://www.test.com/file.webm";

      expect(utils.getFileFormat(fileUrl)).to.equal("webm");
    });

    it("should return the file format in lower case", function() {
      var fileUrl = "http://www.test.com/file.WEBM";

      expect(utils.getFileFormat(fileUrl)).to.equal("webm");
    });

    it("should correctly return file format when param appended to file url", function() {
      var fileUrl = "http://www.test.com/file.webm?a=123";

      expect(utils.getFileFormat(fileUrl)).to.equal("webm");
    });

    it("should correctly return file format when multiple params appended to file url", function() {
      var fileUrl = "http://www.test.com/file.webm?a=123&b=123";

      expect(utils.getFileFormat(fileUrl)).to.equal("webm");
    });

    it("should correctly return file format when hash fragments appended to file url", function() {
      var fileUrl = "http://www.test.com/file.webm#test#abc";

      expect(utils.getFileFormat(fileUrl)).to.equal("webm");
    });

    it("should correctly return file format when a Rise Cache url is provided", function() {
      var fileUrl = "http://localhost:9494/?url=https%3A%2F%2Fstorage.googleapis.com%2Frisemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443%2FWidgets%252FVideo%2520-%2520Issue%252038%252FWildlife.webmsd.webm";

      expect(utils.getFileFormat(fileUrl)).to.equal("webm");
    });

    it("should return null when no url provided", function() {
      expect(utils.getFileFormat()).to.be.null;
    });

    it("should return null when no url param not a string", function() {
      expect(utils.getFileFormat(123)).to.be.null;
    });
  });

  describe("logEvent", function() {
    var logSpy,
      tableName = "video_events";

    beforeEach(function () {
      logSpy = sinon.spy(RiseVision.Common.Logger, "log");
    });

    afterEach(function() {
      RiseVision.Common.Logger.log.restore();
    });

    it("should call spy with correct parameters", function() {
      var params = {
        "event": "error",
        "event_details": "storage error",
        "file_url": "http://www.test.com/file.webm",
        "file_format": "webm",
        "company_id": '"companyId"',
        "display_id":'"displayId"'
      };

      RiseVision.Common.LoggerUtils.logEvent(tableName, {
        "event": "error",
        "event_details": "storage error",
        "file_url": "http://www.test.com/file.webm"
      });

      expect(logSpy).to.have.been.calledWith(tableName, params);
    });

    it("should call spy with correct parameters when the event_details parameter is not set", function() {
      var params = {
        "event": "error",
        "file_url": "http://www.test.com/file.webm",
        "file_format": "webm",
        "company_id": '"companyId"',
        "display_id":'"displayId"'
      };

      RiseVision.Common.LoggerUtils.logEvent(tableName, {
        "event": "error",
        "file_url": "http://www.test.com/file.webm"
      });

      expect(logSpy).to.have.been.calledWith(tableName, params);
    });

    it("should call spy with correct parameters when the file_url parameter is not set", function() {
      var params = {
        "event": "error",
        "event_details": "storage error",
        "company_id": '"companyId"',
        "display_id":'"displayId"'
      };

      RiseVision.Common.LoggerUtils.logEvent(tableName, {
        "event": "error",
        "event_details": "storage error"
      });

      expect(logSpy).to.have.been.calledWith(tableName, params);
    });

    it("should not call spy if the event parameter is not set", function() {
      RiseVision.Common.LoggerUtils.logEvent(tableName, { "event_details": "storage error" });

      expect(logSpy).not.to.have.been.called;
    });
  });
});

describe("RiseVision.Common.Logger", function () {
  describe("log", function() {
    var logger = RiseVision.Common.Logger,
      tableName = "test",
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
      logger.log(tableName, params);

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
      expect(requests[1].url).to.contain("https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Widget_Events/tables/test");
      expect(requests[1].url).to.contain("/insertAll");
    });

    it("should set the Content-Type header", function() {
      expect(requests[1].requestHeaders["Content-Type"]).to.equal("application/json;charset=utf-8");
    });

    it("should set the Authorization header", function() {
      expect(requests[1].requestHeaders.Authorization).to.equal("Bearer " + token);
    });

    it("should send string data in the body", function() {
      expect(requests[1].requestBody).to.contain('{"kind":"bigquery#tableDataInsertAllRequest","skipInvalidRows":false,' +
        '"ignoreUnknownValues":false,"templateSuffix":"' + getDateSuffix() + '","rows":[{"insertId":');
      expect(requests[1].requestBody).to.contain('"json":{"event":"' + params.event + '","display_id":"' +
        params.display_id + '","company_id":"' + params.company_id + '","event_details":"' + params.event_details + '","ts":');
    });

    it("should not make a request if table name is empty", function() {
      requests = [];

      clock.tick(interval);
      logger.log("", {
        "company_id": params.company_id,
        "event": params.event,
        "display_id": params.display_id,
        "event_details": params.event_details
      });

      expect(requests.length).to.equal(0);
    });

    it("should not make a request if no params provided", function() {
      requests = [];

      clock.tick(interval);
      logger.log("video_events");

      expect(requests.length).to.equal(0);
    });

    it("should not make a request if event is empty", function() {
      requests = [];

      clock.tick(interval);
      logger.log("video_events", {
        "company_id": params.company_id,
        "event": "",
        "display_id": params.display_id,
        "event_details": params.event_details
      });

      expect(requests.length).to.equal(0);
    });

    it("should not log the same event multiple times if the time between calls is less than 1 second", function() {
      requests = [];

      logger.log(tableName, params);

      expect(requests.length).to.equal(0);
    });

    it("should log the same event multiple times if the time between calls is 1.5 seconds", function() {
      requests = [];

      clock.tick(1500);
      logger.log(tableName, params);

      expect(requests.length).to.equal(2);  // Refresh token request + insert request
    });

    it("should log different events if the time between calls is less than 1 second", function() {
      requests = [];

      logger.log("video_events", {
        "event": "play",
        "display_id": "abc123",
        "company_id": "def456",
        "event_details": "Widget loaded"
      });

      expect(requests.length).to.equal(2);  // Refresh token request + insert request
    });
  });
});

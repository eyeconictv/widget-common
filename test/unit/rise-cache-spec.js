/*jshint expr:true */
"use strict";

describe("getFile", function() {
  var riseCache = RiseVision.Common.RiseCache,
    xhr, clock, requests;

  before(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    clock = sinon.useFakeTimers();

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  beforeEach(function() {
    requests = [];
  });

  after(function() {
    xhr.restore();
    clock.restore();
  });

  it("should not make a request if url is empty", function() {
    riseCache.getFile();
    expect(requests.length).to.equal(0);
  });

  it("should not make a request if callback is not a function", function() {
    riseCache.getFile("http://www.test.com/test.jpg", "callback");
    expect(requests.length).to.equal(0);
  });

  it("should ping Rise Cache if first time calling getFile()", function () {
    var spy = sinon.spy(riseCache, "ping");

    riseCache.getFile("http://www.test.com/test.jpg", function(){});

    expect(spy.calledOnce).to.be.true;

    riseCache.ping.restore();
  });

  it("should not ping Rise Cache on subsequent calls to getFile()", function () {
    var spy = sinon.spy(riseCache, "ping");

    riseCache.getFile("http://www.test.com/test.jpg", function(){});
    requests[0].respond(200);

    riseCache.getFile("http://www.test.com/test.jpg", function(){});

    expect(spy.calledOnce).to.be.true;

    riseCache.ping.restore();
  });

  it("should make a HEAD request", function() {
    var spy = sinon.spy();

    // Ping request
    riseCache.ping(function(){});
    requests[0].respond(200);

    riseCache.getFile("http://www.test.com/test.jpg", spy);

    expect(requests[1].method).to.equal("HEAD");
  });

  it("should make a GET request if the HEAD request fails", function() {
    var spy = sinon.spy();

    // Ping request
    riseCache.ping(function(){});
    requests[0].respond(200);

    // Failed request
    riseCache.getFile("http://www.test.com/test.jpg", spy);
    requests[1].respond(404);

    riseCache.getFile("http://www.test.com/test.jpg", spy);

    expect(requests[2].method).to.equal("GET");
  });

  it("should execute callback providing the xhr request and an error if all requests fail", function () {
    var spy = sinon.spy();

    // Ping request
    riseCache.ping(function(){});
    requests[0].respond(200);

    riseCache.getFile("http://www.test.com/test.jpg", spy);
    requests[1].respond(400); // HEAD request
    requests[2].respond(400); // GET request

    expect(spy.args[0][0].xhr).to.deep.equal(requests[2]);
    expect(spy.args[0][1].message).to.equal("The request failed with status code: 400");
  });

  it("should execute callback providing the xhr request and an error when third party file " +
    "does not exist", function () {
    var spy = sinon.spy();

    // Ping request
    riseCache.ping(function(){});
    requests[0].respond(200);

    riseCache.getFile("http://www.test.com/test.jpg", spy);
    requests[1].respond(404);
    requests[2].respond(0);

    expect(spy.args[0][0].xhr).to.deep.equal(requests[2]);
    expect(spy.args[0][1].message).to.equal("The request failed with status code: 0");
  });
});

describe("getFile - cache not running", function () {
  var riseCache = RiseVision.Common.RiseCache,
    xhr, clock, requests;

  before(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    clock = sinon.useFakeTimers();

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  beforeEach(function() {
    requests = [];

    // force rise cache is not running
    riseCache.ping(function(){});
    requests[0].respond(400);
  });

  after(function() {
    xhr.restore();
    clock.restore();
  });

  it("should execute callback passing the xhr request and a correctly structured URL with no cachebuster", function() {
    var spy = sinon.spy();

    riseCache.getFile("http://www.test.com/test.jpg", spy, true);
    requests[1].respond(200);

    expect(spy.args[0][0].xhr).to.deep.equal(requests[1]);
    expect(spy.args[0][0].url).to.equal("http://www.test.com/test.jpg");
  });

  it("should execute callback passing the xhr request and a correctly structured URL with cachebuster", function() {
    var spy = sinon.spy();

    riseCache.getFile("http://www.test.com/test.jpg", spy);
    requests[1].respond(200);
    expect(spy.calledWith({xhr: requests[1], url: "http://www.test.com/test.jpg?cb=0"})).to.be.true;

    riseCache.getFile("http://www.test.com/test.jpg?test=123", spy);
    requests[2].respond(200);
    expect(spy.calledWith({xhr: requests[2], url: "http://www.test.com/test.jpg?test=123&cb=0"})).to.be.true;
  });
});

describe("getFile - cache is running", function () {
  var riseCache = RiseVision.Common.RiseCache,
    xhr, clock, requests;

  before(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    clock = sinon.useFakeTimers();

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  beforeEach(function() {
    requests = [];

    // force rise cache is running
    riseCache.ping(function(){});
    requests[0].respond(200);
  });

  after(function() {
    xhr.restore();
    clock.restore();
  });

  it("should execute callback passing the xhr request and a correctly structured URL with no cachebuster", function() {
    var spy = sinon.spy(),
      urlEncoded = encodeURIComponent("http://www.test.com/test.jpg");

    riseCache.getFile("http://www.test.com/test.jpg", spy, true);

    requests[1].respond(200);

    expect(spy.args[0][0].xhr).to.deep.equal(requests[1]);
    expect(spy.args[0][0].url).to.equal("http://localhost:9494/?url=" + urlEncoded);
  });

  it("should execute callback passing the xhr request and a correctly structured URL with cachebuster", function() {
    var spy = sinon.spy(),
      urlEncoded = encodeURIComponent("http://www.test.com/test.jpg");

    riseCache.getFile("http://www.test.com/test.jpg", spy);

    requests[1].respond(200);

    expect(spy.args[0][0].xhr).to.deep.equal(requests[1]);
    expect(spy.args[0][0].url).to.equal("http://localhost:9494/cb=0?url=" + urlEncoded);
  });
});

describe("ping", function() {
  var riseCache = RiseVision.Common.RiseCache;

  it("should return success, Rise Cache is running", function () {
    var xhr = sinon.useFakeXMLHttpRequest(),
      requests = [],
      callback;

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };

    callback = sinon.spy();

    // call the "ping" method
    riseCache.ping(callback);

    // check the request was added to the array
    expect(requests.length).to.equal(1);

    // force a successful server response
    requests[0].respond(200);

    expect(callback.calledWith(true, "")).to.be.true;
  });

  it("should return failure, Rise Cache is not running", function () {
    var xhr = sinon.useFakeXMLHttpRequest(),
      requests = [],
      callback;

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };

    callback = sinon.spy();

    // call the "ping" method
    riseCache.ping(callback);

    // check the request was added to the array
    expect(requests.length).to.equal(1);

    // force a bad server response
    requests[0].respond(404);

    expect(callback.calledWith(false, null)).to.be.true;
  });

});
/*jshint expr:true */
"use strict";

describe("Rise Cache ping and prefix retrieval", function() {
  it("should exist", function() {
    expect(RiseVision.Common.RiseCache).not.to.equal(null);
  });

  it("should return the Rise Cache prefix", function() {
    var riseCache = RiseVision.Common.RiseCache;

    expect(riseCache.getUrl()).to.not.equal(null);
    expect(riseCache.getUrl()).to.not.equal("");
  });

  it("should return success, Rise Cache is running", function () {
    var xhr = sinon.useFakeXMLHttpRequest(),
      riseCache = RiseVision.Common.RiseCache,
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

    assert(callback.calledWith(true, ""));
  });

  it("should return failure, Rise Cache is not running", function () {
    var xhr = sinon.useFakeXMLHttpRequest(),
      riseCache = RiseVision.Common.RiseCache,
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

    assert(callback.calledWith(false, null));
  });

});

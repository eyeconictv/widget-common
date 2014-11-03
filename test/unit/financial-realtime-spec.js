/*jshint expr:true */
"use strict";

describe("Financial Realtime API service", function() {
  var instruments = ["AA.N", "AXP.N", "BA.N", "BAC.N", "CAT.N", "CSCO.O"];
  var auth = new RiseVision.Common.Store.Auth();

  it("object should initialize", function() {
    var realtime = new RiseVision.Common.Financial.RealTime("displayId", instruments, auth);

    expect(realtime).to.not.equal(null);
  });

  it("should return data", function(done) {
    var realtime = new RiseVision.Common.Financial.RealTime("displayId", instruments, auth);

    var requestedFields = ["code", "name"];
    var hasLogos = false;
    var isChain = false;

    assert.doesNotThrow(function() {
      realtime.getData(requestedFields, hasLogos, isChain, function(data, urls) {
        expect(data).to.not.equal(null);
        expect(data).to.not.equal(undefined);

        expect(data.getColumnLabel(1)).to.equal("Symbol Code");
        expect(data.getValue(2, 2)).to.equal("BOEING CO");

        done();
      });
    });
  });

});

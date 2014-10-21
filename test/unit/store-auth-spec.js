/*jshint expr:true */
"use strict";

describe("Store Authorization service", function() {
  it("should exist", function() {
     expect(RiseVision.Common.Store.Auth).not.to.equal(null);
  });

  it("should not be authorized by default", function() {
    var auth = new RiseVision.Common.Store.Auth();

    expect(auth.isAuthorized()).be.false;
  });

  it("should not authorize companyId", function() {
    var auth = new RiseVision.Common.Store.Auth();

    assert.doesNotThrow(function() {
      auth.checkForCompany("companyId", "productCode", function(authorized) {
        expect(authorized).be.false;
      });
    });
  });

  it("should authorize displayId", function() {
    var auth = new RiseVision.Common.Store.Auth();

    assert.doesNotThrow(function() {
      auth.checkForDisplay("displayId", "productCode", function(authorized) {
        expect(authorized).be.true;
      });
    });
  });

});

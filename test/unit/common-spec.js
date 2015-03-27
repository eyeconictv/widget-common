/* jshint expr:true */
"use strict";

describe("getting query parameters", function() {
  it("returns null if no query parameter found", function() {
    var utils = RiseVision.Common.Utilities,
      value;

    value = utils.getQueryParameter("param");

    expect(value).to.equal("");
  });

  it("returns query parameter value", function() {
    var utils = RiseVision.Common.Utilities,
      value;

    history.pushState({}, "", "?param=abc123");
    value = utils.getQueryParameter("param");

    expect(value).to.equal("abc123");
  });
});

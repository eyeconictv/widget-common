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

  it("returns error message for rise cache 404", function() {
    var utils = RiseVision.Common.Utilities,
      value,
      status = 404;

    value = utils.getRiseCacheErrorMessage(status);

    expect(value).to.equal("The file does not exist or cannot be accessed.");
  });

  it("returns error message for rise cache 507", function() {
    var utils = RiseVision.Common.Utilities,
      value,
      status = 507;

    value = utils.getRiseCacheErrorMessage(status);

    expect(value).to.equal("There is not enough disk space to save the file on Rise Cache.");
  });

  it("returns error message for rise cache default error", function() {
    var utils = RiseVision.Common.Utilities,
      value,
      status = 500;

    value = utils.getRiseCacheErrorMessage(status);

    expect(value).to.equal("There was a problem retrieving the file from Rise Cache.");
  });
});

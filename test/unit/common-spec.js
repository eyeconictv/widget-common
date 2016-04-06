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

describe("getRiseCacheErrorMessage", function () {
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

describe("getFontCssStyle", function () {
  var utils, className, obj;

  before(function() {
    utils = RiseVision.Common.Utilities;
    className = "test";
    obj = {
      "fontStyle": {
        "font": {
          "family": "verdana,geneva,sans-serif",
          "type": "standard"
        },
        "size": "18px",
        "customSize": "",
        "align": "left",
        "bold": false,
        "italic": false,
        "underline": false,
        "forecolor": "black",
        "backcolor": "transparent"
      }
    };
  });

  it("should return the correctly formatted string", function() {
    var value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: black; font-size: 18px; font-weight: normal; font-style: normal; text-decoration: none; background-color: transparent;}");

  });

  it("should handle backwards compatible 'color' value", function () {
    var value;

    obj.fontStyle.color = "#ffcc00";

    value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: #ffcc00; font-size: 18px; font-weight: normal; font-style: normal; text-decoration: none; background-color: transparent;}");

    delete obj.fontStyle.color;
  });

  it("should handle backwards compatible size value missing 'px'", function () {
    var value;

    obj.fontStyle.size = "16";

    value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: black; font-size: 16px; font-weight: normal; font-style: normal; text-decoration: none; background-color: transparent;}");

    obj.fontStyle.size = "18px";
  });

  it("should apply correct weight value if 'bold' is selected", function () {
    var value;

    obj.fontStyle.bold = true;

    value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: black; font-size: 18px; font-weight: bold; font-style: normal; text-decoration: none; background-color: transparent;}");

    obj.fontStyle.bold = false;
  });

  it("should apply correct style value if 'italic' is selected", function () {
    var value;

    obj.fontStyle.italic = true;

    value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: black; font-size: 18px; font-weight: normal; font-style: italic; text-decoration: none; background-color: transparent;}");

    obj.fontStyle.italic = false;
  });

  it("should apply correct style value if 'underline' is selected", function () {
    var value;

    obj.fontStyle.underline = true;

    value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: black; font-size: 18px; font-weight: normal; font-style: normal; text-decoration: underline; background-color: transparent;}");

    obj.fontStyle.underline = false;
  });

  it("should handle backwards compatible 'highlightColor' value", function () {
    var value;

    obj.fontStyle.highlightColor = "#ffcc00";

    value = utils.getFontCssStyle(className, obj.fontStyle);

    expect(value).to.equal(".test {font-family: verdana,geneva,sans-serif; color: black; font-size: 18px; font-weight: normal; font-style: normal; text-decoration: none; background-color: #ffcc00;}");

    delete obj.fontStyle.highlightColor;
  });
});

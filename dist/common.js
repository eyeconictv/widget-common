var RiseVision = RiseVision || {};

RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Validation = (function() {
  "use strict";

  /*
  Defining the regular expressions being used
   */
  var urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
      numericRegex = /^(\-|\+)?([0-9]+|Infinity)$/,
      decimalRegex = /^\-?[0-9]*\.?[0-9]+$/;

  function greaterThan(element, param) {
    var value = element.value.trim();

    if (!decimalRegex.test(value)) {
      return false;
    }

    return (parseFloat(value) > parseFloat(param));
  }

  function lessThan(element, param) {
    var value = element.value.trim();

    if (!decimalRegex.test(value)) {
      return false;
    }

    return (parseFloat(value) < parseFloat(param));
  }

  function numeric(element){
    var value = element.value.trim();

    /*
     Regexp being used is stricter than parseInt. Using regular expression as
     mentioned on mozilla
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
     Global_Objects/parseInt
     */
    return numericRegex.test(value);
  }

  function required(element){
    var value = element.value.trim(),
        valid = false;

    if (element.type === "checkbox" || element.type === "radio") {
      if(element.checked === true) {
        valid = true;
      }
    } else {
      if (value !== null && value !== '') {
        valid = true;
      }
    }

    return valid;
  }

  function url(element){
    var value = element.value.trim();

    // Add http:// if no protocol parameter exists
    if (value.indexOf("://") === -1) {
      value = "http://" + value;
    }
    /*
     Discussion
     http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-
     with-links#21925491

     Using
     https://gist.github.com/dperini/729294
     Reasoning
     http://mathiasbynens.be/demo/url-regex

     */
    return urlRegExp.test(value);
  }

  return {
    isGreaterThan: greaterThan,
    isLessThan: lessThan,
    isValidRequired: required,
    isValidURL: url,
    isValidNumber: numeric
  };
})();

RiseVision.Common.Utilities = (function() {

  function getFontCssStyle(className, fontObj) {
    var family = "font-family:" + fontObj.font.family + "; ";
    var color = "color: " + fontObj.color + "; ";
    var size = "font-size: " + fontObj.size + "px; ";
    var weight = "font-weight: " + (fontObj.bold ? "bold" : "normal") + "; ";
    var italic = "font-style: " + (fontObj.italic ? "italic" : "normal") + "; ";
    var underline = "text-decoration: " + (fontObj.underline ? "underline" : "none") + "; ";
    var highlight = "background-color: " + fontObj.highlightColor + "; ";

    return "." + className + " {" + family + color + size + weight + italic + underline + highlight + "}";
  }

  function addCSSRules(rules) {
    var style = document.createElement("style");

    for (var i = 0, length = rules.length; i < length; i++) {
      style.appendChild(document.createTextNode(rules[i]));
    }

    document.head.appendChild(style);
  }

  /*
   * Loads Google or custom fonts, if applicable, and injects CSS styles
   * into the head of the document.
   *
   * @param    array    settings    Array of objects with the following form:
 *                                   [{
 *                                     "class": "date",
 *                                     "fontSetting": {
 *                                         bold: true,
 *                                         color: "black",
 *                                         font: {
 *                                           family: "Akronim",
 *                                           font: "Akronim",
 *                                           name: "Verdana",
 *                                           type: "google",
 *                                           url: "http://custom-font-url"
 *                                         },
 *                                         highlightColor: "transparent",
 *                                         italic: false,
 *                                         size: "20",
 *                                         underline: false
 *                                     }
 *                                   }]
   *
   *           object   contentDoc    Document object into which to inject styles
   *                                  and load fonts (optional).
   */
  function loadFonts(settings, contentDoc) {
    settings.forEach(function(item) {
      if (item.class && item.fontSetting) {
        addCSSRules([ getFontCssStyle(item.class, item.fontSetting) ]);
      }

      if (item.fontSetting.font.type) {
        if (item.fontSetting.font.type === "custom" && item.fontSetting.font.family
          && item.fontSetting.font.url) {
          loadCustomFont(item.fontSetting.font.family, item.fontSetting.font.url,
            contentDoc);
        }
        else if (item.fontSetting.font.type === "google" && item.fontSetting.font.family) {
          loadGoogleFont(item.fontSetting.font.family, contentDoc);
        }
      }
    });
  }

  function loadCustomFont(family, url, contentDoc) {
    var sheet = null;
    var rule = "font-family: " + family + "; " + "src: url('" + url + "');";

    contentDoc = contentDoc || document;

    sheet = contentDoc.styleSheets[0];

    if (sheet !== null) {
      sheet.addRule("@font-face", rule);
    }
  }

  function loadGoogleFont(family, contentDoc) {
    var stylesheet = document.createElement("link");

    contentDoc = contentDoc || document;

    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("type", "text/css");
    stylesheet.setAttribute("href", "https://fonts.googleapis.com/css?family=" +
      family);

    if (stylesheet !== null) {
      contentDoc.getElementsByTagName("head")[0].appendChild(stylesheet);
    }
  }

  return {
    getFontCssStyle:  getFontCssStyle,
    addCSSRules:      addCSSRules,
    loadFonts:        loadFonts,
    loadCustomFont:   loadCustomFont,
    loadGoogleFont:   loadGoogleFont
  };
})();
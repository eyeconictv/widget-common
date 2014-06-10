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
    if (value.indexOf("://") == -1) {
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
	function loadCustomFont(family, url, contentDocument) {
		var sheet = null;
		var rule = "font-family: " + family + "; " + "src: url('" + url + "');";

		if (contentDocument == null) {
			contentDocument = document;
		}

		sheet = contentDocument.styleSheets[0];

		if (sheet !== null) {
			sheet.addRule("@font-face", rule);
		}
	}

	function loadGoogleFont(family, contentDocument) {
		if (contentDocument == null) {
			contentDocument = document;
		}

		var stylesheet = document.createElement("link");

		stylesheet.setAttribute("rel", "stylesheet");
		stylesheet.setAttribute("type", "text/css");
		stylesheet.setAttribute("href", "https://fonts.googleapis.com/css?family=" +
			family);

		if (stylesheet !== null) {
			contentDocument.getElementsByTagName("head")[0].appendChild(stylesheet);
		}
	}

	return {
		loadCustomFont: loadCustomFont,
		loadGoogleFont: loadGoogleFont,
	};
})();
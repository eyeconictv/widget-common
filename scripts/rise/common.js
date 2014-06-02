var RiseVision = RiseVision || {};

RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.GooglePicker = (function(gadgets) {
  "use strict";

  function openPicker(id, viewType){
    gadgets.rpc.call("", "rscmd_openGooglePicker", null, id, viewType);
  }

  return {
    openPicker:openPicker
  }
})(gadgets);

RiseVision.Common.Validation = (function() {
	"use strict";

	/*
	Defining the regular expressions being used
	 */
	var urlRegExp = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i,
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
		/*
		 Discussion
		 http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-
		 with-links#21925491

		 Using
		 https://github.com/component/regexps/blob/master/index.js#L3

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
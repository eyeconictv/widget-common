/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
 ;(function ($, window, document, undefined) {
	"use strict";

	var _pluginName = "fontPicker";

	function Plugin(element, options) {
		var utils = RiseVision.Common.Utilities,
			$element = $(element),
			$selectBox = null,
			$family = null,
			$customFont = null,
			$fontURL = null,
			$customFontError = null,
			currentFont = "",
			customFontURL = "";

		options = $.extend({}, {"font": "Arial", "font-url": ""}, options);

		/*
		 *  Private Methods
		 */
		function _init() {
			var TEMPLATE_URL = "http://s3.amazonaws.com/rise-common/scripts/bootstrap-font-picker/html/template.html";

			// Get the HTML markup from the template.
			$.get(TEMPLATE_URL).then(function(src) {
				$element.append(src);

				$selectBox = $element.find(".bfh-selectbox");
				$family = $element.find(".font-family");
				$fontURL = $element.find(".font-url");
				$customFont = $element.find(".custom-font");
				$customFontError = $element.find(".custom-font-error");

				// Initialize font list.
				$selectBox.bfhfonts({
					"family" : options.font,
					"showCustom" : true,
					"showMore" : true
				});

				// Initialize Google font list.
				$element.find(".bfh-googlefontlist").bfhgooglefontlist();

				// Initialize custom font.
				$element.find(".font-url").val(options["font-url"]);
				customFontURL = $fontURL.val();

				_loadFont();
				_bind();
			}, function() {
				console.log("Failed to retrieve template.html");
			});
		}

		/*
		 *  Load the selected font if necessary.
		 */
		function _loadFont() {
			var found = false;

			currentFont = $family.val();

			if (currentFont !== null) {
				if (currentFont === "Use Custom Font") {
					var fontFamily = _getCustomFontName();

					utils.loadCustomFont(fontFamily, customFontURL, options.contentDocument);
				}
				else {
					// Check if the font exists in the dropdown.
					$selectBox.find(".bfh-selectbox-options a").each(function(index) {
						if ($(this).text() === currentFont) {
							found = true;
							return false;
						}
					});

					// It's a Google font.
					if (!found) {
						utils.loadGoogleFont(currentFont, options.contentDocument);
						_addGoogleFont(currentFont);
					}
				}
			}
		}

		/*
		 *  Add event handlers.
		 */
		function _bind() {
			var $googleFonts = $element.find(".google-fonts");

			// Item is selected from dropdown.
			$selectBox.on("change.bfhselectbox", function(e) {
				if (e.target.value === "More Fonts...") {
					$googleFonts.modal("show");
				}
				else if (e.target.value === "Use Custom Font") {
					currentFont = $family.val();
					$customFontError.hide();
					$customFont.modal("show");
					$fontURL.focus();
				}
				else {
					currentFont = $family.val();

					$selectBox.trigger("standardFontSelected", [currentFont,
						$element.find("a[data-option='" + currentFont + "']")
							.css("font-family")]);
				}
			});

			// Custom font URL is saved.
			$element.find(".save-custom-font").on("click", function() {
				var fontFamily = _getCustomFontName();

				customFontURL = $fontURL.val();

				if (RiseVision.Common.Validation.isValidURL($fontURL.get(0))) {
					utils.loadCustomFont(fontFamily, customFontURL, options.contentDocument);
					$customFont.modal("hide");
					$selectBox.trigger("customFontSelected", [fontFamily, customFontURL]);
				}
				else {
					$customFontError.show();
				}
			});

			// Google font is selected.
			$googleFonts.on("select", function(e, family) {
				utils.loadGoogleFont(family, options.contentDocument);
				_addGoogleFont(family);
				$googleFonts.modal("hide");

				currentFont = $family.val();

				$selectBox.trigger("googleFontSelected", family);
			});

			// Google font dialog is closed.
			$googleFonts.find(".close").on("click", function() {
				// No Google font was selected; revert to previous selection.
				$selectBox.find(".bfh-selectbox-option").data("option", currentFont)
					.html(currentFont);
				$family.val(currentFont);
			});
		}

		/*
		 *  Add the selected Google font to the drop-down.
		 */
		function _addGoogleFont(family) {
			var $options = $selectBox.find("[role=option]");

			// Remove previous Google font, if applicable, and add the new one.
			$options.find("li.google-font").remove();
			$options.prepend("<li class='google-font'><a tabindex='-1' href='#' " +
				"style='font-family: Google' data-option='" + family + "'>" + family +
				"</a></li>");

			// Set Google font as default and sort.
			$selectBox.find(".bfh-selectbox-option").data("option", family).html(family);
			$selectBox.find(".font-family").val(family);
			_sortFontList();
		}

		/*
		 *  Create a unique name for a custom font by extracting the name
		 *  from its URL.
		 */
		function _getCustomFontName() {
			return customFontURL.split("/").pop().split(".")[0];
		}

		/*
		 *  Sort the drop-down.
		 */
		function _sortFontList() {
			// Don't sort "Use Custom Font" or "More Fonts...".
			var length = $selectBox.find("[role=option]" + " li").length,
				customFont = $selectBox.find("[role=option]" + " li:nth-last-child(2)"),
				moreFonts = $selectBox.find("[role=option]" + " li:last"),
				sortedFonts = $selectBox.find("[role=option]" + " li")
					.slice(0, length - 2).sort(
						function(a, b) {
							var first = $(a).find("a").text(),
								second = $(b).find("a").text();

							return first == second ? 0 : first < second ? -1 : 1;
						});

			$selectBox.find("[role=option]").html(sortedFonts).append(customFont)
				.append(moreFonts);
		}

		/*
		 *  Public Methods
		 */
		function getFont() {
			return $family.val();
		}

		function getFontStyle() {
			return $element.find("a[data-option='" + $family.val() + "']")
				.css("font-family");
		}

		function getFontURL() {
			return $fontURL.val();
		}

		function setFont(fontFamily) {
			var font = fontFamily.split(",");
			var $elem = null;

			// Remove quotes so that a match can be found.
			if (font.length > 0) {
				font = font[0].replace(/'/g, "");
			}

			$elem = $element.find("a[data-option='" + font + "']");

			if ($elem.length === 1) {
				$family.val(font);
				$selectBox.find(".bfh-selectbox-option").text($elem.text());
			}
		}

		_init();

		return {
			getFont: getFont,
			getFontStyle: getFontStyle,
			getFontURL: getFontURL,
			setFont: setFont
		};
	}

	/*
	 *  A lightweight plugin wrapper around the constructor that prevents
	 *  multiple instantiations.
	 */
	$.fn.fontPicker = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + _pluginName)) {
				$.data(this, "plugin_" + _pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);
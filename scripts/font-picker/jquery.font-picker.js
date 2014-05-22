/*
 *  Project: Font Picker
 *  Description: Font picker plugin for use with Rise Vision Widgets
 *  Author: @donnapep
 *  License: MIT
 */

 ;(function ($, window, document, undefined) {
	"use strict";

	var pluginName = "fontPicker";
	var defaults = {
		"font" : "Arial",
		"font-url" : "",
	};

	function Plugin(element, options) {
		var _utils = RiseVision.Common.Utilities;
		var $element = $(element);
		var $selectBox, $family, $fontURL, $customFont;
		var currentFont;

		options = $.extend({}, defaults, options);

		/* Private methods */
		function _init() {
			var TEMPLATE_URL = "http://s3.amazonaws.com/rise-common-test/scripts/font-picker/html/template.html";

			// Get the HTML markup from the template.
			$.get(TEMPLATE_URL).then(function(src) {
				$element.append(src);

				$selectBox = $element.find(".bfh-selectbox");
				$family = $element.find(".font-family");
				$fontURL = $element.find(".font-url");
				$customFont = $element.find(".custom-font");

				// Initialize font list.
				$selectBox.bfhfonts({
					"family" : options.font,
					"showCustom" : true,
					"showMore" : true
				});

				// Initialize Google font list.
				$element.find(".bfh-googlefontlist").bfhgooglefontlist();

				_setFont();
				_bind();
			}, function() {
				console.log("Failed to retrieve template.html");
			});
		}

		/* Set the selected font. */
		function _setFont() {
			var found = false;

			currentFont = $family.val();

			if (currentFont !== null) {
				if (currentFont === "Use Custom Font") {
					_utils.loadCustomFont("picker", $fontURL.val(), options.contentDocument);

					$customFont.modal("show");
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
						_utils.loadGoogleFont(currentFont, options.contentDocument);
						_addGoogleFont(currentFont);
					}
				}
			}
		}

		/* Add event handlers. */
		function _bind() {
			var $googleFonts = $element.find(".google-fonts");

			// Item is selected from dropdown.
			$selectBox.on("change.bfhselectbox", function(e) {
				if (e.target.value === "More Fonts...") {
					$customFont.modal("hide");
					$googleFonts.modal("show");
				}
				else if (e.target.value == "Use Custom Font") {
					currentFont = $family.val();

					$customFont.modal("show");
					$fontURL.focus();
					$selectBox.trigger("customFontSelected");
				}
				else {
					currentFont = $family.val();

					$customFont.modal("hide");
					$selectBox.trigger("fontSelected", [currentFont,
						$element.find("a[data-option='" + currentFont + "']").css("font-family")]);
				}
			});

			// Custom font URL is changed.
			$fontURL.on("change", function() {
				//var family = $(this).attr("id");
				var family = "picker";

				if ($(this).val() !== "") {
					_utils.loadCustomFont(family, $(this).val(), options.contentDocument);
				}
			});

			// Google font is selected.
			$googleFonts.on("select", function(e, family) {
				_utils.loadGoogleFont(family, options.contentDocument);
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

				if (currentFont === "Use Custom Font") {
					//$customFont.show();
				}
			});
		}

		/* Add the selected Google font to the drop-down. */
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

		/* Sort the font drop-down. */
		function _sortFontList() {
			// Don't sort "Use Custom Font" or "More Fonts...".
			var length = $selectBox.find("[role=option]" + " li").length;
			var customFont = $selectBox.find("[role=option]" + " li:nth-last-child(2)");
			var moreFonts = $selectBox.find("[role=option]" + " li:last");
			var sortedFonts = $selectBox.find("[role=option]" + " li")
				.slice(0, length - 2).sort(function(a, b) {
				var first = $(a).find("a").text();
				var second = $(b).find("a").text();

				return first == second ? 0 : first < second ? -1 : 1;
			});

			$selectBox.find("[role=option]").html(sortedFonts).append(customFont)
				.append(moreFonts);
		}

		/* Public methods */
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

		_init();

		return {
			getFont: getFont,
			getFontStyle: getFontStyle,
			getFontURL: getFontURL
		};
	}

	// A lightweight plugin wrapper around the constructor that prevents
	// multiple instantiations.
	$.fn.fontPicker = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);
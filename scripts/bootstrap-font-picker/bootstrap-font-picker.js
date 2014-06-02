/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
 ;(function ($, window, document, undefined) {
  "use strict";

  var _pluginName = "fontPicker";
  var CUSTOM_FONT_TEXT = "Use Custom Font";

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
      var TEMPLATE_URL = "http://s3.amazonaws.com/rise-common-test/scripts/bootstrap-font-picker/html/template.html";

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
        if (currentFont === CUSTOM_FONT_TEXT) {
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
            addGoogleFont(currentFont, true);
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
        else if (e.target.value === CUSTOM_FONT_TEXT) {
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
        addGoogleFont(family, true);
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

    /*
     * Set the selected font in the dropdown.
     *
     * @param    string    family    Font family.
     */
    function setFont(family) {
      var font = family.split(",");
      var $elem = null;

      // Remove quotes so that a match can be found.
      if (font.length > 0) {
        font = font[0].replace(/'/g, "");
      }

      $elem = $selectBox.find("a[data-option='" + font + "']");

      // This is a standard or Google font.
      if ($elem.length === 1) {
        $selectBox.find(".bfh-selectbox-option").text($elem.text());
        $family.val(font);
      }
      // This must be a custom font.
      else {
        $selectBox.find(".bfh-selectbox-option").text(CUSTOM_FONT_TEXT);
        $family.val(CUSTOM_FONT_TEXT);
      }
    }

    /*
     * Load the selected Google font and add it to the drop-down.
     *
     * @param   string    family        Font family
     * @param   boolean   isSelected    Whether to set this font as the
     *                                  currently selected font.
     */
    function addGoogleFont(family, isSelected) {
      var $options = $selectBox.find("[role=option]");

      // Load it.
      utils.loadGoogleFont(family, options.contentDocument);

      // Remove previous Google font, if applicable, and add the new one.
      //$options.find("li.google-font").remove();
      $options.prepend("<li class='google-font'><a tabindex='-1' href='#' " +
        "style='font-family: Google' data-option='" + family + "'>" + family +
        "</a></li>");

      // Set Google font as default and sort.
      if (isSelected) {
        $selectBox.find(".bfh-selectbox-option").data("option", family).html(family);
        $selectBox.find(".font-family").val(family);
      }

      _sortFontList();
    }

    _init();

    return {
      getFont: getFont,
      getFontStyle: getFontStyle,
      getFontURL: getFontURL,
      setFont: setFont,
      addGoogleFont: addGoogleFont,
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
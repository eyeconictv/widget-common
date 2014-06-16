/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
 ;(function ($, window, document, undefined) {
  "use strict";

  var _pluginName = "fontSizePicker";

  function Plugin(element, options) {
    var $element = $(element);

    options = $.extend({}, { "font-size": "14" }, options);

    /*
     *  Private Methods
     */
    function _init() {
      // Add the markup.
      $element.append(
        "<div class='bfh-selectbox'>" +
          "<select class='form-control bfh-fontsizes'></select>" +
        "</div>");

      // Initialize the font size picker component.
      $element.find(".bfh-fontsizes").bfhfontsizes({
        "size": options["font-size"]
      }).selectpicker();

      $element.find(".bfh-selectbox").on("change.bfhselectbox", function(e) {
        $element.trigger("sizeChanged", getSize());
      });
    }

    /*
     *  Public Methods
     */
    function getSize() {
      return $element.find("select.bfh-fontsizes").val();
    }

    function setSize(size) {
      var $selectElem = $element.find("select.bfh-fontsizes");

      if (size) {
        size = parseInt(size, 10);

        // Find the drop-down item for this font size and select it.
        $selectElem.find("> .dropdown-menu li").each(function(index) {
          if ($(this).find("span").text() == size) {
            $(this).toggleClass("selected", true);
          }
          else {
            $(this).toggleClass("selected", false);
          }
        });

        // Update the UI with the current font size.
        $selectElem.find("> button").attr("title", size);
        $selectElem.find(".filter-option").html(size);
        $selectElem.val(size);
      }
    }

    _init();

    return {
      getFontSize: getSize,
      setFontSize: setSize
    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.fontSizePicker = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
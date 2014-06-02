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
    }

    /*
     *  Public Methods
     */
    function getSize() {
      return $element.find(".font-size").val();
  }

    function setSize(size) {
      $element.find(".bfh-fontsizes").selectpicker("val", parseInt(size, 10));
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
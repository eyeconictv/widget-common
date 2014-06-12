/* Standard Font */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-font-family-[a-z\-]+/g;

  wysihtml5.commands.standardFont = {
    exec: function(composer, command, font, fontFamily, attrs) {
      var className = "wysiwyg-font-family-" + font.replace(/ /g, "-")
        .toLowerCase();
      var style = document.createElement("style");

      // Add a CSS class for the selected font.
      style.type = "text/css";
      style.innerHTML = "." + className +" { font-family: " + fontFamily +
        "; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      return wysihtml5.commands.formatInline.exec(composer, command, "span",
        className, REG_EXP, attrs);
    },
  };
})(wysihtml5);

/* Google Font */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-font-family-[a-z\-]+/g;

  wysihtml5.commands.googleFont = {
    exec: function(composer, command, font, attrs) {
      var className = "wysiwyg-font-family-" + font.replace(/ /g, "-")
        .toLowerCase();
      var style = document.createElement("style");

      // Add CSS for the selected font plus a fallback.
      style.type = "text/css";
      style.innerHTML = "." + className +" { font-family: '" + font +
        "', serif; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      return wysihtml5.commands.formatInline.exec(composer, command, "span",
        className, REG_EXP, attrs);
    },
  };
})(wysihtml5);

/* Custom Font */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-font-family-[a-z\-]+/g;

  wysihtml5.commands.customFont = {
    exec: function(composer, command, font, attrs) {
      var className = "wysiwyg-font-family-" + font.replace(/ /g, "-")
        .toLowerCase();
      var style = document.createElement("style");

      // Add CSS for the selected font plus a fallback.
      style.type = "text/css";
      style.innerHTML = "." + className +" { font-family: '" + font +
        "', serif; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      return wysihtml5.commands.formatInline.exec(composer, command, "span",
        className, REG_EXP, attrs);
    },
  };
})(wysihtml5);

/* Text Color */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-text-color-[a-z0-9\-]+/g;

  wysihtml5.commands.textColor = {
    exec: function(composer, command, color, attrs) {
      var className = "wysiwyg-text-color-" + color.replace("#", "");
      var style = document.createElement("style");

      // Add a CSS class for the selected font.
      style.type = "text/css";
      style.innerHTML = "." + className +" { color: " + color + "; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      return wysihtml5.commands.formatInline.exec(composer, command, "span",
        className, REG_EXP, attrs);
    },
  };
})(wysihtml5);

/* Text Highlight Color */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-highlight-color-[a-z0-9\-]+/g;

  wysihtml5.commands.highlightColor = {
    exec: function(composer, command, color, attrs) {
      var className = "wysiwyg-highlight-color-" + color.replace("#", "");
      var style = document.createElement("style");

      // Add a CSS class for the selected font.
      style.type = "text/css";
      style.innerHTML = "." + className +" { background-color: " + color + "; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      return wysihtml5.commands.formatInline.exec(composer, command, "span",
        className, REG_EXP, attrs);
    },
  };
})(wysihtml5);

/* Background Color */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-background-color-[a-z0-9\-]+/g;

  wysihtml5.commands.backgroundColor = {
    exec: function(composer, command, color, attrs) {
      var className = "wysiwyg-background-color-" + color.replace("#", "");
      var style = document.createElement("style");
      var body = editor.composer.doc.body;
      var classes = body.classList;

      // Add a CSS class for the selected font. Unfortunately, !important is
      // needed to override the inline style.
      style.type = "text/css";
      style.innerHTML = "." + className + " { background-color: " + color +
        " !important; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      // Remove any old background class before adding the new class.
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].match(REG_EXP)) {
          body.classList.remove(classes[i]);
        }
      }

      for (i = 0; i < attrs.length; i++) {
        body.setAttribute(attrs[i].name, attrs[i].value);
      }

      body.classList.add(className);
    },
  };
})(wysihtml5);
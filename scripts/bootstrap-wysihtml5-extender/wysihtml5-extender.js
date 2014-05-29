/* Standard Font */
(function(wysihtml5) {
	var REG_EXP = /wysiwyg-font-family-[a-z\-]+/g;

	wysihtml5.commands.standardFont = {
			exec: function(composer, command, font, fontFamily, attrs) {
				var className = "wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase();
				var style = document.createElement("style");

				// Add a CSS class for the selected font.
				style.type = "text/css";
				style.innerHTML = "." + className +" { font-family: " + fontFamily + "; }";
				composer.iframe.contentDocument.getElementsByTagName("head")[0].appendChild(style);

				return wysihtml5.commands.formatInline.exec(composer, command, "span", className, REG_EXP, attrs);
			},
			state: function(composer, command, font, fontFamily, attrs) {
				var className = "wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase();

				return wysihtml5.commands.formatInline.state(composer, command, "span", className, REG_EXP, attrs);
			}
		};
})(wysihtml5);

/* Google Font */
(function(wysihtml5) {
	var REG_EXP = /wysiwyg-font-family-[a-z\-]+/g;

	wysihtml5.commands.googleFont = {
			exec: function(composer, command, font, attrs) {
				var className = "wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase();
				var style = document.createElement("style");

				// Add CSS for the selected font plus a fallback.
				style.type = "text/css";
				style.innerHTML = "." + className +" { font-family: '" + font + "', serif; }";
				composer.iframe.contentDocument.getElementsByTagName("head")[0].appendChild(style);

				return wysihtml5.commands.formatInline.exec(composer, command, "span", className, REG_EXP, attrs);
			},
			state: function(composer, command, font, attrs) {
				return wysihtml5.commands.formatInline.state(composer, command, "span", "wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase(), REG_EXP, attrs);
			}
		};
})(wysihtml5);

/* Custom Font */
(function(wysihtml5) {
	var REG_EXP = /wysiwyg-font-family-[a-z\-]+/g;

	wysihtml5.commands.customFont = {
			exec: function(composer, command, font, attrs) {
				var className = "wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase();
				var style = document.createElement("style");

				// Add CSS for the selected font plus a fallback.
				style.type = "text/css";
				style.innerHTML = "." + className +" { font-family: '" + font + "', serif; }";
				composer.iframe.contentDocument.getElementsByTagName("head")[0].appendChild(style);

				return wysihtml5.commands.formatInline.exec(composer, command, "span", className, REG_EXP, attrs);
			},
			state: function(composer, command, font, attrs) {
				return wysihtml5.commands.formatInline.state(composer, command, "span", "wysiwyg-font-family-" + font.replace(/ /g, "-").toLowerCase(), REG_EXP, attrs);
			}
		};
})(wysihtml5);
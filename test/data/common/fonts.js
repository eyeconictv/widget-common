var standardFont1 = {
  "class": "standardFont1",
  "fontStyle": {
    "font": {
      "family": "verdana,geneva,sans-serif",
      "type": "standard"
    },
    "size": "18px",
    "customSize": "",
    "align": "left",
    "bold": true,
    "italic": true,
    "underline": true,
    "forecolor": "#ffcc00",
    "backcolor": "#eeeeee"
  }
};

var standardFont2 = {
  "class": "standardFont2",
  "fontStyle": {
    "font": {
      "family": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      "type": "standard"
    },
    "size": "14px",
    "customSize": "",
    "align": "left",
    "bold": false,
    "italic": false,
    "underline": false,
    "forecolor": "black",
    "backcolor": "transparent"
  }
};

var googleFont = {
  "class": "googleFont",
  "fontStyle": {
    "font": {
      "family": "'Aclonica',sans-serif",
      "type": "google",
      "url": ""
    },
    "size": "18px",
    "customSize": "",
    "align": "left",
    "bold": false,
    "italic": false,
    "underline": false,
    "forecolor": "black",
    "backcolor": "transparent"
  }
};

var customFont = {
  "class": "customFont",
  "fontStyle": {
    "font": {
      "family": "BrushScriptStd",
      "type": "custom",
      "url": "https://mydomain.com/fonts/BrushScriptStd.otf"
    },
    "size": "18px",
    "customSize": "",
    "align": "left",
    "bold": false,
    "italic": false,
    "underline": false,
    "forecolor": "black",
    "backcolor": "transparent"
  }
};

var getSampleParagraphs = function (classes) {
  var fragment = document.createDocumentFragment(),
    p;

  for (var i = 0; i < classes.length; i += 1) {
    p = document.createElement("p");
    p.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    p.className = classes[i];

    fragment.appendChild(p);
  }

  return fragment;
};
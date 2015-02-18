(function(window) {

  "use strict";

  window.gadget = window.gadget || {};

  window.gadget.settings = {
    "params": {},
    "additionalParams": {
      "background": {
        "color": "rgba(145,145,145,0)",
        "useImage": true,
        "image": {
          "url": "", // value comes from rise-storage-mock
          "position": "bottom-right",
          "scale": true
        }
      },
      "backgroundStorage": {
        "folder": "",
        "fileName": "url.to.home.jpg"
      }
    }
  };

})(window);




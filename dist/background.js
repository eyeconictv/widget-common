var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Background = function (data, companyId) {
  "use strict";

  var _callback = null,
    _ready = false;

  /*
   * Private Methods
   */
  function _backgroundReady() {
    _ready = true;

    if (_callback && typeof _callback === "function") {
      _callback();
    }
  }

  function _configure() {
    var background = document.getElementById("background"),
      storage = document.getElementById("backgroundStorage");

    // set the document background
    document.body.style.background = data.background.color;

    if (background) {
      if (data.background.useImage) {
        background.className = data.background.image.position;
        background.className = data.background.image.scale ? background.className + " scale-to-fit"
          : background.className;

        if (Object.keys(data.backgroundStorage).length === 0) {
          background.style.backgroundImage = "url(" + data.background.image.url + ")";
          _backgroundReady();
        } else {
          if (storage) {
            // Rise Storage
            storage.addEventListener("rise-storage-response", function(e) {
              if (Array.isArray(e.detail)) {
                background.style.backgroundImage = "url(" + e.detail[0] + ")";
              } else {
                background.style.backgroundImage = "url(" + e.detail + ")";
              }
              _backgroundReady();
            });

            storage.setAttribute("folder", data.backgroundStorage.folder);
            storage.setAttribute("fileName", data.backgroundStorage.fileName);
            storage.setAttribute("companyId", companyId);
            storage.go();
          } else {
            console.log("Missing element with id value of 'backgroundStorage'");
          }
        }
      } else {
        _backgroundReady();
      }
    } else {
      console.log("Missing element with id value of 'background'");
    }
  }

  /*
   *  Public Methods
   */
  function init(cb) {
    if (!_ready) {
      if (cb) {
        _callback = cb;
      }

      _configure();

    } else if (cb && typeof cb === "function") {
      cb();
    }
  }

  return {
    "init": init
  };
};

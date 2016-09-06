var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.RiseCache = (function () {
  "use strict";

  var BASE_CACHE_URL = "//localhost:9494/";

  var _pingReceived = false,
    _isCacheRunning = false,
    _isV2Running = false;

  function ping(callback) {
    var r = new XMLHttpRequest(),
      /* jshint validthis: true */
      self = this;

    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_isV2Running) {
      r.open("GET", BASE_CACHE_URL + "ping?callback=_", true);
    }
    else {
      r.open("GET", BASE_CACHE_URL, true);
    }

    r.onreadystatechange = function () {
      try {
        if (r.readyState === 4 ) {
          // save this result for use in getFile()
          _pingReceived = true;

          if(r.status === 200) {
            _isCacheRunning = true;

            callback(true, r.responseText);
          } else if (r.status === 404) {
            // Rise Cache V2 is running
            _isV2Running = true;

            // call ping again so correct ping URL is used for Rise Cache V2
            return self.ping(callback);
          } else {
            console.debug("Rise Cache is not running");
            _isCacheRunning = false;

            callback(false, null);
          }
        }
      }
      catch (e) {
        console.debug("Caught exception: ", e.description);
      }

    };
    r.send();
  }

  function getFile(fileUrl, callback) {
    if (!fileUrl || !callback || typeof callback !== "function") {
      return;
    }

    function fileRequest() {
      var url = "";

      if (_isCacheRunning) {
        if (_isV2Running) {
          url = BASE_CACHE_URL + "files?url=" + encodeURIComponent(fileUrl);
        } else {
          url = BASE_CACHE_URL + "?url=" + encodeURIComponent(fileUrl);
        }
      } else {
        url = fileUrl;
      }

      makeRequest("HEAD", url);
    }

    function makeRequest(method, url) {
      var xhr = new XMLHttpRequest(),
        request = {
          xhr: xhr,
          url: url
        };

      if (_isCacheRunning) {
        xhr.open(method, url, true);

        xhr.addEventListener("loadend", function () {
          var status = xhr.status || 0;

          if (status >= 200 && status < 300) {
            callback(request);
          } else {
            // Server may not support HEAD request. Fallback to a GET request.
            if (method === "HEAD") {
              makeRequest("GET", url);
            } else {
              callback(request, new Error("The request failed with status code: " + status));
            }
          }
        });

        xhr.send();
      }
      else {
        // Rise Cache is not running (preview), skip HEAD request and execute callback immediately
        callback(request);
      }

    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(fileRequest);
    } else {
      return fileRequest();
    }

  }

  function isRiseCacheRunning(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(function () {
        callback(_isCacheRunning);
      });
    } else {
      callback(_isCacheRunning);
    }
  }

  function isV2Running(callback) {
    if (!callback || typeof callback !== "function") {
      return;
    }

    if (!_pingReceived) {
      /* jshint validthis: true */
      return this.ping(function () {
        callback(_isV2Running);
      });
    }
    else {
      callback(_isV2Running);
    }
  }

  return {
    getFile: getFile,
    isRiseCacheRunning: isRiseCacheRunning,
    isV2Running: isV2Running,
    ping: ping
  };

})();

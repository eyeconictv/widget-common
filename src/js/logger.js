/* global config */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.LoggerUtils = (function() {
  "use strict";

  var INSERT_SCHEMA =
  {
    "kind": "bigquery#tableDataInsertAllRequest",
    "skipInvalidRows": false,
    "ignoreUnknownValues": false,
    "rows": [{
      "insertId": "",
      "json": {
        "event": "",
        "display_id": "",
        "event_details": "",
        "ts": 0
      }
    }]
  };

  function getInsertData(eventName, displayId, eventDetails) {
    var data = JSON.parse(JSON.stringify(INSERT_SCHEMA));

    data.rows[0].insertId = Math.random().toString(36).substr(2).toUpperCase();
    data.rows[0].json.event = eventName;
    data.rows[0].json.display_id = displayId;
    data.rows[0].json.ts = new Date().toISOString();

    if (eventDetails) {
      data.rows[0].json.event_details = eventDetails;
    }

    return data;
  }

  function getTable(name) {
    var date = new Date(),
      year = date.getUTCFullYear(),
      month = date.getUTCMonth() + 1,
      day = date.getUTCDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return name + year + month + day;
  }

  return {
    "getInsertData": getInsertData,
    "getTable": getTable
  };
})();

RiseVision.Common.Logger = (function(utils) {
  "use strict";

  var REFRESH_URL = "https://www.googleapis.com/oauth2/v3/token?client_id=" + config.LOGGER_CLIENT_ID +
      "&client_secret=" + config.LOGGER_CLIENT_SECRET +
      "&refresh_token=" + config.LOGGER_REFRESH_TOKEN +
      "&grant_type=refresh_token";

  var serviceUrl = "https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Widget_Events/tables/TABLE_ID/insertAll",
    refreshDate = 0,
    token = "";

  /*
   *  Private Methods
   */
  function refreshToken(cb) {
    var xhr = new XMLHttpRequest();

    if (new Date() - refreshDate < 3580000) {
      return cb({});
    }

    xhr.open("POST", REFRESH_URL, true);
    xhr.onloadend = function() {
      var resp = JSON.parse(xhr.response);

      cb({ token: resp.access_token, refreshedAt: new Date() });
    };

    xhr.send();
  }

  /*
   *  Public Methods
   */
  function log(eventName, displayId, eventDetails, cb) {
    if (!eventName) {
      return;
    }

    function insertWithToken(refreshData) {
      var xhr = new XMLHttpRequest(),
        insertData, url;

      url = serviceUrl.replace("TABLE_ID", utils.getTable("events"));
      refreshDate = refreshData.refreshedAt || refreshDate;
      token = refreshData.token || token;
      insertData = utils.getInsertData(eventName, displayId, eventDetails);

      // Insert the data.
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);

      if (cb && typeof cb === "function") {
        xhr.onloadend = function() {
          cb(xhr.response);
        };
      }

      xhr.send(JSON.stringify(insertData));
    }

    return refreshToken(insertWithToken);
  }

  return {
    "log": log
  };
})(RiseVision.Common.LoggerUtils);
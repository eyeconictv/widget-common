/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.LoggerUtils = (function(gadgets) {
  "use strict";

   var id = new gadgets.Prefs().getString("id"),
    displayId = "",
    companyId = "",
    callback = null;

  var BASE_INSERT_SCHEMA =
  {
    "kind": "bigquery#tableDataInsertAllRequest",
    "skipInvalidRows": false,
    "ignoreUnknownValues": false,
    "rows": [{
      "insertId": ""
    }]
  };

  /*
   *  Private Methods
   */

  /* Set the Company and Display IDs. */
  function setIds(names, values) {
    if (Array.isArray(names) && names.length > 0) {
      if (Array.isArray(values) && values.length > 0) {
        if (names[0] === "companyId") {
          companyId = values[0];
        }

        if (names[1] === "displayId") {
          if (values[1]) {
            displayId = values[1];
          }
          else {
            displayId = "preview";
          }
        }

        callback(companyId, displayId);
      }
    }
  }

  /*
   *  Public Methods
   */
  function getIds(cb) {
    if (!cb || typeof cb !== "function") {
      return;
    }
    else {
      callback = cb;
    }

    if (companyId && displayId) {
      callback(companyId, displayId);
    }
    else {
      if (id && id !== "") {
        gadgets.rpc.register("rsparam_set_" + id, setIds);
        gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId"]);
      }
    }
  }

  function getFileName(url) {
    if (!url || typeof url !== "string") {
      return "";
    }

    return url.substr(url.lastIndexOf("/") + 1);
  }

  function getFileFormat(url) {
    if (!url || typeof url !== "string") {
      return "";
    }

    return url.substr(url.lastIndexOf(".") + 1).toLowerCase();
  }

  function getInsertData(params) {
    var data = JSON.parse(JSON.stringify(BASE_INSERT_SCHEMA));

    data.rows[0].insertId = Math.random().toString(36).substr(2).toUpperCase();
    data.rows[0].json = JSON.parse(JSON.stringify(params));
    data.rows[0].json.ts = new Date().toISOString();

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
    "getIds": getIds,
    "getInsertData": getInsertData,
    "getFileName": getFileName,
    "getFileFormat": getFileFormat,
    "getTable": getTable
  };
})(gadgets);

RiseVision.Common.Logger = (function(utils) {
  "use strict";

  var REFRESH_URL = "https://www.googleapis.com/oauth2/v3/token?client_id=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_ID +
      "&client_secret=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_SECRET +
      "&refresh_token=" + WIDGET_COMMON_CONFIG.LOGGER_REFRESH_TOKEN +
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
  function log(tableName, params) {
    if (!tableName || !params || !params.event) {
      return;
    }

    function insertWithToken(refreshData) {
      var xhr = new XMLHttpRequest(),
        insertData, url;

      url = serviceUrl.replace("TABLE_ID", utils.getTable(tableName));
      refreshDate = refreshData.refreshedAt || refreshDate;
      token = refreshData.token || token;
      insertData = utils.getInsertData(params);

      // Insert the data.
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);

      if (params.cb && typeof params.cb === "function") {
        xhr.onloadend = function() {
          params.cb(xhr.response);
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
var $ = $ || {};

$.ajax = function(prefs) {
  if (prefs && prefs.url) {
    if (prefs.url.indexOf("companyId") > -1) {
      if (prefs.success) {
        var data = {authorized:false};
        var textStatus = "OK";
        prefs.success(data, textStatus);
      }
    }
    else {
      var data = {authorized:true};
      var textStatus = "OK";
      prefs.success(data, textStatus);
    }
  }
};

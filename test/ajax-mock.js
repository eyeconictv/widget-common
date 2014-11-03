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
    else if (prefs.url.indexOf("displayId") > -1) {
      var data = {authorized:true};
      var textStatus = "OK";
      prefs.success(data, textStatus);
    }
    else if (prefs.url.indexOf("id=&" > -1)) {
      if (prefs.error) {
        prefs.error();
      }
    }
  }
};

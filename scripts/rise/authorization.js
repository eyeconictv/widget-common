var RiseVision = RiseVision || {};

// check if dependencies exist
if (typeof jQuery === 'undefined' || typeof gapi !== 'undefined') {

  throw new Error("authorization.js dependencies not loaded");
  
} else {
  // dependencies exist, create module
  RiseVision.Authorization = (function($, gapi) {
    "use strict";

    // Constants
    var CLIENT_ID = "726689182011.apps.googleusercontent.com";

    // Private vars
    var oauthToken = null;

    function checkAuth(immediate, scope){
      gapi.auth.authorize({
        client_id : CLIENT_ID,
        scope : scope,
        immediate : immediate
      }, onAuthResult);
    }

    function getAuthToken(){
      return oauthToken;
    }

    function onAuthResult(authResult){
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        $(window).trigger("gapi_auth_success");
      } else {
        $(window).trigger("gapi_auth_failure", [authResult.error]);
      }
    }

    return {
      checkAuth: checkAuth,
      getAuthToken: getAuthToken
    };
  })(jQuery, gapi);
}


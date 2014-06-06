var RiseVision = RiseVision || {};

// check if dependencies exist
if (typeof gapi === 'undefined') {
  throw new Error("authorization.js dependencies not loaded");
} else {
  // dependencies exist, create module
  RiseVision.Authorization = (function(gapi) {
    "use strict";

    // Constants
    var CLIENT_ID = "726689182011.apps.googleusercontent.com";

    // Private vars
    var oauthToken = null, loaded = false;

    function authorize(immediate, scope, callbackFn){
      gapi.auth.authorize({
        client_id : CLIENT_ID,
        scope : scope,
        immediate : immediate
      }, function(authResult){
        if (authResult && !authResult.error) {
          oauthToken = authResult.access_token;
        } else {
          if(window.console){
            console.info("Authorization Fail: " + authResult.error);
          }
        }
        callbackFn.call(null,oauthToken);
      });
    }

    function isApiLoaded(){
      return loaded;
    }

    function loadApi(callbackFn){
      // Use the API Loader script to load the Authentication script.
      gapi.load('auth', {'callback': function(){
        loaded = true;
        if(typeof callbackFn === 'function'){
          callbackFn.apply(null);
        }
      }});
    }

    function getAuthToken(){
      return oauthToken;
    }

    return {
      authorize: authorize,
      getAuthToken: getAuthToken,
      isApiLoaded: isApiLoaded,
      loadApi: loadApi
    };
  })(gapi);
}

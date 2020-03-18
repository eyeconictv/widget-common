/* global $ */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.RiseData = function (params, riseCache) {

  "use strict";

  var _initialized = false,
    _isCacheRunning = false,
    _currentKey = null,
    _callback = null,
    _key = null,
    _baseCacheUrl = "https://localhost:9495",
    _keys = [];

  /*
   *  Private Methods
   */

  function _dateReviver( key, value ) {
    var a;

    if ( typeof value === "string" ) {
      a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec( value );
      if ( a ) {
        return new Date( Date.UTC( +a[ 1 ], +a[ 2 ] - 1, +a[ 3 ], +a[ 4 ],
          +a[ 5 ], +a[ 6 ] ) );
      }
    }
    return value;
  }

  function _isSessionStorage() {
    return params.storageType === "session";
  }

  function _isLocalStorage() {
    return params.storageType === "local";
  }

  function _getCachedDataFromStorage( key, cb ) {
    var data = null;

    if ( _isLocalStorage() ) {
      try {
        data = JSON.parse( localStorage.getItem( key ), _dateReviver );
      } catch ( e ) {
        console.warn( e ); // eslint-disable-line no-console
      }
    } else if ( _isSessionStorage() ) {
      try {
        data = JSON.parse( sessionStorage.getItem( key ), _dateReviver );
      } catch ( e ) {
        console.warn( e ); // eslint-disable-line no-console
      }
    }

    cb( data );
  }

  function _getCacheUrl( key, method ) {
    var url = _baseCacheUrl + "/" + params.endpoint;

    if ( method === "DELETE" || method === "GET" ) {
      url += "/" + key;
    }

    return url;
  }

  function _handleRiseCacheResponse( data ) {
    if ( _callback && typeof _callback === "function" ) {

      if ( data !== null && typeof data === "object" ) {
        data = JSON.stringify( data );
      }

      data = JSON.parse( data, _dateReviver );

      _callback( data );
    }

    // reset callback value
    _callback = null;
  }

  function _handleRiseCacheError() {
    if ( _callback && typeof _callback === "function" ) {
      // fallback to get data from local storage
      _getCachedDataFromStorage( _key, _callback );
    }
  }

  function _getDataFromRiseCache( url ) {
    $.getJSON(url)
      .done(function( json ) {
        _handleRiseCacheResponse( json );
      })
      .fail(function() {
        _handleRiseCacheError();
      });
  }

  function _postDataToRiseCache( url, body ) {
    $.post(url, body)
      .done(function() {
        _handleRiseCacheResponse();
        _keys.push( _currentKey );
      });
  }

  function _get( key, cb ) {
    var url = _getCacheUrl( key, "GET" );

    _currentKey = key;
    _callback = cb;
    _key = key;

    _getDataFromRiseCache( url );
  }

  function _save( key, data ) {
    var url = _getCacheUrl( key, "POST" ),
      body = JSON.stringify( { key: key, value: data } );

    _currentKey = key;

    _postDataToRiseCache( url, body );
  }

  /*
   *  Public Methods
   */

  function deleteItem() {
    // TODO: this is not required by Spreadsheet Widget. Implement in future only if required.
  }

  function getItem( key, cb ) {
    if ( _initialized && key && cb && typeof cb === "function" ) {
      if ( !_isCacheRunning ) {

        _getCachedDataFromStorage( key, cb );

      } else {
        if ( params.endpoint ) {
          _get( key, cb );
        } else {
          _getCachedDataFromStorage( key, cb );
        }
      }
    }
  }

  function init(cb) {
    if (!cb || typeof cb !== "function") {
      return;
    }

    riseCache.isRiseCacheRunning(function(isRiseCacheRunning) {
      _isCacheRunning = isRiseCacheRunning;
      _initialized = true;

      cb();
    });
  }

  function saveItem( key, data ) {
    if ( _initialized && key && data ) {
      if ( _isCacheRunning ) {
        if ( params.endpoint ) {
          _save( key, data );
        }
      }

      if ( _isLocalStorage() ) {
        try {
          localStorage.setItem( key, JSON.stringify( data ) );
        } catch ( e ) {
          console.warn( e ); // eslint-disable-line no-console
        }
      } else if ( _isSessionStorage() ) {
        try {
          sessionStorage.setItem( key, JSON.stringify( data ) );
        } catch ( e ) {
          console.warn( e ); // eslint-disable-line no-console
        }
      }
    }
  }

  return {
    deleteItem: deleteItem,
    getItem: getItem,
    init: init,
    saveItem: saveItem
  };
};

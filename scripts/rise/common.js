var RiseVision = RiseVision || {};

RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Settings = (function($, i18n) {
  /*
  Defining validation messages
   */
  var messages = {
    required: ' is a required field.',
    numeric: ' must contain only numbers.',
    valid_url: ' must contain a valid URL.'
  };

  /*
  Defining the regular expressions being used
   */
  var urlRegExp = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i,
      numericRegex = /^(\-|\+)?([0-9]+|Infinity)$/;

  /*
   A check on an element to see if it's visible
   */
  function isElementVisible($element){
   return ($element.is(":visible"));
  }

  function isValidNumber($element, errors, fieldName){
    var val = $.trim($element.val());

    // Don't validate element if it's hidden.
    if (!isElementVisible($element)) {
      return true;
    }

    /*
     Regexp being used is stricter than parseInt. Using regular expression as
     mentioned on mozilla
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
     Global_Objects/parseInt
     */

    if (!numericRegex.test(val)) {
      errors.innerHTML += fieldName + " must be a number.<br />";
      return false;
    }

    return true;
  }

  function isValidRequired($element, errors, fieldName){
    //Don't validate element if it's hidden.
    if (!isElementVisible($element)) {
      return true;
    }

    var value = $.trim($element.val()),
        valid = false;

    if ($element.is('checkbox') || $element.is('radio')) {
      if($element.is(":checked") === true) {
        valid = true;
      }
    } else {
      if (value !== null && value !== '') {
        valid = true
      }
    }

    if (!valid) {
      errors.innerHTML += fieldName + messages.required + "<br />";
      return false;
    }

    return true;
  }

  function isValidURL($element, errors, fieldName){
    //Don't validate element if it's hidden.
    if (!isElementVisible($element)) {
      return true;
    }

    /*
     Discussion
     http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-
     with-links#21925491

     Using
     https://github.com/component/regexps/blob/master/index.js#L3

     */
    if (!urlRegExp.test($.trim($element.val()))){
      errors.innerHTML += fieldName + messages.valid_url + "<br />";
      return false;
    }

    return true;
  }

  return {
    validateRequired: isValidRequired,
    validateURL: isValidURL,
    validateNumber: isValidNumber
  }
})($, i18n);
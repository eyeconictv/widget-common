;(function(window) {

  window.gadget = window.gadget || {};

  window.gadget.data = {
    cols: [
      {"id":"instrument","label":"Instrument","type":"string","pattern":""},
      {"id":"code","label":"Symbol Code","type":"string","pattern":""},
      {"id":"name","label":"Name","type":"string","pattern":""},
      {"id":"startTime","label":"Collection Start Time","type":"datetime","pattern":""},
      {"id":"endTime","label":"Collection End Time","type":"datetime","pattern":""},
      {"id":"daysOfWeek","label":"Collection Days of Week","type":"string","pattern":""},
      {"id":"timeZoneOffset","label":"Collection Time Zone Offset","type":"string","pattern":""}
    ],
    rows: [
      ["AA", "AA.N", "ALCOA", new Date(2014,9,15,9,30,0), new Date(2014,9,15,16,30,0), "1,2,3,4,5", "-0400"],
      ["AXP", "AXP.N", "AMERICAN EXPRESS INC", new Date(2014,9,15,9,30,0), new Date(2014,9,15,16,30,0), "1,2,3,4,5", "-0400"],
      ["BA", "BA.N", "BOEING CO", new Date(2014,9,15,9,30,0), new Date(2014,9,15,16,30,0), "1,2,3,4,5", "-0400"],
      ["BAC", "BAC.N", "BANK OF AMERICA CORP", new Date(2014,9,15,9,30,0), new Date(2014,9,15,16,30,0), "1,2,3,4,5", "-0400"],
      ["CAT", "CAT.N", "CATERPILLAR INC", new Date(2014,9,15,9,30,0), new Date(2014,9,15,16,30,0), "1,2,3,4,5", "-0400"],
      ["CSCO", "CSCO.O", "CISCO SYSTEMS", new Date(2014,9,15,9,30,0), new Date(2014,9,15,16,30,0), "1,2,3,4,5", "-0400"]
    ]
  };

})(window);

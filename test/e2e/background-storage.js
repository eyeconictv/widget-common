casper.test.begin("Background [Storage] - e2e Testing", function (test) {
  var system = require('system');
  var e2ePort = system.env.E2E_PORT || 8099;

  casper.options.waitTimeout = 1000;

  casper.on("remote.message", function(message) {
    this.echo(message);
  });

  casper.start("http://localhost:"+e2ePort+"/test/e2e/background-storage.html",
    function () {
      test.assertTitle("Background e2e Test");
    }
  );

  casper.then(function () {
    casper.evaluate(function () {
      var evt = document.createEvent("CustomEvent");

      evt.initCustomEvent("polymer-ready", false, false);
      window.dispatchEvent(evt);
    });

    casper.waitFor(function waitForUI() {
        return this.evaluate(function configureBackground() {
          return document.getElementById("background").classList.contains("bottom-right");
        });
      },
      function then() {
        test.assertExists(".scale-to-fit", "Scale to fit");
        test.assertExists(".bottom-right", "Alignment");
        test.assertEquals(this.getElementAttribute("#backgroundStorage", "fileName"),
        "moon.jpg", "File Name");
        test.assertEquals(this.getElementAttribute("#background", "style"),
          "background-image: url(https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/Widgets%2Fmoon.jpg); ", "Image");
        test.assertEquals(this.getElementAttribute("body", "style"),
          "background-image: initial; background-attachment: initial; background-origin: initial; " +
          "background-clip: initial; background-color: rgba(145, 145, 145, 0); " +
          "background-position: initial initial; background-repeat: initial initial; ",
          "Background color");
      });
  });

  casper.run(function() {
    test.done();
  });
});

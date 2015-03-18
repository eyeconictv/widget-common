casper.test.begin("Background [URL] - e2e Testing", function (test) {
  var system = require('system');
  var e2ePort = system.env.E2E_PORT || 8099;

  casper.options.waitTimeout = 1000;

  casper.on("remote.message", function(message) {
    this.echo(message);
  });

  casper.start("http://localhost:"+e2ePort+"/test/e2e/background-url.html",
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
          return document.getElementById("background").classList.contains("middle-center");
        });
      },
      function then() {
        test.comment("Configuration");

        test.assertExists(".scale-to-fit", "Scale to fit");
        test.assertExists(".middle-center", "Alignment");
        test.assertEquals(this.getElementAttribute("#background", "style"),
          "background-image: url(http://s3.amazonaws.com/rise-common/images/logo-small.png); ", "Image");
        test.assertEquals(this.getElementAttribute("body", "style"),
          "background-image: initial; background-attachment: initial; background-origin: initial; " +
          "background-clip: initial; background-color: rgba(145, 145, 145, 0); " +
          "background-position: initial initial; background-repeat: initial initial; ",
          "Background color");

        /* TODO: Test that image is refreshed. */
        /*casper.evaluate(function () {
          window.clock = sinon.useFakeTimers();
        });

        casper.waitFor(function waitForTimer() {

          return this.evaluate(function tickClock() {
            // tick the clock past the background refresh setTimer() duration
            window.clock.tick(900100);

            return document.getElementById("background").getAttribute("style") !== "background-image: url(http://s3.amazonaws.com/rise-common/images/logo-small.png); ";
          });
        },
          function then() {
            this.evaluate(function() {
              window.clock.restore();
            });

            // More assertions here.
          });*/

      });
  });

  casper.run(function() {
    test.done();
  });
});

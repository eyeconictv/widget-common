casper.test.begin("Background [URL] - e2e Testing", function (test) {
  var system = require('system');
  var e2ePort = system.env.E2E_PORT || 8099;
  var clock;

  casper.options.waitTimeout = 1000;

  casper.setUp = function(test) {
    clock = sinon.useFakeTimers();
  };

  casper.tearDown = function(test) {
    clock.restore();
  };

  casper.options.clientScripts = ["node_modules/sinon/lib/sinon.js"];

  casper.on("remote.message", function(message) {
    this.echo(message);
  });

  casper.start("http://localhost:"+e2ePort+"/test/e2e/background-url.html",
    function () {
      test.assertTitle("Background e2e Test");
    }
  );

  casper.then(function () {
    casper.waitFor(function waitForUI() {
        return this.evaluate(function configureBackground() {
          return document.getElementById("background").getAttribute("style") !== "";
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

        /*casper.waitFor(function waitForTimer() {

          return this.evaluate(function tickClock() {
            // tick the clock past the background refresh setTimer() duration
            clock.tick(900100);

            return document.getElementById("background").getAttribute("style") !== "background-image: url(http://s3.amazonaws.com/rise-common/images/logo-small.png); ";
          });
        },
          function then() {
            // TODO: test never gets here

            // More assertions here.
          });*/

      });
  });

  casper.run(function() {
    test.done();
  });
});

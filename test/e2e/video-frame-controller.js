var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/test/e2e/video-frame-controller.html";

casper.test.begin("Video: Frame Controller - e2e Testing", {

  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Video - Frame Controller Test", "Test page has loaded");

      casper.evaluate(function() {
        // Fake the timer methods.
        window.clock = sinon.useFakeTimers();
      });
    });

    casper.then(function () {
      casper.evaluate(function () {
        window.frameController = new RiseVision.Common.Video.FrameController();
      });

      test.assertEval(function () {
        return document.querySelectorAll("iframe").length === 0;
      }, "Should be no iframes in the document");

      test.assertEval(function () {
        var frameContainer = window.frameController.getFrameContainer(0);

        return frameContainer !== null;
      }, "Should retrieve frame container element by index");

      test.assertEval(function () {
        var frameContainer = window.frameController.getFrameObject(0);

        return frameContainer === null;
      }, "Should return null as no iframe exists in container");

      casper.evaluate(function () {
        window.frameController.add(0);
      });

      test.assertExists("#if_0 iframe", "Should add an iframe within container");

      casper.evaluate(function () {
        window.frameController.createFramePlayer(0, {}, [], "", "/test/data/video-frame-source.html");
      });

    });

    casper.withFrame(0, function() {
      test.assertVisible('div#success',
        "Should load source into iframe");
    });

    casper.then(function () {
      casper.evaluate(function () {
        window.frameController.hide(0);
      });

      test.assertNotVisible("#if_0", "Should hide a container based on index");

      casper.evaluate(function () {
        window.frameController.show(0);
      });

      test.assertVisible("#if_0", "Should show a container based on index");

      casper.evaluate(function () {
        // call remove() with a callback
        window.frameController.remove(0, function () {
          var el = document.createElement("div");
          el.setAttribute("id", "callback");

          window.document.body.appendChild(el);
        });

        // advance the clock 200 to emulate the setTimeout in the remove() function
        window.clock.tick(200);
      });

      casper.waitFor(function () {
          return this.evaluate(function () {
            return document.querySelectorAll("iframe").length === 0;
          });
        },
        function then() {
          casper.evaluate(function() {
            window.clock.restore();
          });

          test.assertEval(function () {
            var frameContainer = window.frameController.getFrameObject(0);

            return frameContainer === null;
          }, "Should return null as no iframe exists in container after calling remove()");

          test.assertExists("#callback", "Should execute callback after calling remove() ");
        });

    });

    casper.run(function runTest() {
      test.done();
    });

  }
});
var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/test/e2e/message.html";

casper.test.begin("Message - e2e Testing", {

  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Message Test", "Test page has loaded");
    });

    casper.then(function () {
      casper.evaluate(function () {
        var mainContainer = document.getElementById("container");
        mainContainer.style.height = "778px";

        window.testMessage = new RiseVision.Common.Message(mainContainer, document.getElementById("messageContainer"));
      });

      test.comment("Initialization");

      test.assertEquals(this.getElementAttribute("#messageContainer", "style"),
        "height: 778px; ", "Message container height set");

      casper.evaluate(function () {
        window.testMessage.show("Test message");
      });

      test.comment("Show message");

      test.assertNotVisible('#container', "Main container hidden");

      test.assertVisible("#messageContainer", "Message container shown");

      test.assertExists("p.message", "Message paragraph added");

      test.assertEval(function () {
        var message = document.querySelector(".message");

        return message.innerHTML === "Test message";
      }, "Should display correct text");

      test.comment("Show different message");

      casper.evaluate(function () {
        window.testMessage.show("Testing different message");
      });

      test.assertEval(function () {
        var message = document.querySelector(".message");

        return message.innerHTML === "Testing different message";
      }, "Should display changed text");

      casper.evaluate(function () {
        window.testMessage.hide();
      });

      test.comment("Hide message");

      test.assertVisible('#container', "Main container visible");

      test.assertNotVisible("#messageContainer", "Message container hidden");

      test.assertNotExists("p.message", "Message container cleared contents");

    });

    casper.run(function runTest() {
      test.done();
    });

  }
});
"use strict";

describe("RiseVision.Common.WSClient", function() {

  beforeEach(function () {
    top.RiseVision = {};
    top.RiseVision.Viewer = {};
    top.RiseVision.Viewer.LocalMessaging = {
      write: function(message) {},
      receiveMessages: function(handler) {},
      canConnect: function() {return true;}
    };
  });

  describe("broadcastMessage", function() {
    it("should call RiseVision.LocalMessaging.write() on top window with message", function() {
      var writeSpy = sinon.spy(top.RiseVision.Viewer.LocalMessaging, "write");

      RiseVision.Common.WSClient.broadcastMessage({
        "topic": "WATCH",
        "filePath": "test-file.jpg"
      });

      expect(writeSpy).to.have.been.calledWith({
        "topic": "WATCH",
        "filePath": "test-file.jpg"
      });

      top.RiseVision.Viewer.LocalMessaging.write.restore();
    });

  });

  describe("getModuleClientList", function() {
    it("should call RiseVision.LocalMessaging.write() on top window with correct message topic", function() {
      var writeSpy = sinon.spy(top.RiseVision.Viewer.LocalMessaging, "write");

      RiseVision.Common.WSClient.getModuleClientList();

      expect(writeSpy).to.have.been.calledWith({
        "topic": "client-list-request"
      });

      top.RiseVision.Viewer.LocalMessaging.write.restore();
    });

  });

  describe("receiveMessages", function() {
    it("should call RiseVision.LocalMessaging.receiveMessages() with handler function", function() {
      var receiveSpy = sinon.spy(top.RiseVision.Viewer.LocalMessaging, "receiveMessages");
      var handlerSpy = sinon.spy();

      RiseVision.Common.WSClient.receiveMessages(handlerSpy);

      expect(receiveSpy).to.have.been.calledWith(handlerSpy);

      top.RiseVision.Viewer.LocalMessaging.receiveMessages.restore();
    });

  });

  describe("canConnect", function() {
    it("should return true", function() {
      expect(RiseVision.Common.WSClient.canConnect()).to.be.true;
    });
  });

});

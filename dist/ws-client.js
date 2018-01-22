var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.WSClient = (function() {

  function broadcastMessage(message) {
    try {
      if (top.RiseVision.LocalMessaging) {
        top.RiseVision.LocalMessaging.write(message);
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  function getModuleClientList() {
    try {
      if (top.RiseVision.LocalMessaging) {
        top.RiseVision.LocalMessaging.write({topic: "client-list-request"});
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  function receiveMessages(handler) {
    if (!handler || typeof handler !== "function") {return;}

    try {
      if (top.RiseVision.LocalMessaging) {
        top.RiseVision.LocalMessaging.receiveMessages(handler);
      }
    } catch (err) {
      console.log( "widget-common: ws-client", err );
    }
  }

  return {
    broadcastMessage: broadcastMessage,
    getModuleClientList: getModuleClientList,
    receiveMessages: receiveMessages
  };
})();
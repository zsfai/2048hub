/* Minimal GameAnalytics stub — no network calls. */
(function (scope) {
  function noop() {}
  var listeners = [];
  var ready = false;

  var GA = {
    configureAvailableCustomDimensions01: noop,
    configureAvailableCustomDimensions02: noop,
    configureAvailableCustomDimensions03: noop,
    configureAvailableResourceCurrencies: noop,
    configureAvailableResourceItemTypes: noop,
    configureBuild: noop,
    configureGameEngineVersion: noop,
    configureSdkGameEngineVersion: noop,
    configureUserId: noop,
    initialize: function () {
      ready = true;
      setTimeout(function () {
        for (var i = 0; i < listeners.length; i++) {
          var l = listeners[i];
          if (l && typeof l.onRemoteConfigsUpdated === "function") {
            l.onRemoteConfigsUpdated();
          }
        }
      }, 0);
    },
    addBusinessEvent: noop,
    addResourceEvent: noop,
    addProgressionEvent: noop,
    addDesignEvent: noop,
    addErrorEvent: noop,
    addAdEvent: noop,
    setEnabledEventSubmission: noop,
    setEnabledInfoLog: noop,
    setEnabledVerboseLog: noop,
    setEnabledManualSessionHandling: noop,
    setCustomDimension01: noop,
    setCustomDimension02: noop,
    setCustomDimension03: noop,
    startSession: noop,
    endSession: noop,
    addRemoteConfigsListener: function (listener) {
      if (listener) listeners.push(listener);
    },
    isRemoteConfigsReady: function () { return ready; },
    getRemoteConfigsContentAsString: function () { return "{}"; },
    getRemoteConfigsValueAsString: function (_key, defaultValue) {
      return defaultValue == null ? "" : defaultValue;
    },
    gaCommand: noop
  };

  scope.gameanalytics = { GameAnalytics: GA };
  scope.GameAnalytics = GA.gaCommand;
})(typeof window !== "undefined" ? window : this);

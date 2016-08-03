var APP, js_debug, log, warn;

js_debug = js_debug || void 0;

log = function(s) {
  if (typeof js_debug !== 'undefined' && js_debug) {
    console.log(s);
  }
};

warn = function(s) {
  if (typeof js_debug !== 'undefined' && js_debug) {
    console.warn(s);
  }
};

APP = (function($) {
  var init, s;
  s = {};
  init = function() {
    log('APP.init()');
  };
  return {
    init: init
  };
})(jQuery);

jQuery(document).ready(function() {
  APP.init();
});

/**
 * Gulp File
 *
 * @author: Rutger Laurman - lekkerduidelijk.nl
 * @url: https://github.com/lekkerduidelijk/sass-template
 *
 */

// Include libraries with Gulp Include

// jQuery
//=include ../../../node_modules/jquery/dist/jquery.js

//=include module/**/*.js


// Avoid `console` errors in browsers that lack a console.
!function(){for(var a,b=function(){},c=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeline","timelineEnd","timeStamp","trace","warn"],d=c.length,e=window.console=window.console||{};d--;)a=c[d],e[a]||(e[a]=b)}(); // jshint ignore:line

var js_debug = js_debug || undefined;
// Global debug logger
var log = function(s){
  if (typeof(js_debug) !== 'undefined' && js_debug) {
    console.log(s);
  }
},warn = function(s){
  if (typeof(js_debug) !== 'undefined' && js_debug) {
    console.warn(s);
  }
};


// APP namespace
var APP = (function($){

  // Object scope settings
  var s = {};

  // Init method
  function init() {
    warn("APP.init()");

    log("Here we go!");
  }

  // Expose to public
  return { init: init };

})(jQuery);

// Document ready
jQuery(document).ready(function(){
  APP.init();
});

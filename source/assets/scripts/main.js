/**
 * Gulp File
 *
 * @author: Rutger Laurman - lekkerduidelijk.nl
 * @url: https://github.com/lekkerduidelijk/sass-template
 *
 */

import $ from 'jquery';
// window.jQuery = $;

// import 'jquery';
// import 'bootstrap/dist/js/bootstrap';
// import 'tether/dist/js/tether';
// import Utils from 'bootstrap/js/src/util';
// import Collapse from 'bootstrap/js/src/collapse';
import 'bootstrap';
// import 'bootstrap/js/src/dropdown';

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';


/**
 * Populate Router instance with DOM routes
 * @type {Router} routes - An instance of our router
 */
const routes = new Router({
  /** All pages */
  common,
  /** Home page */
  home,
});

/** Load Events */
$(document).ready(() => routes.loadEvents());

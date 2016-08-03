
js_debug = js_debug or undefined

log = (s) ->
  if typeof js_debug != 'undefined' and js_debug
    console.log s
  return

warn = (s) ->
  if typeof js_debug != 'undefined' and js_debug
    console.warn s
  return

# APP namespace
APP = (($) ->

  # Object scope settings
  s = {}

  # Init method
  init = ->
    log 'APP.init()'
    return

  # Expose to public
  { init: init }

)(jQuery)

jQuery(document).ready ->
  APP.init()
  return

# Gridwax version 2.1

class GridWax
  constructor: ->
    unless $ = window.jQuery
      head = document.getElementsByTagName("head")[0]
      jquery = document.createElement("script")
      jquery.src = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"
      jquery.type = "text/javascript"
      head.appendChild jquery

      jquery.onload = @init
    else
      # jQuery already loaded
      @init()


  init: =>
    document.onkeydown = @keyDown
    document.onkeyup = @keyUp
    @pageWidth = $(document).width()
    @pageHeight = $(document).height()
    @gridlineColor = "#000"
    $("body").append "<div id='gridwax'></div>"
    @gridwax = $("#gridwax")
    @gridwax.css
      position         : "absolute"
      top              : 0
      left             : 0
      width            : "100%"
      height           : @pageHeight
      background       : "RGBA(25,0,0,.1)"
      "z-index"        : "9990"
      "pointer-events" : "none"

    @gridline = "<div class='gw-gridline'></div>"
    $("body").css "padding-bottom", "35px"
    $("body").append "<div id='gw-overlay'>
                        <img src='http://dl.dropbox.com/u/37716909/moustache.png'/>
                        <div id='gw-console' class='gw-razor'>
                          <label>Line-height: <input type='text' class='gw-lh' value='18' /></label>
                          <label>Offset: <input type='text' class='gw-o' value='0' /></label>
                          <label>Color:
                            <a class='color'>#efefef</a>
                            <a class='color'>#000</a>
                            <a class='color'>#bd424b</a>
                            <a class='color'>#cb6020</a>
                            <a class='color'>#ffe960</a>
                            <a class='color'>#3f9679</a>
                            <a class='color'>#4c8dcf</a>
                            <a class='color'>#a672ae</a>
                            <a class='color'>#7576c9</a>
                          </label>
                        </div>
                        <div id='gw-close' class='gw-razor'><a href='#' onclick='window.gridwax.shave();'>Remove the Grid ✖</a></div>
                      </div>"

    @overlay = $("#gw-overlay")
    @overlay.css
      position      : "fixed"
      display       : "block"
      bottom        : 0
      "border-top"  : "1px solid #444"
      "box-shadow"  : "0 -4px 0 #444, 0 -2px 6px 3px #000"
      background    : "-webkit-linear-gradient(top, #333, #222)"
      left          : "0"
      padding       : "0"
      margin        : "0"
      width         : "100%"
      height        : "30px"
      "z-index"     : "9998"
      color         : "#fff"
      "font-family" : "helvetica"
      "font-size"   : "12px"

    @overlay.css
      background    : "-moz-linear-gradient(top,  #333,  #222)"

    $("#gw-overlay label").css
      display     : "inline-block"
      "font-size" : "12px"
      padding     : "0 0 0 16px"

    $("#gw-overlay input").css
      width       : "20px"
      background  : "#111"
      border      : "1px solid #333"
      "font-size" : "12px"
      margin      : "5px"
      color       : "white"

    $("#gw-overlay .color").css
      "box-shadow"    : "inset 0 1px 2px rgba(0,0,0, .34)"
      "border-radius" : "3px"
      cursor          : "pointer"
      display         : "inline-block"
      width           : "17px"
      height          : "17px"
      background      : "#111"
      border          : "1px solid #333"
      "font-size"     : "0"
      overflow        : "hidden"
      top             : "-3px"
      "margin-left"   : "5px"
      position        : "relative"
      "vertical-align": "top"
      "text-indent"   : "-1000%"

    color = $("#gw-overlay .color")

    for item in color
      $(item).css "background-color": $(item).text()

      $(item).click (e) =>
        @gridlineColor = $(e.target).text()
        $(".gw-gridline").css "border-color": @gridlineColor

    $("#gw-overlay img").css
      float: "left"
      margin: "4px 0 0 10px"

    $(".gw-razor").css display: "inline"
    $("#gw-console").css float: "left"
    $("#gw-close a").css
      color             : "#BC421E"
      "text-decoration" : "none"

    $("#gw-close a:hover").css
      color             : "#99C74A"
      "text-decoration" : "underline"

    $("#gw-close a:visited").css color: "#BC421E"
    $("#gw-color").css float: "left"
    $("#gw-close").css
      float          : "right"
      "margin-right" : "10px"
      "margin-top"   : "4px"

    @setGrid(18, 0)

  #////////////////////////////
  # Remove Grid
  shave: (e) ->
    e.preventDefault() unless !e?
    @gridwax.remove()
    @overlay.remove()
    window.gridwaxLoader.cleanShave()
    delete window.gridwax
    delete window.gridwaxLoader

  #////////////////////////////
  #
  keyDown: (e) => @shiftKey = true if e.which is 16

  keyUp: (e) =>
    if e.which is 13
      e.preventDefault()
      $lineHeight = $(".gw-lh")
      $offset = $(".gw-o")

      if $lineHeight.is(":focus") @setGrid($lineHeight.val(), $offset.val())
      else @setGrid($lineHeight.val(), $offset.val()  if $offset.is(":focus"))

    @groom(e)

  #////////////////////////////
  #
  groom: (e) ->
    if @shiftKey
      changed = true
      row = $(".gw-gridline")
      _height = row.height()
      _offset = @gridwax.offset().top

      switch e.keyCode
        when 16
          shiftKey = false
          changed = false
        when 38

          # up
          e.preventDefault()
          _height = _height + 1
        when 39

          # right
          e.preventDefault()
          _offset = @gridwax.offset().top + 1
        when 40

          # down
          e.preventDefault()
          _height = _height - 1
        when 37

          # left
          e.preventDefault()
          _offset = @gridwax.offset().top - 1
        else
          changed = false

      if changed and _height > 0
        $(".gw-lh").val _height + 1
        $(".gw-o").val @gridwax.offset().top
        @setGrid(_height + 1, _offset)

  #////////////////////////
  #
  setGrid: ($h, $o) ->
    @gridwax.html ""
    gridcount = @pageHeight / $h
    i = 0
    while i < gridcount
      @gridwax.append @gridline
      i++
    @gridwax.offset top: $o
    $(".gw-gridline").css
      width                 : "100%"
      height                : $h - 1
      clear                 : "both"
      "border-bottom-color" : @gridlineColor
      "border-bottom-width" : "1px"
      "border-bottom-style" : "solid"

  @gridwax = undefined
  @gridline = undefined
  @gridlineColor = undefined
  @overlay = undefined
  @pageWidth = undefined
  @pageHeight = undefined
  @shiftKey = false

class GridwaxLoader
  constructor: ->
    @checkMirror()

  checkMirror: ->
    stickyScripts = @comb()
    @trimScripts(stickyScripts) if stickyScripts.length > 1

  comb: ->
    scripts = @gatherScripts()
    @checkForWax(scripts)

  isItAlreadySticky: (script) -> if (script.src.indexOf("gridwax") != -1) then script

  checkForWax: (scripts) ->
    scripts.filter (script) => @isItAlreadySticky(script) isnt undefined

  gatherScripts: ->
    scripts = document.getElementsByTagName('script')
    Array.prototype.slice.call(scripts)

  trimScripts: (scripts) ->
    for script, i in scripts
      if i > 0 then @shaveScript(scripts, i)

  shaveScript: (scripts, i) -> scripts[i].parentElement.removeChild(scripts[i])

  cleanShave: (scripts) ->
    scripts = @comb()
    stickyScripts = @checkForWax(scripts)
    for script, i in stickyScripts
      @shaveScript(scripts, i)



if (!window.gridwaxLoader) then window.gridwaxLoader = new GridwaxLoader else window.gridwaxLoader.checkMirror()
if (!window.gridwax) then window.gridwax = new GridWax
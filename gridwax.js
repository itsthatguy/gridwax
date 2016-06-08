(function($) {
  var GridWax, GridwaxLoader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GridWax = (function() {
    function GridWax() {
      this.keyUp = __bind(this.keyUp, this);
      this.keyDown = __bind(this.keyDown, this);
      this.init = __bind(this.init, this);
      var $, head, jquery;
      if (!($ = window.jQuery)) {
        head = document.getElementsByTagName("head")[0];
        jquery = document.createElement("script");
        jquery.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
        jquery.type = "text/javascript";
        head.appendChild(jquery);
        jquery.onload = this.init;
      } else {
        this.init();
      }
    }

    GridWax.prototype.init = function() {
      var color, item, _i, _len;
      document.onkeydown = this.keyDown;
      document.onkeyup = this.keyUp;
      this.pageWidth = $(document).width();
      this.pageHeight = $(document).height();
      this.gridlineColor = "#000";
      $("body").append("<div id='gridwax'></div>");
      this.gridwax = $("#gridwax");
      this.gridwax.css({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: this.pageHeight,
        background: "RGBA(25,0,0,.1)",
        "z-index": "9990",
        "pointer-events": "none"
      });
      this.gridline = "<div class='gw-gridline'></div>";
      $("body").css("padding-bottom", "35px");
      $("body").append("<div id='gw-overlay'> <img src='//dl.dropbox.com/u/37716909/moustache.png'/> <div id='gw-console' class='gw-razor'> <label>Line-height: <input type='text' class='gw-lh' value='18' /></label> <label>Offset: <input type='text' class='gw-o' value='0' /></label> <label>Color: <a class='color'>#efefef</a> <a class='color'>#000</a> <a class='color'>#bd424b</a> <a class='color'>#cb6020</a> <a class='color'>#ffe960</a> <a class='color'>#3f9679</a> <a class='color'>#4c8dcf</a> <a class='color'>#a672ae</a> <a class='color'>#7576c9</a> </label> </div> <div id='gw-close' class='gw-razor'><a href='#' onclick='window.gridwax.shave();'>Remove the Grid ✖</a></div> </div>");
      this.overlay = $("#gw-overlay");
      this.overlay.css({
        position: "fixed",
        display: "block",
        bottom: 0,
        "border-top": "1px solid #444",
        "box-shadow": "0 -4px 0 #444, 0 -2px 6px 3px #000",
        background: "-webkit-linear-gradient(top, #333, #222)",
        left: "0",
        padding: "0",
        margin: "0",
        width: "100%",
        height: "30px",
        "z-index": "9998",
        color: "#fff",
        "font-family": "helvetica",
        "font-size": "12px"
      });
      this.overlay.css({
        background: "-moz-linear-gradient(top,  #333,  #222)"
      });
      $("#gw-overlay label").css({
        display: "inline-block",
        "font-size": "12px",
        padding: "0 0 0 16px"
      });
      $("#gw-overlay input").css({
        width: "20px",
        background: "#111",
        border: "1px solid #333",
        "font-size": "12px",
        margin: "5px",
        color: "white"
      });
      $("#gw-overlay .color").css({
        "box-shadow": "inset 0 1px 2px rgba(0,0,0, .34)",
        "border-radius": "3px",
        cursor: "pointer",
        display: "inline-block",
        width: "17px",
        height: "17px",
        background: "#111",
        border: "1px solid #333",
        "font-size": "0",
        overflow: "hidden",
        top: "-3px",
        "margin-left": "5px",
        position: "relative",
        "vertical-align": "top",
        "text-indent": "-1000%"
      });
      color = $("#gw-overlay .color");
      for (_i = 0, _len = color.length; _i < _len; _i++) {
        item = color[_i];
        $(item).css({
          "background-color": $(item).text()
        });
        $(item).click((function(_this) {
          return function(e) {
            _this.gridlineColor = $(e.target).text();
            return $(".gw-gridline").css({
              "border-color": _this.gridlineColor
            });
          };
        })(this));
      }
      $("#gw-overlay img").css({
        float: "left",
        margin: "4px 0 0 10px"
      });
      $(".gw-razor").css({
        display: "inline"
      });
      $("#gw-console").css({
        float: "left"
      });
      $("#gw-close a").css({
        color: "#BC421E",
        "text-decoration": "none"
      });
      $("#gw-close a:hover").css({
        color: "#99C74A",
        "text-decoration": "underline"
      });
      $("#gw-close a:visited").css({
        color: "#BC421E"
      });
      $("#gw-color").css({
        float: "left"
      });
      $("#gw-close").css({
        float: "right",
        "margin-right": "10px",
        "margin-top": "4px"
      });
      return this.setGrid(18, 0);
    };

    GridWax.prototype.shave = function(e) {
      if (!(e == null)) {
        e.preventDefault();
      }
      this.gridwax.remove();
      this.overlay.remove();
      window.gridwaxLoader.cleanShave();
      delete window.gridwax;
      return delete window.gridwaxLoader;
    };

    GridWax.prototype.keyDown = function(e) {
      if (e.which === 16) {
        return this.shiftKey = true;
      }
    };

    GridWax.prototype.keyUp = function(e) {
      var $lineHeight, $offset;
      if (e.which === 13) {
        e.preventDefault();
        $lineHeight = $(".gw-lh");
        $offset = $(".gw-o");
        if ($lineHeight.is(":focus")(this.setGrid($lineHeight.val(), $offset.val()))) {

        } else {
          this.setGrid($lineHeight.val(), $offset.is(":focus") ? $offset.val() : void 0);
        }
      }
      return this.groom(e);
    };

    GridWax.prototype.groom = function(e) {
      var changed, row, shiftKey, _height, _offset;
      if (this.shiftKey) {
        changed = true;
        row = $(".gw-gridline");
        _height = row.height();
        _offset = this.gridwax.offset().top;
        switch (e.keyCode) {
          case 16:
            shiftKey = false;
            changed = false;
            break;
          case 38:
            e.preventDefault();
            _height = _height + 1;
            break;
          case 39:
            e.preventDefault();
            _offset = this.gridwax.offset().top + 1;
            break;
          case 40:
            e.preventDefault();
            _height = _height - 1;
            break;
          case 37:
            e.preventDefault();
            _offset = this.gridwax.offset().top - 1;
            break;
          default:
            changed = false;
        }
        if (changed && _height > 0) {
          $(".gw-lh").val(_height + 1);
          $(".gw-o").val(this.gridwax.offset().top);
          return this.setGrid(_height + 1, _offset);
        }
      }
    };

    GridWax.prototype.setGrid = function($h, $o) {
      var gridcount, i;
      this.gridwax.html("");
      gridcount = this.pageHeight / $h;
      i = 0;
      while (i < gridcount) {
        this.gridwax.append(this.gridline);
        i++;
      }
      this.gridwax.offset({
        top: $o
      });
      return $(".gw-gridline").css({
        width: "100%",
        height: $h - 1,
        clear: "both",
        "border-bottom-color": this.gridlineColor,
        "border-bottom-width": "1px",
        "border-bottom-style": "solid",
        "box-sizing": "content-box"
      });
    };

    GridWax.gridwax = void 0;

    GridWax.gridline = void 0;

    GridWax.gridlineColor = void 0;

    GridWax.overlay = void 0;

    GridWax.pageWidth = void 0;

    GridWax.pageHeight = void 0;

    GridWax.shiftKey = false;

    return GridWax;

  })();

  GridwaxLoader = (function() {
    function GridwaxLoader() {
      this.checkMirror();
    }

    GridwaxLoader.prototype.checkMirror = function() {
      var stickyScripts;
      stickyScripts = this.comb();
      if (stickyScripts.length > 1) {
        return this.trimScripts(stickyScripts);
      }
    };

    GridwaxLoader.prototype.comb = function() {
      var scripts;
      scripts = this.gatherScripts();
      return this.checkForWax(scripts);
    };

    GridwaxLoader.prototype.isItAlreadySticky = function(script) {
      if (script.src.indexOf("gridwax") !== -1) {
        return script;
      }
    };

    GridwaxLoader.prototype.checkForWax = function(scripts) {
      return scripts.filter((function(_this) {
        return function(script) {
          return _this.isItAlreadySticky(script) !== void 0;
        };
      })(this));
    };

    GridwaxLoader.prototype.gatherScripts = function() {
      var scripts;
      scripts = document.getElementsByTagName('script');
      return Array.prototype.slice.call(scripts);
    };

    GridwaxLoader.prototype.trimScripts = function(scripts) {
      var i, script, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = scripts.length; _i < _len; i = ++_i) {
        script = scripts[i];
        if (i > 0) {
          _results.push(this.shaveScript(scripts, i));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GridwaxLoader.prototype.shaveScript = function(scripts, i) {
      return scripts[i].parentElement.removeChild(scripts[i]);
    };

    GridwaxLoader.prototype.cleanShave = function(scripts) {
      var i, script, stickyScripts, _i, _len, _results;
      scripts = this.comb();
      stickyScripts = this.checkForWax(scripts);
      _results = [];
      for (i = _i = 0, _len = stickyScripts.length; _i < _len; i = ++_i) {
        script = stickyScripts[i];
        _results.push(this.shaveScript(scripts, i));
      }
      return _results;
    };

    return GridwaxLoader;

  })();

  if (!window.gridwaxLoader) {
    window.gridwaxLoader = new GridwaxLoader;
  } else {
    window.gridwaxLoader.checkMirror();
  }

  if (!window.gridwax) {
    window.gridwax = new GridWax;
  }
}).call(this, jQuery);


if (!($ = window.jQuery)) { // typeof jQuery=='undefined' works too
  head        = document.getElementsByTagName('head')[0];
  jquery      = document.createElement( 'script' );
  jquery.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  jquery.type = 'text/javascript';
  head.appendChild(jquery);
  
  // ceaser      = document.createElement( 'link' );
  // ceaser.href = '/stylesheets/gridwax.css';
  // ceaser.type = 'text/css';
  // ceaser.rel  = 'stylesheet';
  // head.appendChild(ceaser);
  
  jquery.onload = init

} else {
  console.log("flkajsdf")
}

var gridwax;
var gridline;
var overlay;

var pageWidth;
var pageHeight;

function init() {

  pageWidth = $(document).width()
  pageHeight = $(document).height()

  console.log(pageHeight)

  $('body').append('<div id="gridwax"></div>')
  gridwax = $('#gridwax')
  gridwax.css({ 'position'                      : 'absolute',
                'top'                           : 0,
                'left'                          : 0,
                'width'                         : '100%',
                'height'                        : pageHeight,
                'background'                    : 'RGBA(25,0,0,.1)',
                'z-index'                       : '9990',
                'pointer-events'                :'none'})

  gridline = '<div class="gw-gridline"></div>'

  $('body').css('padding-bottom', '35px')
  $('body').append( '<div id="gw-overlay"> \
                      <img src="http://dl.dropbox.com/u/37716909/moustache.png"/> \
                      <div id="gw-console" class="gw-razor"> \
                        <label>Line-height: <input type="text" class="gw-lh" value="18" /></label> \
                        <label>Offset: <input type="text" class="gw-o" value="0" /></label> \
                      </div> \
                      <div id="gw-close" class="gw-razor"><a href="javascript:shave();">Remove the Grid ✖</a></div> \
                    </div>')
  overlay = $('#gw-overlay')
  overlay.css({                 'position'      : 'fixed',
                                'display'       : 'block',
                                'bottom'        : 0,
                                'border-top'    : '1px solid #444',
                                'box-shadow'    : '0 -4px 0 #444, 0 -2px 6px 3px #000',
                                'background'    : '-webkit-linear-gradient(top, #333, #222)',
                                'left'          : '0',
                                'padding'       : '0',
                                'margin'        : '0',
                                'width'         : '100%',
                                'height'        : '30px',
                                'z-index'       : '9998',
                                'color'         : '#fff',
                                'font-family'   : 'helvetica',
                                'font-size'     : '12px'})

  $('#gw-overlay label').css({  'padding'       : '0 0 0 16px'})
  $('#gw-overlay input').css({  'width'         : '20px',
                                'background'    : '#111',
                                'border'        : '1px solid #333',
                                'margin'        : '5px',
                                'color'         : 'white'})

  $('#gw-overlay img').css({    'float'         : 'left',
                                'margin'        : '4px 0 0 10px'})

  $('.gw-razor').css({          'display'       : 'inline'})
  $('#gw-console').css({        'float'         : 'left'})
  $('#gw-close a').css({        'color'         : '#BC421E', 'text-decoration' : 'none'})
  $('#gw-close a:hover').css({  'color'         : '#99C74A', 'text-decoration' : 'underline'})
  $('#gw-close a:visited').css({'color'         : '#BC421E'})
  $('#gw-color').css({          'float'         : 'left'})
  $('#gw-close').css({          'float'         : 'right', 'margin-right' : '10px', 'margin-top' : '4px'})





  setGrid(18, 0);

  var shiftKey = false

  $(document).keydown(function(e) {
    if (e.which == 16) { shiftKey = true; }
  })
  $(document).keyup(function(e) {
    if ( e.which == 13 ) {
       e.preventDefault();
     }
     groom(e)

   })

  
}



//////////////////////////
  
function setGrid($h, $o) {
  var gridcount = pageHeight / $h;

  for (i=0; i<gridcount; i++) {
    gridwax.append(gridline)
  }

  $('.gw-gridline').css({       'width'         : '100%',
                                'height'        : $h-1,
                                'clear'         : 'both',
                                'border-bottom' : '1px solid #000' })
  console.log($('.gw-gridline').height())
}

function shave() {
  gridwax.remove();
  overlay.remove();
}

function groom(e) {

  if (shiftKey) {
    var changed = true;
    var row = $('.gw-gridline');
    var _height = row.height();

    var _offset = gridwax.offset();

    switch(e.keyCode) {
      case 16 :
        shiftKey = false;
        changed = false;
        break;
      case 38 :
        // up
        e.preventDefault()
        _height = _height + 1
        row.height(_height)
        break;
      case 39 :
        // right
        e.preventDefault()
        gridwax.offset({ top: _offset.top + 1 })
        break;
      case 40 :
        // down
        e.preventDefault()
        _height = _height - 1
        row.height(_height)
        break;
      case 37 :
        // left
        e.preventDefault()
        gridwax.offset({ top: _offset.top - 1 })
        break;
      default :
        changed = false;
        console.log("--")
        break
    }

    if (changed) {
      $('.gw-lh').val(_height + 1)
      $('.gw-o').val(gridwax.offset().top)
    }
  }
}
;

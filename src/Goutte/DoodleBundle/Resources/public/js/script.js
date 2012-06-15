//// ADD TO MOOTOOLS CLOUD

(function () {
  var _slice = Array.prototype.slice;

  Element.implement({
    /*
     adds 1+ classes to the element
     e.g. document.id('myEl').addClasses('one', 'two', 'three');
          document.id('myEl').addClasses(['one', 'two', 'three']);
     */
    addClasses: function () {
      var args, i, l;

      if (arguments.length == 1 && Array.isArray(arguments[0]))
        args = arguments[0];
      else
        args = _slice.call(arguments);

      l = args.length;

      for (i = 0; i < l; i++)
        if (!this.hasClass(args[i]))
          this.className = (this.className + ' ' + args[i]).clean();

      return this;
    },

    /*
     removes 1+ classes from the element
     e.g. document.id('myEl').removeClasses('one', 'two', 'three');
     */
    removeClasses: function () {
      this.className = this.className.replace(new RegExp('(^|\\s)(?:' + _slice.call(arguments).join('|') + ')(?:\\s|$)', 'g'), '$1');

      return this;
    }
  });
})();


//// UGLY-ASS TWEAKS ///////////////////////////////////////////////////////////////////////////////////////////////////

// Chrome, linux (maybe others?), the crosshair is sometimes replaced by a text-select
// The page has virtually no selectable content, so we remove selection altogether
document.onselectstart = function () { return false; };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// CONFIGURATION AND GLOBAL VARS /////////////////////////////////////////////////////////////////////////////////////

var minDistBetweenPoints = 7;
var movingSpeedFor1000   = 50;
var minMovingSpeed       = 17;

var drawnPath;
var drawnPaths = new Array();

var doodlePaperScope, doodleHolderPaperScope;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var notifs;
var defaultNotifOptions = {
  classes: ['notification', 'animatedSmooth'],
  classShow: 'bounceInDown',
  classHide: 'bounceOutUp',
  animationDuration: 1600,
  onCreate: function(){
    // add timeout : 13s
    (function(){ if (this) this.fireEvent('click'); }).delay(13000, this);
  },
  onClick: function(){
    // remove the notif
    this.manager.remove(this);
    // get the focus back to the canvas
    document.id('doodleCanvas').focus();
  }
};



window.addEvent('load', function(){

  notifs = new NotificationsManager('notifications', {notification: defaultNotifOptions});
  (function(){
    notif('Hello there !<br />Click and drag anywhere on the screen to draw a doodle.', {});
  }).delay(500);

});

function notif (message, options) {
  options = Object.merge(defaultNotifOptions, options);
  if (notifs) notifs.add(message, options);
  else log ('notification failed', message, options);
}



//// DOM CONTROL FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Refreshes the framerate under AG for testing
 * @param delta event.delta
 */
var refreshFramerate = function(){};

window.addEvent('domready', function(){

  refreshFramerate = function (delta) {
    document.id ('framerate').set('text', delta ? (1/delta).toInt() : 0);
  }

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Add the provided path to the holder
 * @param path
 */
var addPathToHolder = function (path) {
  paper = doodleHolderPaperScope;
  return paper.addPathToHolder(path);
};

/**
 * Redraw the holder.
 * This is not good. How ?
 */
var drawHolder = function () {
  paper = doodleHolderPaperScope;
  paper.view.draw();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


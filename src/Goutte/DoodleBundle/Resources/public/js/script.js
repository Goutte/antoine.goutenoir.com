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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var NotificationsManager = new Class({

  Implements: [Options, Chain, Events],

  options: {
    notification: {
      animationDuration: 1600,
      classShow: 'bounceInDown',
      classHide: 'bounceOutUp',
      clear:     false
    }
  },

  initialize: function (holder, options) {
    this.holder = document.id(holder);
    this.setOptions(options);
    this.stack = [];
  },

  add: function (message, options) {
    options = Object.merge(this.options.notification, options);
    if (options && true == options.clear) {
      this.clear();
      options.clear = false;
      this.add.delay(this.options.notification.animationDuration, this, [message, options]);
    } else {
      var n = new Notification(this, message, options);
      n.getElement().inject(this.holder);
      n.show();
      n.getElement().setStyle('visibility', 'visible');
      this.stack.push(n);
    }
  },

  remove: function (notification) {
    var i = this.stack.indexOf(notification);
    if (i != -1) {
      this.stack.splice(i,1);
      notification.hideAndDestroy();
    }
  },

  clear: function () {
    var n;
    while (n = this.stack.pop()) {
      n.hideAndDestroy();
    }
  }

});

var Notification = new Class({

  Implements: [Options, Chain, Events],

  options: {
    classes: ['notification', 'animatedSmooth'],
    classShow: 'bounceInDown',
    classHide: 'bounceOutUp',
    animationDuration: 1600,
    onClick: function(){
      this.manager.remove(this);
    }
  },

  initialize: function (manager, message, options) {
    this.manager = manager;
    this.message = message;
    this.setOptions(options);
  },

  _createDOM: function () {
    this.element = new Element('div');
    this.element.addClasses(this.options.classes);
    var p = new Element('p');
    p.set('html', this.message);
    p.inject(this.element);

    this.element.addEvents ({
      'click': function(){this.fireEvent('click')}.bind(this)
    });

    return this.element;
  },

  getElement: function () {
    return this.element ? this.element : this._createDOM();
  },

  show: function () {
    this.getElement().removeClass(this.options.classShow).addClass(this.options.classShow);
  },

  hide: function () {
    this.getElement().removeClass(this.options.classHide).addClass(this.options.classHide);
  },

  hideAndDestroy: function () {
    this.hide();
    (function(){
      this.element.destroy();
    }).delay(this.options.animationDuration, this);
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var notifs;

window.addEvent('load', function(){

  notifs = new NotificationsManager('notifications');
  (function(){
    notifs.add('Hello there !<br />Click and drag anywhere on the screen to draw a doodle.', {});
  }).delay(1000);

});

function notif (message, options) {
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
    document.id ('framerate').set('text', delta ? 1/delta : 0);
  }

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var doodlePaperScope, doodleHolderPaperScope;

var addPathToHolder = function (path) {

  paper = doodleHolderPaperScope;
  var pathCopy = paper.addPathToHolder(path);

  return pathCopy;

};

//// CONFIGURATION AND GLOBAL VARS /////////////////////////////////////////////////////////////////////////////////////

var minDistBetweenPoints = 7;
var movingSpeedFor1000 = 50;
var minMovingSpeed = 17;

var drawnPath;
var drawnPaths = new Array();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





//
//window.addEvent('domready', function () {
//
//  // Get a reference to the canvas object
//  var canvas = document.getElementById('doodleCanvas');
//  var canvasHolder = document.getElementById('doodleHolderCanvas');
//  // Create an empty project and a view for the canvas:
//
//  paper.setup(canvasHolder);
//  paper.setup(canvas);
//
//  var paperProjectHolder = paper.projects[0];
//
//  var paperProjectDoodle = paper.projects[1];
//
//  log (paper, paperProjectDoodle, paperProjectHolder);
//
//  with (paper) {
//
//    paperProjectHolder.activate();
//
//    paperProjectDoodle.activate();
//
//    var dp = new Path();
//    dp.add(new Point.random() * view.size);
//    dp.add(new Point.random() * view.size);
//    dp.add(new Point.random() * view.size);
//    dp.add(new Point.random() * view.size);
//    dp.add(new Point.random() * view.size);
//    dp.add(new Point.random() * view.size);
//    dp.strokeColor = 'red';
//
//    log (dp, Point.random(), view, view.size); // THE OPERATORS ARE NOT WORKING, WHICH SUCKS
//
//    paper.view.draw();
//
//
//
//
//
//
//
//    var minDistBetweenPoints = 7;
//    var movingSpeedFor1000 = 50;
//    var minMovingSpeed = 17;
//
//    var drawnPath;
//    var drawnPaths = new Array();
//
//
//
//    //var initialTextHelper = new PointText(new Point(getDrawingCanvas().width / 2 - 80, 55));
//    //initialTextHelper.fillColor = '#fff';
//    //initialTextHelper.content = 'Click and drag to draw a doodle.';
//
//
//    /** INIT **************************************************************************************************************/
//
//    //log ('view', view.size.width, view.size.height);
//
//    /** TOOLS LISTENERS ***************************************************************************************************/
//
//    var drawingTool = new Tool();
//
//    drawingTool.minDistance = minDistBetweenPoints;
//
//    drawingTool.onMouseDown = function (event) {
//      // If we produced a path before, deselect it:
//      if (drawnPath) {
//        drawnPath.selected = false;
//      }
//
//      // Create a new path
//      drawnPath = new Path();
//      drawnPath.add(event.point);
//      drawnPath.strokeColor = 'white';
//    };
//
//    // While the user drags the mouse or the finger, points are added to the path
//    // at the position of the mouse or the finger:
//    drawingTool.onMouseDrag = function (event) {
//
//      // Chrome on android sometimes fire this listener with a event.point in the exact center of the view
//      // I cannot find the origin of the bug (for now), so we cancel any event pointed to the exact center
//      if (getDrawingCanvas().width == 2 * event.point.x && getDrawingCanvas().height == 2 * event.point.y) return;
//
//      // Add the new point to the path
//      drawnPath.add(event.point);
//
//    //  // Get the last point of the path
//    //  var lastPoint = drawnPath.getLastSegment().getPoint();
//    //  // Check if the new point is far away enough
//    //  var distBetweenPoints = event.point.getDistance(lastPoint);
//    //
//    //  if (distBetweenPoints > minDistBetweenPoints) {
//    //    drawnPath.add(event.point);
//    //    //log('adding point', event, event.point.x, event.point.y, view.size.width - 2 * event.point.x, view.size.height - 2 * event.point.y);
//    //    //drawnPath.smooth();
//    //  }
//
//    };
//
//    // When the mouse is released, we simplify the path:
//    drawingTool.onMouseUp = function (event) {
//      var segmentCount = drawnPath.segments.length;
//
//      // When the mouse is released, simplify it:
//      drawnPath.simplify(13);
//
//      // If it is a point, make it bigger fixme
//      if (segmentCount == 1) {
//        drawnPath.strokeWidth = 10;
//      } else {
//        drawnPath.strokeWidth = 2;
//      }
//
//      //addPathToHolder(drawnPath); // fixme
//
//      // Add to the stack
//      drawnPaths.push(drawnPath);
//      // Update Controls
//      updateControls('draw');
//    };
//
//
//    drawingTool.onKeyDown = function (event) {
//      if (event.key == 'z') {
//        undo();
//      }
//    };
//
//
//    drawingTool.activate();
//
//
//    /** VIEW ONFRAME ******************************************************************************************************/
//
//
//
//    view.onFrame = function (event) {
//      if (Key.isDown('c')) {
//        movePathsTowardsSave();
//      }
//    };
//
//
//
//    /** CONTROL LOGIC *****************************************************************************************************/
//
//    function undo () {
//      var p = drawnPaths.pop();
//      p.remove();
//      updateControls('undo', {});
//    }
//
//
//    function save () {
//
//      var saveRequest = new Request.JSON({
//        url: 'doodle/save',
//        method: 'post',
//        onRequest: function () {
//          log('Saving Doodle...');
//        },
//        onSuccess: function (responseJSON, responseText) {
//          log('Success !', responseText);
//          if (responseJSON.status == 'ok') {
//            updateControls('save', {doodleId: responseJSON.id});
//            //document.location.href = 'doodle/view/' + responseJSON.id;
//          } else if (responseJSON.status == 'error') {
//            notif(responseJSON.error);
//          }
//        },
//        onFailure: function () {
//          log('Fail ! Sorry.');
//          notif('Something went terribly wrong. Try again later ?');
//        }
//      });
//
//      var dataURL = canvasToImage(getDrawingCanvas(), '#000');
//
//      var img = document.createElement('img');
//      img.setAttribute('src', dataURL);
//
//      saveRequest.send(Object.toQueryString({
//        dataURL: dataURL
//      }));
//
//    }
//
//
//    function send (data) {
//
//      var sendRequest = new Request.JSON({
//        url: 'doodle/send/' + data.id,
//        method: 'post',
//        onRequest: function () {
//          log('Sending Doodle...');
//        },
//        onSuccess: function (responseJSON, responseText) {
//          log('Success !', responseText);
//          if (responseJSON.status == 'ok') {
//            updateControls('send', data);
//          } else if (responseJSON.status == 'error') {
//            notif(responseJSON.error);
//          }
//        },
//        onFailure: function () {
//          log('Fail ! Sorry.');
//          notif('Something went terribly wrong. Try again later ?');
//        }
//      });
//
//      sendRequest.send(Object.toQueryString(data));
//
//    }
//
//    function getLinkSend (doodleId) {
//      return 'doodle/send/' + doodleId;
//    }
//
//    function getLinkDownAsImage (doodleId) {
//      return 'doodle/download/' + doodleId;
//    }
//
//    function getLinkViewAsImage (doodleId) {
//      return 'doodle/view/' + doodleId;
//    }
//
//
//    /** CONTROLS **********************************************************************************************************/
//
//    function updateControls (from, options) {
//      var buttonSave = document.id('buttonSave');
//      var buttonUndo = document.id('buttonUndo');
//      var buttonSend = document.id('buttonSend');
//      var buttonView = document.id('buttonView');
//      var buttonDown = document.id('buttonDown');
//      var formSend = document.id('formSend');
//
//      // Show / Hide Save & Undo
//      if ('save' != from && 'send' != from && drawnPaths.length) {
//        buttonSave.removeClass('hiddenSmall');
//        buttonUndo.removeClass('hiddenSmall');
//      } else {
//        buttonSave.addClass('hiddenSmall');
//        buttonUndo.addClass('hiddenSmall');
//      }
//
//      // Show / Hide Download & Send & View
//      if ('save' == from && options.doodleId) {
//        buttonSend.setAttribute('href', getLinkSend(options.doodleId));
//        buttonSend.setAttribute('doodleId', options.doodleId);
//        buttonSend.removeClass('hiddenSmall');
//        buttonView.setAttribute('href', getLinkViewAsImage(options.doodleId));
//        buttonView.removeClass('hiddenSmall');
//        buttonDown.setAttribute('href', getLinkDownAsImage(options.doodleId));
//        buttonDown.removeClass('hiddenSmall');
//        notif('<b>Your doodle has been saved.</b><br />' +
//              'You can send it to me along with a message, ' +
//              'view the image in a new tab or simply download it as a png image.');
//      }
//
//      if ('draw' == from) {
//        if (drawnPaths.length == 1) {
//          notif('Good job ! Have fun !', {clear:true});
//        } else if (drawnPaths.length == 6) {
//          notif('<b>KEYBOARD ENABLED !</b><br />You can hit <b>[z]</b> to undo your last draw.');
//        } else if (drawnPaths.length == 12) {
//          notif('The page is probably getting slower.<br />It is expected -- this is a performance experiment.');
//        } else if (drawnPaths.length == 32) {
//          notif("Just hit <b>[c]</b> for Free Cake™ !");
//        } else if (drawnPaths.length == 100) {
//          notif("Waow, that's a big doodle you're drawing there !<br />I hope you'll save that !");
//        } else if (drawnPaths.length == 256) {
//          notif("<b>~ ACHIEVEMENT UNLOCKED ~</b><br />Web Doodle Artist");
//        }
//        // Hide control buttons
//        buttonSend.addClass('hiddenSmall');
//        buttonView.addClass('hiddenSmall');
//        buttonDown.addClass('hiddenSmall');
//        formSend.addClass('hiddenSmall');
//      }
//
//      if ('send' == from) {
//        if (!options.title && !options.message) {
//          buttonSend.addClass('used');
//          formSend.removeClass('hiddenSmall');
//        } else {
//          warpDoodleIntoSpace();
//        }
//      }
//    }
//
//
//    function warpDoodleIntoSpace () {
//      document.id('formSend').addClass('hiddenSmall');
//      notifs.add("Well done, and thank you !");
//    }
//
//    /** DOM BEHAVIORS *****************************************************************************************************/
//
//    window.addEvent('domready', function () {
//
//      var buttonSave = document.id('buttonSave');
//      var buttonUndo = document.id('buttonUndo');
//      var buttonSend = document.id('buttonSend');
//      var buttonView = document.id('buttonView');
//      var buttonDown = document.id('buttonDown');
//      var formSend   = document.id('formSend');
//
//
//      buttonSave.addEvents({
//        'click': function (event) {
//          event = new Event(event); event.stop();
//          buttonSave.addClass('hiddenSmall');
//          buttonUndo.addClass('hiddenSmall');
//          save();
//        }
//    //    'mousedown': function (event) { this.addClass('selected'); },
//    //    'mouseup':   function (event) { this.removeClass('selected'); }
//      });
//
//      buttonUndo.addEvents({
//        'click': function (event) {
//          event = new Event(event); event.stop();
//          undo();
//        }
//    //    'mousedown': function (event) { this.addClass('selected'); },
//    //    'mouseup':   function (event) { this.removeClass('selected'); }
//      });
//
//
//
//      buttonSend.addEvent('click', function (event) {
//        event = new Event(event);
//        event.stop();
//        send({id: buttonSend.getAttribute('doodleId')});
//      });
//
//
//      formSend.addEvents({
//        'submit': function (event) {
//          event.stop();
//          var formData = this.toQueryString().parseQueryString();
//          if (formData.title || formData.message) {
//            // Send the stuff back to base
//            send(Object.merge({id: buttonSend.getAttribute('doodleId')}, formData));
//          } else {
//            // We clicked on submit but filled nothing, so we're going to hide the form and that's it !
//            warpDoodleIntoSpace();
//          }
//        },
//        // compatibility with paper's onKeyDown
//        'keydown': function (event) { event.stopPropagation(); },
//        'keyup':   function (event) { event.stopPropagation(); }
//      });
//
//
//    });
//
//
//    /** ANIMATION STEPS ***************************************************************************************************/
//
//    function movePathsTowardsSave () {
//      var toX = view.size.width;
//      var toY = view.size.height;
//      var to = new Point(toX, toY);
//
//      for (var i = 0; i < drawnPaths.length; i++) {
//        movePathTowards(drawnPaths[i], to);
//      }
//    }
//
//    function movePathTowards (path, destinationPoint) {
//
//      // Find the moving vector and the first segment that needs to move
//      var j = -1;
//      var movingVector;
//      var movingSpeed = Math.max(minMovingSpeed, path.length * movingSpeedFor1000 / 1000);
//      do {
//        j++;
//        movingVector = destinationPoint - path.segments[j].point;
//        if (movingVector.length > movingSpeed) movingVector = movingVector.normalize(movingSpeed);
//      } while (movingVector.isZero() && j < path.segments.length - 1);
//
//      // If we have nothing to move for this path
//      if (j >= path.segments.length)  {
//        path.remove();
//        drawnPaths.splice(drawnPaths.indexOf(path), 1);
//        updateControls();
//        return;
//      }
//
//      // Backup the position of the point so we can calculate the movement of the next
//      var oldPrevPoint = new Point(path.segments[j].point);
//
//      // Move the first point
//      path.segments[j].point = path.segments[j].point + movingVector;
//
//      // For each remaining point of the path
//      for (var i = j + 1; i < path.segments.length; i++) {
//        var prevSegment = path.segments[i - 1];
//        var thisSegment = path.segments[i];
//
//        var angle = (thisSegment.point - prevSegment.point).angle;
//        var length = (thisSegment.point - oldPrevPoint).length;
//        var vector = new Point({ angle: angle, length: length });
//
//        oldPrevPoint = new Point(thisSegment.point);
//
//        thisSegment.point = prevSegment.point + vector;
//      }
//
//      path.smooth();
//
//    }
//
//    /** TOOLS *************************************************************************************************************/
//
//    function getDrawingCanvas () {
//      return paper.project.view._element;
//    }
//
//    /**
//     * Returns the dataURL (Base64 encoded data url string)
//     * of the specified canvas, but applies background color first
//     * @param canvas
//     * @param backgroundColor
//     * @return {String} the dataURL
//     */
//    function canvasToImage (canvas, backgroundColor) {
//      // cache height and width
//      var w = canvas.width;
//      var h = canvas.height;
//      var context = canvas.getContext("2d");
//      var data;
//
//      if (backgroundColor) {
//        // get the current ImageData for the canvas.
//        data = context.getImageData(0, 0, w, h);
//        // store the current globalCompositeOperation
//        var compositeOperation = context.globalCompositeOperation;
//        // set to draw behind current content
//        context.globalCompositeOperation = "destination-over";
//        // set background color
//        context.fillStyle = backgroundColor;
//        // draw background / rect on entire canvas
//        context.fillRect(0, 0, w, h);
//      }
//
//      // get the image data from the canvas
//      var imageData = canvas.toDataURL("image/png");
//
//      if (backgroundColor) {
//        // clear the canvas
//        context.clearRect(0, 0, w, h);
//        // restore it with original / cached ImageData
//        context.putImageData(data, 0, 0);
//        // reset the globalCompositeOperation to what it was
//        context.globalCompositeOperation = compositeOperation;
//      }
//
//      return imageData;
//    }
//
//
//
//  }
////  // Create a Paper.js Path to draw a line into it:
////  var path = new paper.Path();
////  // Give the stroke a color
////  path.strokeColor = 'red';
////  var start = new paper.Point(100, 100);
////  // Move to start and draw a line from there
////  path.moveTo(start);
////  // Note that the plus operator on Point objects does not work
////  // in JavaScript. Instead, we need to call the add() function:
////  path.lineTo(start.add([ 200, -50 ]));
////  // Draw the view now:
////  paper.view.draw();
//});

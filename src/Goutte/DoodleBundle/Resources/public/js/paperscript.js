var minDistBetweenPoints = 7;
var movingSpeedFor1000 = 50;
var minMovingSpeed = 17;

var drawnPath;
var drawnPaths = new Array();


// Only execute onMouseDrag when the mouse has moved at least 7 points
//tool.distanceThreshold = 70; // not working !

//var textItem = new PointText(new Point(20, 55));
//textItem.fillColor = 'black';
//textItem.content = 'Click and drag to draw a line.';


/** INIT **************************************************************************************************************/


/** LISTENERS *********************************************************************************************************/

function onMouseDown (event) {
  // If we produced a path before, deselect it:
  if (drawnPath) {
    drawnPath.selected = false;
  }

  // Create a new path
  drawnPath = new Path();
  drawnPath.add(event.point);
  drawnPath.strokeColor = 'white';
}

// While the user drags the mouse or the finger, points are added to the path
// at the position of the mouse or the finger:
function onMouseDrag (event) {

  // Get the last point of the path
  var lastPoint = drawnPath.getLastSegment().getPoint();
  // Check if the new point is far away enough
  var distBetweenPoints = event.point.getDistance(lastPoint);

  if (distBetweenPoints > minDistBetweenPoints) {
    drawnPath.add(event.point);
  }

}

// When the mouse is released, we simplify the path:
function onMouseUp (event) {
  var segmentCount = drawnPath.segments.length;

  // When the mouse is released, simplify it:
  drawnPath.simplify(13);

  // If it is a point, make it bigger
  if (segmentCount == 1) {
    drawnPath.strokeWidth = 10;
  } else {
    drawnPath.strokeWidth = 2;
  }

  // Add to the stack
  drawnPaths.push(drawnPath);
  // Update Controls
  updateControls('draw');
}

function onFrame () {
  if (Key.isDown('c')) {
    movePathsTowardsSave();
  }
}

function onKeyDown (event) {
  if (event.key == 'z') {
    undo();
  }
}


/** CONTROL LOGIC *****************************************************************************************************/

function undo () {
  var p = drawnPaths.pop();
  p.remove();
  updateControls('undo', {});
}


function save () {

  var saveRequest = new Request.JSON({
    url: 'doodle/save',
    method: 'post',
    onRequest: function () {
      log('Saving Doodle...');
    },
    onSuccess: function (responseJSON, responseText) {
      log('Success !', responseText);
      if (responseJSON.status == 'ok') {
        updateControls('save', {doodleId: responseJSON.id});
        //document.location.href = 'doodle/view/' + responseJSON.id;
      } else if (responseJSON.status == 'error') {
        alert(responseJSON.error);
      }
    },
    onFailure: function () {
      log('Fail ! Sorry.');
      alert('Something went terribly wrong. Try again later ?');
    }
  });

  var dataURL = canvasToImage(getDrawingCanvas(), '#000');

  var img = document.createElement('img');
  img.setAttribute('src', dataURL);

  saveRequest.send(Object.toQueryString({
    dataURL: dataURL
  }));

}


function send (data) {

  var sendRequest = new Request.JSON({
    url: 'doodle/send/' + data.id,
    method: 'post',
    onRequest: function () {
      log('Sending Doodle...');
    },
    onSuccess: function (responseJSON, responseText) {
      log('Success !', responseText);
      if (responseJSON.status == 'ok') {
        updateControls('send', data);
      } else if (responseJSON.status == 'error') {
        alert(responseJSON.error);
      }
    },
    onFailure: function () {
      log('Fail ! Sorry.');
      alert('Something went terribly wrong. Try again later ?');
    }
  });

  sendRequest.send(Object.toQueryString(data));

}

function getLinkSend (doodleId) {
  return 'doodle/send/' + doodleId;
}

function getLinkDownAsImage (doodleId) {
  return 'doodle/download/' + doodleId;
}

function getLinkViewAsImage (doodleId) {
  return 'doodle/view/' + doodleId;
}


/** CONTROLS **********************************************************************************************************/

function updateControls (from, options) {
  var buttonSave = document.id('buttonSave');
  var buttonUndo = document.id('buttonUndo');
  var buttonSend = document.id('buttonSend');
  var buttonView = document.id('buttonView');
  var buttonDown = document.id('buttonDown');
  var formSend = document.id('formSend');

  if (drawnPaths.length) {
    buttonSave.removeClass('hiddenSmall');
    buttonUndo.removeClass('hiddenSmall');
  } else {
    buttonSave.addClass('hiddenSmall');
    buttonUndo.addClass('hiddenSmall');
  }

  if ('save' == from && options.doodleId) {
    buttonSend.setAttribute('href', getLinkSend(options.doodleId));
    buttonSend.setAttribute('doodleId', options.doodleId);
    buttonSend.removeClass('hiddenSmall');
    buttonView.setAttribute('href', getLinkViewAsImage(options.doodleId));
    buttonView.removeClass('hiddenSmall');
    buttonDown.setAttribute('href', getLinkDownAsImage(options.doodleId));
    buttonDown.removeClass('hiddenSmall');
  }

  if ('draw' == from) {
    buttonSend.addClass('hiddenSmall');
    buttonView.addClass('hiddenSmall');
    buttonDown.addClass('hiddenSmall');
    formSend.addClass('hiddenSmall');
  }

  if ('send' == from) {
    if (!options.title && !options.message) {
      buttonSend.addClass('used');
      formSend.removeClass('hiddenSmall');
    } else {
      warpDoodleIntoSpace();
    }
  }
}


function warpDoodleIntoSpace () {
  document.id('formSend').addClass('hiddenSmall');
  alert("Well done, and thank you !");
}


window.addEvent('domready', function () {

  var buttonSave = document.id('buttonSave');
  var buttonUndo = document.id('buttonUndo');
  var buttonSend = document.id('buttonSend');
  var buttonView = document.id('buttonView');
  var buttonDown = document.id('buttonDown');
  var formSend   = document.id('formSend');


  buttonSave.addEvents({
    'click': function (event) {
      event = new Event(event); event.stop();
      buttonSave.addClass('hiddenSmall');
      buttonUndo.addClass('hiddenSmall');
      save();
    },
    'mousedown': function (event) { this.addClass('selected'); },
    'mouseup':   function (event) { this.removeClass('selected'); }
  });

  buttonUndo.addEvents({
    'click': function (event) {
      event = new Event(event); event.stop();
      undo();
    },
    'mousedown': function (event) { this.addClass('selected'); },
    'mouseup':   function (event) { this.removeClass('selected'); }
  });



  buttonSend.addEvent('click', function (event) {
    event = new Event(event);
    event.stop();
    send({id: buttonSend.getAttribute('doodleId')});
  });


  formSend.addEvents({
    'submit': function (event) {
      event.stop();
      var formData = this.toQueryString().parseQueryString();
      if (formData.title || formData.message) {
        // Send the stuff back to base
        send(Object.merge({id: buttonSend.getAttribute('doodleId')}, formData));
      } else {
        // We clicked on submit but filled nothing, so we're going to hide the form and that's it !
        warpDoodleIntoSpace();
      }
    },
    // compatibility with paper's onKeyDown
    'keydown': function (event) { event.stopPropagation(); },
    'keyup':   function (event) { event.stopPropagation(); }
  });


});


/** ANIMATION STEPS ***************************************************************************************************/

function movePathsTowardsSave () {
  var toX = view.size.width;
  var toY = view.size.height;
  var to = new Point(toX, toY);

  for (var i = 0; i < drawnPaths.length; i++) {
    movePathTowards(drawnPaths[i], to);
  }
}

function movePathTowards (path, destinationPoint) {

  // Find the moving vector and the first segment that needs to move
  var j = -1;
  var movingVector;
  var movingSpeed = Math.max(minMovingSpeed, path.length * movingSpeedFor1000 / 1000);
  do {
    j++;
    movingVector = destinationPoint - path.segments[j].point;
    if (movingVector.length > movingSpeed) movingVector = movingVector.normalize(movingSpeed);
  } while (movingVector.isZero() && j < path.segments.length - 1);

  // If we have nothing to move
  if (j >= path.segments.length) return; // todo : path.remove() ?

  // Backup the position of the point so we can calculate the movement of the next
  var oldPrevPoint = new Point(path.segments[j].point);

  // Move the first point
  path.segments[j].point = path.segments[j].point + movingVector;

  // For each remaining point of the path
  for (var i = j + 1; i < path.segments.length; i++) {
    var prevSegment = path.segments[i - 1];
    var thisSegment = path.segments[i];

    var angle = (thisSegment.point - prevSegment.point).angle;
    var length = (thisSegment.point - oldPrevPoint).length;
    var vector = new Point({ angle: angle, length: length });

    oldPrevPoint = new Point(thisSegment.point);

    thisSegment.point = prevSegment.point + vector;
  }

  path.smooth();

}

/** TOOLS *************************************************************************************************************/

function getDrawingCanvas () {
  return paper.project.view._element;
}

/**
 * Returns the dataURL (Base64 encoded data url string)
 * of the specified canvas, but applies background color first
 * @param canvas
 * @param backgroundColor
 * @return {String} the dataURL
 */
function canvasToImage (canvas, backgroundColor) {
  // cache height and width
  var w = canvas.width;
  var h = canvas.height;
  var context = canvas.getContext("2d");
  var data;

  if (backgroundColor) {
    // get the current ImageData for the canvas.
    data = context.getImageData(0, 0, w, h);
    // store the current globalCompositeOperation
    var compositeOperation = context.globalCompositeOperation;
    // set to draw behind current content
    context.globalCompositeOperation = "destination-over";
    // set background color
    context.fillStyle = backgroundColor;
    // draw background / rect on entire canvas
    context.fillRect(0, 0, w, h);
  }

  // get the image data from the canvas
  var imageData = canvas.toDataURL("image/png");

  if (backgroundColor) {
    // clear the canvas
    context.clearRect(0, 0, w, h);
    // restore it with original / cached ImageData
    context.putImageData(data, 0, 0);
    // reset the globalCompositeOperation to what it was
    context.globalCompositeOperation = compositeOperation;
  }

  return imageData;
}
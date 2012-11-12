var Doodle = {};

//// CONFIGURATION AND GLOBAL VARS /////////////////////////////////////////////////////////////////////////////////////

var minDistBetweenPoints = 7;
var movingSpeedFor1000   = 50;
var minMovingSpeed       = 17;

var drawnPath;
var drawnPaths = [];

//// UTILS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the dataURL (Base64 encoded data url string)
 * of the specified canvas, but applies background color first
 * @param canvas
 * @param backgroundColor
 * @return {String} the dataURL
 */
Doodle.canvasToImage = function (canvas, backgroundColor) {
  var w = canvas.width;
  var h = canvas.height;
  var context = canvas.getContext("2d");
  var canvasData;

  if (backgroundColor) {
    // get the current ImageData for the canvas.
    canvasData = context.getImageData(0, 0, w, h);
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
    context.putImageData(canvasData, 0, 0);
    // reset the globalCompositeOperation to what it was
    context.globalCompositeOperation = compositeOperation;
  }

  return imageData;
};


//// UGLY-ASS TWEAKS ///////////////////////////////////////////////////////////////////////////////////////////////////

// Chrome, linux (maybe others?), the crosshair is sometimes replaced by a text-select
// The page has virtually no selectable content, so we remove selection altogether
document.onselectstart = function () { return false; };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//// NOTIFICATIONS /////////////////////////////////////////////////////////////////////////////////////////////////////

var notifs;
var defaultNotifOptions = {
  classes: ['notification', 'animatedSmooth'],
  classShow: 'bounceInDown',
  classHide: 'bounceOutUp',
  speaker:   'neo',
  animationDuration: 1600,
  onCreate: function(){
    // add timeout : 13s
    (function(){ if (this) this.fireEvent('click'); }).delay(13000, this);
  },
  onClick: function(){
    // remove the notif
    this.manager.remove(this);
    // get the focus back to the canvas
    document.id('doodleDrawingCanvas').focus();
  }
};

window.addEvent('load', function(){

  notifs = new NotificationsManager('notifications', {notification: defaultNotifOptions});
  (function(){
    notif('Hello there !<br /><strong>Click and drag</strong> anywhere on the screen to draw a doodle.', {});
  }).delay(666);

});

function notif (message, options) {
  options = Object.merge(defaultNotifOptions, options);
  if (notifs) notifs.add(message, options);
  else log ('Notification failed', message, options);
}



//// DOM CONTROL FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Refreshes the framerate under AG for testing
 * @param delta event.delta
 */
var refreshFramerate = function(delta){};

window.addEvent('domready', function(){

  refreshFramerate = function (delta) {
    document.id ('framerate').set('text', delta ? (1/delta).toInt() : 0);
  }

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/** TOOLS *************************************************************************************************************/

function getDrawingCanvas () {
  paper = Doodle.drawingPaperScope;
  return paper.project.view._element;
}

function getHoldingCanvas () {
  paper = Doodle.holdingPaperScope;
  return paper.project.view._element;
}

/**
 * Add the provided path to the holder
 * @param path
 */
var addPathToHolder = function (path) {
  paper = Doodle.holdingPaperScope;
  return paper.addPathToHolder(path);
};

/**
 * Redraw the holder.
 * This is not good. How ?
 */
var drawHolder = function () {
  paper = Doodle.holdingPaperScope;
  paper.view.draw();
};




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLinkSend (doodleId) {
  return 'doodle/send/' + doodleId;
}

function getLinkDownAsImage (doodleId) {
  return 'doodle/download/' + doodleId;
}

function getLinkViewAsImage (doodleId) {
  return 'doodle/view/' + doodleId;
}


/** CONTROL LOGIC *****************************************************************************************************/

function undo () {
  var p = drawnPaths.pop();
  p.remove();
  updateControls('undo', {});
  drawHolder();
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
        notif(responseJSON.error);
      }
    },
    onFailure: function () {
      log('Fail ! Sorry.');
      notif('Something went terribly wrong. Try again later?', {speaker: 'hulk'});
    }
  });

  var dataURL = Doodle.canvasToImage(getHoldingCanvas(), '#000');

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
        notif(responseJSON.error);
      }
    },
    onFailure: function () {
      log('Fail ! Sorry.');
      notif('Something went terribly wrong. Try again later?', {speaker: 'hulk'});
    }
  });

  sendRequest.send(Object.toQueryString(data));

}




/** CONTROLS **********************************************************************************************************/

function updateControls (from, options) {
  var buttonSave = document.id('buttonSave');
  var buttonUndo = document.id('buttonUndo');
  var buttonSend = document.id('buttonSend');
  var buttonView = document.id('buttonView');
  var buttonDown = document.id('buttonDown');
  var formSend = document.id('formSend');

  // Show / Hide Save & Undo
  if ('save' != from && 'send' != from && drawnPaths.length) {
    buttonSave.removeClass('hiddenSmall');
    buttonUndo.removeClass('hiddenSmall');
  } else {
    buttonSave.addClass('hiddenSmall');
    buttonUndo.addClass('hiddenSmall');
  }

  // Show / Hide Download & Send & View
  if ('save' == from && options.doodleId) {
    buttonSend.setAttribute('href', getLinkSend(options.doodleId));
    buttonSend.setAttribute('doodleId', options.doodleId);
    buttonSend.removeClass('hiddenSmall');
    buttonView.setAttribute('href', getLinkViewAsImage(options.doodleId));
    buttonView.removeClass('hiddenSmall');
    buttonDown.setAttribute('href', getLinkDownAsImage(options.doodleId));
    buttonDown.removeClass('hiddenSmall');
    notif('<b>Your doodle has been saved.</b><br />' +
          'You can send it to me along with a message, ' +
          'view the image in a new tab ' +
          'or simply download it as a png image.', {once: false, speaker: 'samurai'});
  }

  if ('draw' == from) {
    if (drawnPaths.length == 1) {
      notif('Good job ! Have fun !<br /><small>(and with you may be the force !)</small>', {clear: true, speaker: 'yoda'});
    } else if (drawnPaths.length == 6) {
      notif('<b>KEYBOARD ENABLED !</b><br />You can hit <b>[Z]</b> to <b>undo</b> your last draw.', {speaker: 'rabbit'});
    } else if (drawnPaths.length == 16) {
      notif('The page may be a bit sluggish.<br />It is expected, as this is a performance experiment.<br /><small>(no atom was hurt in the making of this webpage)</small>', {speaker: 'geiger'});
    } else if (drawnPaths.length == 32) {
      notif("Just hit <b>[C]</b> for Free Cake™ !", {speaker: 'devil'});
    } else if (drawnPaths.length == 100) {
      notif("Waow, that's a big doodle you're drawing there !<br />I hope you'll save that !", {speaker: 'hulk'});
    } else if (drawnPaths.length == 256) {
      notif("<b>~ ACHIEVEMENT UNLOCKED ~</b><br /><em>Web Doodle Artist</em>", {speaker: 'wizard'});
    }
    // Hide control buttons
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
  notif("Well done, and thank you!");
}
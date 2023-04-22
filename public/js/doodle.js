const Doodle = {};

//// CONFIGURATION AND GLOBAL VARS /////////////////////////////////////////////////////////////////////////////////////

const minDistBetweenPoints = 7;
const movingSpeedFor1000 = 50;
const minMovingSpeed = 17;
const baseSimplificationStrength = 13;

const drawnPaths = [];

//// UTILS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the dataURL (Base64 encoded data url string)
 * of the specified canvas, but applies background color first
 * @param canvas
 * @param backgroundColor
 * @return {String} the dataURL
 */
Doodle.canvasToImage = (canvas, backgroundColor) => {
    const w = canvas.width;
    const h = canvas.height;
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
        // Notification stays for 13s and then GTFO
        (function(){ if (this) this.fireEvent('click'); }).delay(13000, this);
    },
    onClick: function(){
        // Remove the notif
        this.manager.remove(this);
        // Get the focus back to the canvas
        document.id('doodleDrawingCanvas').focus();
    }
};
/*
window.addEvent('load', function(){

    notifs = new NotificationsManager('notifications', {notification: defaultNotifOptions});
    (function(){
        notif('Hello there !<br /><strong>Click and drag</strong> anywhere on the screen to draw a doodle.', {
            onCreate: function(){} // the first notification stays on-screen
        });
    }).delay(666);

});
*/

function notif (message, options) {
    options = Object.merge({}, defaultNotifOptions, options);
    if (notifs) notifs.add(message, options);
    else console.error('Notification failed', message, options);
}



//// DOM CONTROL FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Refreshes the framerate under AG for testing
 * @param delta event.delta
 */
var refreshFramerate = function(delta){};
/*
window.addEvent('domready', function(){
    refreshFramerate = function (delta) {
        document.id('framerate').set('text', delta ? (1/delta).toInt() : 0);
    }
});
*/

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
    const p = drawnPaths.pop();
    p.remove();
    updateControls('undo', {});
    drawHolder();
}


function save () {

    const saveRequest = new Request.JSON({
        url: 'drawings',
        method: 'post',
        onRequest: function () {
            console.info('Saving Doodle…');
        },
        onSuccess: function (responseJSON, responseText) {
            console.info('Success !', responseText);
            if (responseJSON.status === 'ok') {
                updateControls('save', {doodleId: responseJSON.id});
                //document.location.href = 'doodle/view/' + responseJSON.id;
            } else if (responseJSON.status === 'error') {
                notif(responseJSON.error);
            }
        },
        onFailure: function () {
            console.error('Failure!  Sorry.');
            notif('Something went terribly wrong. Try again later?', {speaker: 'hulk'});
        }
    });

    const dataURL = Doodle.canvasToImage(getHoldingCanvas(), '#000');

    const img = document.createElement('img');
    img.setAttribute('src', dataURL);

    saveRequest.send(Object.toQueryString({
        dataURL: dataURL
    }));

}

/*
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
*/


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("send-drawing-form");
    form.addEventListener("submit", (e) => {
        const doodleInput = document.getElementById("send-drawing-image");
        const dataURL = Doodle.canvasToImage(getHoldingCanvas(), '#000');
        doodleInput.value = dataURL;
        console.log("Image data url", dataURL);
    });
});


/** CONTROLS **********************************************************************************************************/


function updateControls (from, options) {
    /*
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
        } else if (drawnPaths.length == 2) {
            notif('This is not an usual contact page, <br /> but you know what they say... <br /> <em>An image is worth a thousand words.</em>', {clear: true, speaker: 'wizard'});
        } else if (drawnPaths.length == 3) {
            notif('<em>Enlightenment does matter.</em><br />Think about it. Einstein did !', {clear: true, speaker: 'idea'});
        } else if (drawnPaths.length == 5) {
            notif('<b>KEYBOARD ENABLED !</b><br />You can hit <b><kbd>[Z]</kbd></b> to <b>undo</b> your last draw.', {clear: true, speaker: 'rabbit'});
        } else if (drawnPaths.length == 8) {
            notif('The page may be a bit sluggish.<br />It is expected, as this is a performance experiment.<br /><small>(a few atoms were hurt in the making of this webpage)</small>', {speaker: 'geiger'});
        } else if (drawnPaths.length == 13) {
            notif("Just hold <b><kbd>[C]</kbd></b> for Free Cake™ !", {speaker: 'devil'});
        } else if (drawnPaths.length == 21) {
            notif("You can browse the source of this website <br /> by clicking on the github ribbon over there →", {speaker: 'penguins'});
        } else if (drawnPaths.length == 34) {
            notif("I highly recommend that you visit the <a href=\"https://www.khanacademy.org\" target=\"_blank\">Khan Academy</a>.<br />My dream is to teach there some day.", {speaker: 'vishnu'});
        } else if (drawnPaths.length == 55) {
            notif("<strong><code>666 999 = 666 x 999 + 666 + 999</code></strong><br />Upside down, this is still true !", {speaker: 'devil'});
        } else if (drawnPaths.length == 89) {
            notif("Waow, that's a big doodle you're drawing there !<br />I hope you'll save that !", {speaker: 'hulk'});
        } else if (drawnPaths.length == 144) {
            notif("Did you notice that the notifications' frequency <br /> followed the Fibonacci sequence ? <br /> Bet you didn't !", {speaker: 'neo'});
        } else if (drawnPaths.length == 233) {
            notif("<b>~ ACHIEVEMENT UNLOCKED ~</b><br /><em>Web Doodle Artist</em>", {speaker: 'wizard'});
        }
        // Hide control buttons
        buttonSend.addClass('hiddenSmall');
        buttonView.addClass('hiddenSmall');
        buttonDown.addClass('hiddenSmall');
        formSend.addClass('hiddenSmall');
    }

    if ('send' == from) {
        document.id('formSend').addClass('hiddenSmall');
        if (!options.title && !options.message) {
            notif("Did you just send me an empty message ?<br />Bah, I got the drawing, it's better than nothing !", {speaker: 'hulk'});
        } else {
            notif("Well done, and thank you!");
        }
    }

    */
}

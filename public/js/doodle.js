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
    let context = canvas.getContext("2d");
    let canvasData;
    let compositeOperation;

    if (backgroundColor) {
        // get the current ImageData for the canvas.
        canvasData = context.getImageData(0, 0, w, h);
        // store the current globalCompositeOperation
        compositeOperation = context.globalCompositeOperation;
        // set to draw behind current content
        context.globalCompositeOperation = "destination-over";
        // set background color
        context.fillStyle = backgroundColor;
        // draw background / rect on entire canvas
        context.fillRect(0, 0, w, h);
    }

    // get the image data from the canvas
    let imageData = canvas.toDataURL("image/png");

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
document.onselectstart = () => { return false; };


//// NOTIFICATIONS /////////////////////////////////////////////////////////////////////////////////////////////////////

class Notifications {
    static defaultOptions = {
        classes: ['notification'],
        classShow: 'backInDown',
        classHide: 'backOutUp',
        speaker:   'neo', // public/img/speaker/<speaker>.png
        animationInDuration: 1000,
        animationOutDuration: 750,
        onShow: (that) => {
            // Notification stays for 13s and then GTFO
            setTimeout((() => { if (that) that.hide(); }), 13000);
        },
        onClick: () => {
            // Get the focus back to the canvas
            //document.getElementById('doodleDrawingCanvas').focus();
        }
    }

    constructor(holder) {
        this.holder = holder;
        this.pastNotifications = [];
    }

    add(message, options={}) {
        const notificationOptions = {
            ...Notifications.defaultOptions,
            ...options,
        }
        if (options.clear) {
            this.pastNotifications.forEach((n) => {
                n.hide();
            });
            setTimeout(() => {
                notificationOptions.clear = false;
                this.add(message, notificationOptions);
            }, notificationOptions.animationOutDuration + 100);
        } else {
            const n = new Notification(message, notificationOptions);
            this.pastNotifications.push(n);
            this.holder.append(n.element);
            n.show();
        }
    }
}

class Notification {
    constructor(message, options) {
        this.message = message;
        this.options = options;
        this._buildDom();
    }

    _buildDom() {
        this.element = document.createElement("div");
        this.element.classList.add(...this.options.classes)

        const speaker = document.createElement("img");
        speaker.src = "img/speaker/"+this.options.speaker+".png";
        speaker.classList.add("speaker");
        this.element.append(speaker);

        const paragraph = document.createElement("p");
        paragraph.innerHTML = this.message;
        this.element.append(paragraph);

        paragraph.addEventListener("click", (e) => {
            this.hide();
        });
    }

    show() {
        this.element.classList.add(this.options.classShow);
        this.options.onShow(this);
    }

    hide() {
        this.element.classList.remove(this.options.classShow);
        this.element.classList.add(this.options.classHide);
        setTimeout(
            () => {
                this.element.remove();
            }, this.options.animationOutDuration - 100
        );
    }
}


let notifs;
document.addEventListener("DOMContentLoaded", () => {
    const notificationsHolder = document.getElementById("notifications");
    notifs = new Notifications(notificationsHolder);
    setTimeout(
        () => {
            notif('Hello there !<br /><strong>Click and drag</strong> anywhere on the screen to draw a doodle.', {
                onShow: function(that){} // the first notification stays on-screen
            });
        }, 666
    );
});


function notif (message, options) {
    if (notifs) notifs.add(message, options);
    else console.error('Notification failed', message, options);
}



//// FRAMERATE /////////////////////////////////////////////////////////////////////////////////////////////////////////

class RollingValue {
    constructor(historySize=60, defaultValue=0.0) {
        this.historySize = historySize;
        this.history = Array(historySize).fill(defaultValue);
        this.currentIndex = 0;
        console.assert(this.historySize > 0);
    }

    addValue(value) {
        this.history[this.currentIndex] = value;
        this.currentIndex = (this.currentIndex + 1) % this.historySize;
        return this;
    }

    getMean() {
        return this.history.reduce((previousValue, currentValue) => previousValue + currentValue) / this.historySize;
    }
}

const framerateBuffer = new RollingValue(30, 0.016);

/**
 * Refreshes the framerate under AG for benchmarking
 * @param delta event.delta
 */
let refreshFramerate = function(delta){};

document.addEventListener("DOMContentLoaded", () => {
    refreshFramerate = function (delta) {
        framerateBuffer.addValue(delta);
        if (framerateBuffer.currentIndex === 0) {  // only update twice per second (expensive!)
            document.getElementById('framerate').textContent =
                "fps = "
                +
                (delta ? Math.round(1.0/framerateBuffer.getMean()) : 0).toString()
            ;
        }
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



document.addEventListener("DOMContentLoaded", () => {
    const nojsEls = document.getElementsByClassName("nojs");
    Array.from(nojsEls).forEach((el) => {
        el.remove();
    });
});

/** TOOLS *************************************************************************************************************/

function getDrawingCanvas () {
    return Doodle.drawingPaperScope.project.view._element;
}
function getDrawingCanvasDomElement () {
    return document.getElementById("doodleDrawingCanvas");
}

function getHoldingCanvas () {
    paper = Doodle.holdingPaperScope;
    return paper.project.view._element;
}

/**
 * Add the provided path to the holder
 * @param path
 */
const addPathToHolder = function (path) {
    paper = Doodle.holdingPaperScope;
    return paper.addPathToHolder(path);
};

/**
 * Redraw the holder.
 * This is not good. How ?
 */
const drawHolder = function () {
    paper = Doodle.holdingPaperScope;
    paper.view.draw();
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
function getLinkSend (doodleId) {
    return 'doodle/send/' + doodleId;
}

function getLinkDownAsImage (doodleId) {
    return 'doodle/download/' + doodleId;
}

function getLinkViewAsImage (doodleId) {
    return 'doodle/view/' + doodleId;
}
*/


/** CONTROL LOGIC *****************************************************************************************************/

function undo () {
    const p = drawnPaths.pop();
    p.remove();
    updateControls('undo', {});
    drawHolder();
}

function save() {
    const dataURL = Doodle.canvasToImage(getHoldingCanvas(), '#000');
    downloadBase64File(dataURL, "doodle.png");
}

function downloadBase64File(dataUrl, fileName) {
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = fileName;
    downloadLink.click();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("send-drawing-form");
    form.addEventListener("submit", (e) => {
        const doodleInput = document.getElementById("send-drawing-image");
        const dataURL = Doodle.canvasToImage(getHoldingCanvas(), '#000');
        doodleInput.value = dataURL;
        console.log("Doodle data url", dataURL);
    });
});


/** CONTROLS **********************************************************************************************************/

document.addEventListener("DOMContentLoaded", () => {

    getDrawingCanvasDomElement().addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            undo();
        }
    });

    const undoButton = document.getElementById("control-undo");
    undoButton.addEventListener("click", (e) => {
        undo();
    });

    const saveButton = document.getElementById("control-save");
    saveButton.addEventListener("click", (e) => {
        save();
    });

    updateControls("init");
});

function updateControls (from, options) {

    // Show / Hide Undo
    const undoButton = document.getElementById("control-undo");
    const saveButton = document.getElementById("control-save");
    if ('save' !== from && 'send' !== from && drawnPaths.length) {
        undoButton.classList.remove('hidden');
        saveButton.classList.remove('hidden');
    } else {
        undoButton.classList.add('hidden');
        saveButton.classList.add('hidden');
    }

    // Inexpensive notification chain
    if ('draw' === from) {
        if (drawnPaths.length === 1) {
            notif('Good job ! Have fun !<br /><small>(and with you may be the fork)</small>', {clear: true, speaker: 'yoda'});
        } else if (drawnPaths.length === 2) {
            notif('This is not an usual contact page, <br /> but you know what they say... <br /> <em>An image is worth a thousand words.</em>', {clear: false, speaker: 'wizard'});
        } else if (drawnPaths.length === 3) {
            notif("Like most things I do, this website is <em>libre software</em>.<br />You can browse its <a href=\"https://github.com/Goutte/antoine.goutenoir.com\" target='\"_blank\"'>source code</a>.", {clear: false, speaker: 'penguins'});
        } else if (drawnPaths.length === 5) {
            notif('<strong>KEYBOARD ENABLED !</strong><br />You can hit <b><kbd>[CTRL]+[Z]</kbd></b> to <strong>undo</strong> your last draw.', {clear: false, speaker: 'rabbit'});
        } else if (drawnPaths.length === 8) {
            notif('The page may be a bit sluggish.<br />It is expected, as this is a performance experiment.<br /><small>(a few atoms were hurt in the making of this webpage)</small>', {clear: false, speaker: 'geiger'});
        } else if (drawnPaths.length === 13) {
            notif("Just hold <strong><kbd>[$]</kbd></strong> for Free Cake™ !<br /><small>(no undo, no refunds)</small>", {clear: true, speaker: 'devil'});
        } else if (drawnPaths.length === 21) {
            notif('<em>Enlightenment does matter.</em>', {clear: false, speaker: 'idea'});
        } else if (drawnPaths.length === 34) {
            notif("I highly recommend that you visit the <a href=\"https://www.khanacademy.org\" target=\"_blank\">Khan Academy</a>.<br />It is the kind of school I dreamt of as a kid.", {speaker: 'vishnu'});
        } else if (drawnPaths.length === 55) {
            notif("<strong><code>666 999 = 666 x 999 + 666 + 999</code></strong><br />Upside down, this is still true !", {speaker: 'devil'});
        } else if (drawnPaths.length === 89) {
            notif("Waow, that's a big doodle you're drawing there !<br />I hope you'll save that !", {speaker: 'hulk'});
        } else if (drawnPaths.length === 144) {
            notif("Did you notice that the notifications' frequency <br /> followed the Fibonacci sequence ? <br /> <em title=\"Congratulations to Gaëlle, who figured it out !\">Bet you didn't !</em>", {speaker: 'neo'});
        } else if (drawnPaths.length === 233) {
            notif("<b>~ ACHIEVEMENT UNLOCKED ~</b><br /><em>Web Doodle Artist</em>", {speaker: 'wizard'});
        } else if (drawnPaths.length === 377) {
            notif("<strong>Congratulations</strong>, you reached the end of the notifications, with <code>377</code> strokes.", {speaker: 'penguins'});
        }
    }

}

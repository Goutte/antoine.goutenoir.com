
/** INIT **************************************************************************************************************/

// Remember: This is paperscript, not ECMA6.   No fancy things like let or => functions

// Currently drawn path, the only path on this rendering layer.
var drawnPath;

/** TOOLS LISTENERS ***************************************************************************************************/

const drawingTool = new Tool();

drawingTool.minDistance = minDistBetweenPoints;

drawingTool.onMouseDown = function (event) {
    // If we produced a path before, deselect it:
    if (drawnPath) {
        //drawnPath.selected = false;
        drawingTool.onMouseUp(event);
    } else {
        // Create a new path
        drawnPath = new Path();
        drawnPath.add(event.point);
        drawnPath.selected = false;
        drawnPath.strokeColor = 'white';
    }

};

// While the user drags the mouse or the finger, points are added to the path
// at the position of the mouse or the finger:
drawingTool.onMouseDrag = function (event) {

    // Chrome on android sometimes fire this listener with a event.point in the exact center of the view
    // I cannot find the origin of the bug (for now), so we cancel any event pointed to the exact center
    if (getDrawingCanvas().width === 2 * event.point.x && getDrawingCanvas().height === 2 * event.point.y) return;

    // Add the new point to the path
    drawnPath.add(event.point);

};

// When the mouse is released, we simplify the path:
drawingTool.onMouseUp = function (event) {
    const segmentCount = drawnPath.segments.length;

    // When the mouse is released, simplify it:
    drawnPath.simplify(baseSimplificationStrength);

    // If it is a point, make it so
    if (segmentCount === 1) {
        drawnPath.remove();
        drawnPath = new Path.Circle(drawnPath.segments[0]._point, 1);
        drawnPath.strokeWidth = 2;
        drawnPath.strokeColor = 'white';
    } else {
        drawnPath.strokeWidth = 2;
    }

    const drawnPathCopy = addPathToHolder(drawnPath);
    drawnPath.remove();
    drawnPath = null;
    drawnPaths.push(drawnPathCopy);

    updateControls('draw');
};


drawingTool.onKeyDown = function (event) {
    if (event.key === 'z') {
        undo();
    }
};

drawingTool.activate();



/** VIEW ONFRAME ******************************************************************************************************/

function onFrame (event) {
    // Debug framerate
    //refreshFramerate(event.delta);
    // Evil `C` keyboard shortcut that screws up the drawing
    if (Key.isDown('c')) {
        movePathsTowardsSave();
        drawHolder();
    }
}



/** DOM BEHAVIORS *****************************************************************************************************/
/*
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
        }
//    'mousedown': function (event) { this.addClass('selected'); },
//    'mouseup':   function (event) { this.removeClass('selected'); }
    });

    buttonUndo.addEvents({
        'click': function (event) {
            event = new Event(event); event.stop();
            undo();
        }
//    'mousedown': function (event) { this.addClass('selected'); },
//    'mouseup':   function (event) { this.removeClass('selected'); }
    });

    buttonSend.addEvent('click', function (event) {
        event = new Event(event);
        event.stop();
        formSend.removeClass('hiddenSmall');
    });

    formSend.addEvents({
        'submit': function (event) {
            event.stop();
            var formData = this.toQueryString().parseQueryString();
            // Send the stuff back to base
            send(Object.merge({id: buttonSend.getAttribute('doodleId')}, formData));
        },
        // compatibility with paper's onKeyDown
        'keydown': function (event) { event.stopPropagation(); },
        'keyup':   function (event) { event.stopPropagation(); }
    });


});
*/

/** ANIMATION STEPS ***************************************************************************************************/

function movePathsTowardsSave () {
    const toX = view.size.width;
    const toY = view.size.height;
    const to = new Point(toX, toY);

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

    // If we have nothing to move for this path
    if (j >= path.segments.length)  {
        path.remove();
        drawnPaths.splice(drawnPaths.indexOf(path), 1);
        updateControls();
        return;
    }

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


Doodle.drawingPaperScope = paper;

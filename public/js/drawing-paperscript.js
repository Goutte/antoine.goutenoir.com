// noinspection ES6ConvertVarToLetConst

// Remember: This is paperscript, not ES6.   No fancy things like let or => functions

/** INIT **************************************************************************************************************/

// Currently drawn "ghost" path, the only path on this rendering layer.
var drawnPath;

/** TOOLS LISTENERS ***************************************************************************************************/

const drawingTool = new Tool();

drawingTool.minDistance = minDistBetweenPoints;

drawingTool.onMouseDown = function (event) {
    if (drawnPath) {
        // Handle case where we got multiple mouse downs and no mouse up,
        // such as when the user leaves the window while dragging.
        drawingTool.onMouseUp(event);
    } else {
        // Create a new path
        drawnPath = new Path();
        drawnPath.add(event.point);
        drawnPath.selected = false;
        drawnPath.strokeColor = Doodle.strokeColor;
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
    drawnPath.simplify(Doodle.strokeSimplificationStrength);

    // If it is a point, make it so
    if (segmentCount === 1) {
        drawnPath.remove();
        drawnPath = new Path.Circle(drawnPath.segments[0]._point, Doodle.strokeWidth / 3.0);
        drawnPath.strokeWidth = Doodle.strokeWidth;
        drawnPath.strokeColor = Doodle.strokeColor;
    } else {
        drawnPath.strokeWidth = Doodle.strokeWidth;
        drawnPath.strokeColor = Doodle.strokeColor;
    }

    const drawnPathCopy = addPathToHolder(drawnPath);
    drawnPath.remove();
    drawnPath = null;
    drawnPaths.push(drawnPathCopy);

    invalidateSnapshot(); // design choice here, not sure
    updateControls('draw');
};

/*
// "Official" PaperJs way of handling keys, but …
// CONTROL key is unavailable here ; we handle undo in doodle.js
drawingTool.onKeyDown = function (event) {
    if (event.key === 'z') {
        //console.log(event);
    }
};
*/

drawingTool.activate();



/** VIEW ONFRAME ******************************************************************************************************/

var framesHoldingDollar = 0;

function onFrame (event) {
    // Evil `$` keyboard shortcut that screws up the drawing
    if (Key.isDown('$')) {
        if (framesHoldingDollar === 0) {
            if (! hasSnapshot()) {
                makeSnapshot();
            }
        }

        wobblePaths();
        //movePathsTowardsSave(); // very destructive, although neat
        drawHolder();

        framesHoldingDollar++;
    } else {
        framesHoldingDollar = 0;
    }

    // Debug framerate, record the delay between frames
    recordFramerate(event.delta);
}


/** ANIMATION STEPS ***************************************************************************************************/

function wobblePaths () {
    for (var i = 0; i < drawnPaths.length; i++) {
        wobblePath(drawnPaths[i], 1.0);
    }
}

function wobblePath (path, speed) {
    const coeff = (360.0 / 60.0);
    for (var i = 0, len = path.segments.length; i < len; i++) {
        var segment = path.segments[i];
        if (segment.handleIn) {
            segment.handleIn.angle += speed * coeff;
        }
        if (segment.handleOut) {
            segment.handleOut.angle -= speed * coeff;
        }
    }
}

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
        if (movingVector.length > movingSpeed) {
            movingVector = movingVector.normalize(movingSpeed);
        }
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

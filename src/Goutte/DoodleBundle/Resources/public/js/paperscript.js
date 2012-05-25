var minDistBetweenPoints = 7;
var movingSpeed = 23;

var drawnPath;
var drawnPaths = new Array();


// Only execute onMouseDrag when the mouse has moved at least 7 points
//tool.distanceThreshold = 70; // not working !

//var textItem = new PointText(new Point(20, 55));
//textItem.fillColor = 'black';
//textItem.content = 'Click and drag to draw a line.';

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
}

function onFrame () {
  if (Key.isDown('s')) {
    movePathsTowardsSave();
  }
}

function onKeyDown (event) {
  if (event.key == 'z') {
    undo();
  }
}

function undo () {
  var p = drawnPaths.pop();
  p.remove();
}

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

  var j = -1;
  var movingVector;

  do {
    j++;
    movingVector = destinationPoint - path.segments[j].point;
    if (movingVector.length > movingSpeed) movingVector = movingVector.normalize(movingSpeed);
  } while (movingVector.isZero() && j < path.segments.length - 1);

  if (j >= path.segments.length) return; // nothing to move

  var oldPrevPoint = new Point(path.segments[j].point);

  path.segments[j].point = path.segments[j].point + movingVector;

  for (var i = j+1; i < path.segments.length; i++) {
    var prevSegment = path.segments[i - 1];
    var thisSegment = path.segments[i];

    var angle  = (thisSegment.point - prevSegment.point).angle;
    var length = (thisSegment.point - oldPrevPoint).length;
    var vector = new Point({ angle: angle, length: length });

    oldPrevPoint = new Point(thisSegment.point);

    thisSegment.point = prevSegment.point + vector;
  }

  path.smooth();

}
var minDistBetweenPoints = 7;

var drawnPath;
var drawnPaths = new Array();


// Only execute onMouseDrag when the mouse has moved at least 7 points
//tool.distanceThreshold = 70;

//var textItem = new PointText(new Point(20, 55));
//textItem.fillColor = 'black';
//textItem.content = 'Click and drag to draw a line.';

function onMouseDown (event) {
  // If we produced a path before, deselect it:
  if (drawnPath) {
    drawnPath.selected = false;
  }

  // Create a new path and set its stroke color to black:
  drawnPath = new Path();
  drawnPath.add(event.point);
  drawnPath.strokeColor = 'white';

  // Select the path, so we can see its segment points:
  //path.fullySelected = true;
}

// While the user drags the mouse or the finger, points are added to the path
// at the position of the mouse or the finger:
function onMouseDrag (event) {

  // Get the last point of the path
  var lastPoint = drawnPath.getLastSegment().getPoint();
  // Check if the new point is far away enough
  //var distBetweenPoints = Math.sqrt(Math.pow(event.point.x - lastPoint.getX(), 2) + Math.pow(event.point.y - lastPoint.getY(), 2));
  var distBetweenPoints = event.point.getDistance(lastPoint);

  if (distBetweenPoints > minDistBetweenPoints) {
    drawnPath.add(event.point);
  }

  //drawnPath.add(event.point);

//  log ('event.point',event.point);
//
//  Update the content of the text item to show how many
//  segments it has:
//  textItem.content = 'Segment count: ' + path.segments.length;


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


  // Select the path, so we can see its segments:
  //path.fullySelected = true;

//  var newSegmentCount = path.segments.length;
//  var difference = segmentCount - newSegmentCount;
//  var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);

  //textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';
}

function onKeyDown (event) {
  if (event.key == 'z') {
    undo();
  } else if (event.key == 's') {
    movePathsTowardsSave();
  }
}

function undo () {
  var p = drawnPaths.pop();
  p.remove();
}

function movePathsTowardsSave () {
  var toX = view.size.width;
  var toY = view.size.height;
  var to = new Point(toX, toY);

  var path = drawnPaths[0];

  movePathTowards(path, to);
}

function movePathTowards (path, point) {
  log('moving path', path, point.x, point.y);

  //path.getLastSegment().point = point;

  path.segments[0].point = path.segments[0].point + (new Point(10, 10));

  for (var i = 0; i < path.segments.length - 1; i++) {
    var thisSegment = path.segments[i];
    var nextSegment = path.segments[i + 1];

    var angle = (thisSegment.point - nextSegment.point).angle;
    var length = path.segments[i].curve.length;
    length = path.segments[i].point.getDistance(nextSegment.point) * 0.7;
    length = ( nextSegment.point - thisSegment.point).length * 0.7;
    length = 50;

    var vector = new Point({ angle: angle, length: length });
    nextSegment.point = thisSegment.point - vector;
  }
  path.smooth();

  //path.shear(point);

}
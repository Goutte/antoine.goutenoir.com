var minDistBetweenPoints = 7;

var path;
var paths = new Array();


//var textItem = new PointText(new Point(20, 55));
//textItem.fillColor = 'black';
//textItem.content = 'Click and drag to draw a line.';

function onMouseDown (event) {
  // If we produced a path before, deselect it:
  if (path) {
    path.selected = false;
  }

  // Create a new path and set its stroke color to black:
  path = new Path();
  path.add(event.point);
  path.strokeColor = 'white';

  // Select the path, so we can see its segment points:
  //path.fullySelected = true;
}

// While the user drags the mouse or the finger, points are added to the path
// at the position of the mouse or the finger:
function onMouseDrag (event) {

  // Get the last point of the path
  var lastPoint = path.getLastSegment().getPoint();
  // Check if the new point is far away enough
  var distBetweenPoints = Math.sqrt(Math.pow(event.point.x-lastPoint.getX(),2)+Math.pow(event.point.y-lastPoint.getY(),2));

  //log ("distance", distBetweenPoints);

  //log ('last segment',path.getLastSegment());

  if (distBetweenPoints > minDistBetweenPoints) {
    path.add(event.point);
  }

  //log ('event.point',event.point);

  // Update the content of the text item to show how many
  // segments it has:
  //textItem.content = 'Segment count: ' + path.segments.length;
}

// When the mouse is released, we simplify the path:
function onMouseUp (event) {
  var segmentCount = path.segments.length;

  // When the mouse is released, simplify it:
  path.simplify(13);

  // Add to the stack
  paths.push(path);


  // Select the path, so we can see its segments:
  //path.fullySelected = true;

//  var newSegmentCount = path.segments.length;
//  var difference = segmentCount - newSegmentCount;
//  var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);

  //textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';
}

function movePathsTowardsSave () {

}
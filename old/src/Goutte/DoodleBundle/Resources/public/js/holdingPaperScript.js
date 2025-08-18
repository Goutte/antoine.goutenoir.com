
// defined globally in doodle.js
Doodle.holdingPaperScope = paper;


Doodle.holdingPaperScope.addPathToHolder = function(path) {
  var pathCopy = new Path(path.segments);
  pathCopy.strokeColor = path.strokeColor;
  pathCopy.strokeWidth = path.strokeWidth;
  pathCopy.closed      = path.closed;

  view.draw();

  return pathCopy;
};



// snippet
//drawnPath = new Path();
//drawnPath.add(new Point.random() * view.size);
//drawnPath.add(new Point.random() * view.size);
//drawnPath.strokeColor = 'blue';
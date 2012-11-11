
// defined globally in doodle.js
Doodle.holderPaperScope = paper;


Doodle.holderPaperScope.addPathToHolder = function(path) {
  var pathCopy = new Path(path.segments); //path.segments
  pathCopy.strokeColor = path.strokeColor;
  pathCopy.strokeWidth = path.strokeWidth;
  pathCopy.closed      = path.closed;
//  pathCopy._parent = null;
  view.draw();

  return pathCopy;
};



// snippet
//drawnPath = new Path();
//drawnPath.add(new Point.random() * view.size);
//drawnPath.add(new Point.random() * view.size);
//drawnPath.strokeColor = 'blue';



//drawnPath = new Path();
//drawnPath.add(new Point.random() * view.size);
//drawnPath.add(new Point.random() * view.size);
//drawnPath.strokeColor = 'blue';

log ('scopeHolder',paper._id);

doodleHolderPaperScope = paper;

paper.addPathToHolder = function(path) {
  var pathCopy = new Path(path.segments); //path.segments
  pathCopy.strokeColor = path.strokeColor;
  pathCopy.strokeWidth = path.strokeWidth;
  view.draw();

  log ('addPathToHolder2', path, pathCopy);

  return pathCopy;
};
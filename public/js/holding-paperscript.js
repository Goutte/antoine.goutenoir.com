// noinspection ES6ConvertVarToLetConst

// Remember: This is paperscript, not ES6.   No fancy things like let or => functions


// defined globally in doodle.js
Doodle.holdingPaperScope = paper;


Doodle.holdingPaperScope.addPathToHolder = function(path) {
    const pathCopy = new Path(path.segments);
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
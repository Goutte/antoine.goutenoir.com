// noinspection ES6ConvertVarToLetConst

// Remember: This is paperscript, not ES6.   No fancy things like let or => functions


// Doodle is defined globally in doodle.js
// We need these shenanigans because of how paperscript works
Doodle.holdingPaperScope = paper;


Doodle.copyPath = function(path) {
    const pathCopy = new Path(path.segments);
    pathCopy.strokeColor = path.strokeColor;
    pathCopy.strokeWidth = path.strokeWidth;
    pathCopy.closed      = path.closed;

    return pathCopy;
};


Doodle.holdingPaperScope.addPathToHolder = function(path) {
    const pathCopy = Doodle.copyPath(path);

    view.draw();

    return pathCopy;
};

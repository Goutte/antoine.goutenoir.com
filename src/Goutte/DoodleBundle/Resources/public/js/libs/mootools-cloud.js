
//// ELEMENT . ADD/REMOVE MULTIPLE CLASSES /////////////////////////////////////////////////////////////////////////////

(function () {
  var _slice = Array.prototype.slice;

  Element.implement({
    /*
     adds 1+ classes to the element
     e.g. document.id('myEl').addClasses('one', 'two', 'three');
          document.id('myEl').addClasses(['one', 'two', 'three']);
     */
    addClasses: function () {
      var args, i, l;

      if (arguments.length == 1 && Array.isArray(arguments[0]))
        args = arguments[0];
      else
        args = _slice.call(arguments);

      l = args.length;

      for (i = 0; i < l; i++)
        if (!this.hasClass(args[i]))
          this.className = (this.className + ' ' + args[i]).clean();

      return this;
    },

    /*
     removes 1+ classes from the element
     e.g. document.id('myEl').removeClasses('one', 'two', 'three');
     */
    removeClasses: function () {
      this.className = this.className.replace(new RegExp('(^|\\s)(?:' + _slice.call(arguments).join('|') + ')(?:\\s|$)', 'g'), '$1');

      return this;
    }
  });
})();


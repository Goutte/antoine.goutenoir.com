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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var NotificationsManager = new Class({

  Implements: [Options, Chain, Events],

  options: {
    notification: {
      animationDuration: 1600,
      classShow: 'bounceInDown',
      classHide: 'bounceOutUp',
      clear:     false
    }
  },

  initialize: function (holder, options) {
    this.holder = document.id(holder);
    this.setOptions(options);
    this.stack = [];
  },

  add: function (message, options) {
    options = Object.merge(this.options.notification, options);
    if (options && true == options.clear) {
      this.clear();
      options.clear = false;
      this.add.delay(this.options.notification.animationDuration, this, [message, options]);
    } else {
      var n = new Notification(this, message, options);
      n.getElement().inject(this.holder);
      n.show();
      n.getElement().setStyle('visibility', 'visible');
      this.stack.push(n);
    }
  },

  remove: function (notification) {
    var i = this.stack.indexOf(notification);
    if (i != -1) {
      this.stack.splice(i,1);
      notification.hideAndDestroy();
    }
  },

  clear: function () {
    var n;
    while (n = this.stack.pop()) {
      n.hideAndDestroy();
    }
  }

});

var Notification = new Class({

  Implements: [Options, Chain, Events],

  options: {
    classes: ['notification', 'animatedSmooth'],
    classShow: 'bounceInDown',
    classHide: 'bounceOutUp',
    animationDuration: 1600,
    onClick: function(){
      this.manager.remove(this);
    }
  },

  initialize: function (manager, message, options) {
    this.manager = manager;
    this.message = message;
    this.setOptions(options);
  },

  _createDOM: function () {
    this.element = new Element('div');
    this.element.addClasses(this.options.classes);
    var p = new Element('p');
    p.set('html', this.message);
    p.inject(this.element);

    this.element.addEvents ({
      'click': function(){this.fireEvent('click')}.bind(this)
    });

    return this.element;
  },

  getElement: function () {
    return this.element ? this.element : this._createDOM();
  },

  show: function () {
    this.getElement().removeClass(this.options.classShow).addClass(this.options.classShow);
  },

  hide: function () {
    this.getElement().removeClass(this.options.classHide).addClass(this.options.classHide);
  },

  hideAndDestroy: function () {
    this.hide();
    (function(){
      this.element.destroy();
    }).delay(this.options.animationDuration, this);
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var notifs;

window.addEvent('load', function(){

  notifs = new NotificationsManager('notifications');
  (function(){
    notifs.add('Hello there !<br />Click and drag anywhere on the screen to draw a doodle.', {});
  }).delay(1000);


});

function notif (message, options) {
  if (notifs) notifs.add(message, options);
  else log ('notification failed', message, options);
}



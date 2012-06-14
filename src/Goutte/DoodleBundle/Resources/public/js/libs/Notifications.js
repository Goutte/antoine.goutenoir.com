
var NotificationsManager = new Class({

  Implements: [Options, Chain, Events],

  options: {
    notification: {
      // any Notification option, plus
      clear: false
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
    classes:  ['notification'],
    classShow: 'animateIn',
    classHide: 'animateOut',
    animationDuration: 1500,
    onClick: function(){ /*this.manager.remove(this);*/ }
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

    this.fireEvent('create');

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
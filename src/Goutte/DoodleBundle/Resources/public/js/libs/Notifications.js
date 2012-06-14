// Notifications and their manager

var NotificationsManager = new Class({

  Implements: [Options, Chain, Events],

  options: {
    notification: {
      // any Notification option, plus
      animationDuration: 1500, // needed here
      clear: false,
      once:  true
    }
  },

  initialize: function (holder, options) {
    this.holder = document.id(holder);
    this.setOptions(options);
    this.currentStack = [];
    this.archiveStack = [];
  },

  add: function (message, options) {
    options = Object.merge(this.options.notification, options);

    if (true == options.once && this.hasShown(message, options)) {
      return false;
    } else if (true == options.clear) {
      this.clear();
      options.clear = false;
      return this.add.delay(this.options.notification.animationDuration, this, [message, options]);
    } else {
      var n = new Notification(this, message, options);
      n.getElement().inject(this.holder);
      n.show();
      n.getElement().setStyle('visibility', 'visible');
      this.currentStack.push(n);
      this.archiveStack.push(n);
      return true;
    }
  },

  remove: function (notification) {
    var i = this.currentStack.indexOf(notification);
    if (i != -1) {
      this.currentStack.splice(i,1);
      notification.hideAndDestroy();
    }
  },

  clear: function () {
    var n;
    while (n = this.currentStack.pop()) {
      n.hideAndDestroy();
    }
  },

  hasShown: function (message, options) {
    var has = false; var n;
    var i = 0;
    while (false == has && i < this.archiveStack.length) {
      if (this.archiveStack[i].message == message)  {
        has = true;
      }
      i++;
    }
    return has;
  }

});

var Notification = new Class({

  Implements: [Options, Chain, Events],

  options: {
    classes:  ['notification'],
    classShow: 'animateIn',
    classHide: 'animateOut',
    animationDuration: 1500,
    onClick:  function(){ /*this.manager.remove(this);*/ },
    onCreate: function(){}
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



var NotificationsManager = new Class({

  Implements: [Options, Chain, Events],

  options: {
    animationDuration: 1600
  },

  initialize: function (holder, options) {
    this.holder = document.id(holder);
    this.setOptions(options);
    this.stack = [];
  },

  add: function (message, options) {
    if (options && true == options.clear) {
      this.clear();
      options.clear = false;
      this.add.delay(this.options.animationDuration, this, [message, options]);
    } else {
      var n = new Notification(message, options);
      n.getElement().inject(this.holder);
      n.show();
      n.getElement().setStyle('visibility', 'visible');
      this.stack.push(n);
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
    class: 'notification',
    classShow: 'bounceInDown',
    classHide: 'bounceOutUp',
    animationDuration: 1600,
    onClick: function(){
      this.hideAndDestroy();
    }
  },

  initialize: function (message, options) {
    this.message = message;
    this.setOptions(options);
  },

  _createDOM: function () {
    this.element = new Element('div');
    this.element.addClass(this.options.class).addClass('animatedSmooth');
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


var notifs;

window.addEvent('load', function(){

  //log ('domready paper', paper);
  notifs = new NotificationsManager('notifications');
  notifs.add('Hello there !<br />Click and drag anywhere on the screen to draw a doodle.', {});

});

function notif (message, options) {
  if (notifs) notifs.add(message, options);
  else log ('notification failed', message, options);
}



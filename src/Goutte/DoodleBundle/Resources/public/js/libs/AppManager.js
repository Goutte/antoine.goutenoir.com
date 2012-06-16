var AppManager = new Class({

  Implements: [Options, Events],

  options: {
    onCreate: function () {}
  },

  initialize: function (options) {
    this.controls = {};
    this.setOptions(options);
  },

  addControl: function (controlName, control) {
    this.controls[controlName] = control;
  },

  enableControl: function (controlName) {

  }

});


var Control = new Class({

  Implements: [Options, Events],

  options: {
    onCreate: function () {},
    onEnable: function () {},
    onDisable: function () {},
    onActivate: function () {}
  },

  initialize: function (options) {
    this.setOptions(options);
    this.fireEvent('create');
  },

  setDisabled: function (state) {
    log('IMPLEMENT SOMETHING HERE')
  },

  enable: function () {
    this.setDisabled(false);
    this.fireEvent('enable');
  },

  disable: function () {
    this.setDisabled(false);
    this.fireEvent('disable');
  }

});

var DomControl = new Class({

  Extends: Control,

  options: {
    eventsToBind: [],
    onEnable: function () {},
    onDisable: function () {}
  },

  initialize: function (element, options) {
    this.setOptions(options);
    this.element = document.id(element);
    var i;
    for (i in this.options.eventsToBind) {
      var eventShort = this.options.eventsToBind[i];
      var eventLong = 'on' + eventShort.capitalize();
      this.element.addEvent(eventShort, this.options[eventLong].bind(this));
    }
    this.fireEvent('create');
  },

  setDisabled: function (state) {
    if (state) this.element.setProperty('disabled', 'disabled');
    else       this.element.removeProperty('disabled');
  }

});


var ButtonControl = new Class({

  Extends: DomControl,

  options: {
    eventsToBind: ['click'],
    onClick: function (event) {
      this.fireEvent('activate')
    }
  },

  initialize: function (button, options) {
    parent(button, options);
  }

});
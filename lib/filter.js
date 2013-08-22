var Filter = function(options) {
  this.options = options || {};
  this._filters = [];
}

Filter.prototype.on = function(type, optionsOrCallback, callback) {
  var filterType = Filter.types[type];
  if (!filterType) {
    throw("Unknown filter type %s", type);
    return;
  }

  var options = optionsOrCallback;
  if (typeof optionsOrCallback == "function") {
    options = {};
    callback = optionsOrCallback;
  }
  var filter = new filterType(options, callback);
  filter.id = this._filters.length;
  this._filters.push(filter);
  return this;
}

Filter.prototype._filterFrame = function(frame) {
  var filter;
  for (var i = 0; i < this._filters.length; i++) {
    filter = this._filters[i];
    filter.process(frame);
  }
}

Filter.prototype.drinkFromFirehose = function(controller) {
  var that = this;
  controller.loop(function(frame) { that._filterFrame(frame) })
}

// what types go to what filter objects
// exposed publicly so that you can add additional types
Filter.types = {
  gesture: require('./filter/gesture.js'),
  hold: require('./filter/hold.js')
}

module.exports = Filter;
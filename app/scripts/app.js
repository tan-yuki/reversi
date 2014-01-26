/* jshint ignore:start */

/**
 * @module App
 */
var App = {};

App.mediator = _.extend({}, Backbone.Events);

App.alert = function(msg) {
    alert(msg);
};
/* jshint ignore:end */

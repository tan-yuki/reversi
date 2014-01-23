/* global App */

(function() {
    'use strict';

    App.CPUStrategy = {};

    App.CPUStrategy.StrategyModel = Backbone.Model.extend({

        initialize: function(options) {
            this.collection = options.collection;
        },

        putReversi: function(color) {
            throw 'Not implements _putReversi';
        }
    });
})();

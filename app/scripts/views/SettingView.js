/* global App */

(function() {
    'use strict';

    App.SettingView = Backbone.View.extend({
        el: '#settings',

        cpu: null,

        initialize: function(options) {
            this.cpu = options.cpu;
            _.bindAll(this, 'changeLevel');
        },

        events: {
            'click input[name=level]': 'changeLevel'
        },

        changeLevel: function(e) {
            var level = this.$(e.target).val();
            this.cpu.setLevel(level);
        }
    });
})();

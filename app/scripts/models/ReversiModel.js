/* global App */

(function() {
    'use strict';

    var black = 'black',
        white = 'white',
        none  = 'none';

    App.ReversiModel = Backbone.Model.extend({
        initialize: function() {
            this.set('color', none, {slient: true});
        },

        getColor: function() {
            return this.get('color');
        },

        setColor: function(color) {
            if (color === this.get('color')) return true;
            if (App.ReversiModel.validColorCode(color)) {
                this.set('color', color);
                return true;
            }
            return false;
        },

        hasColor: function() {
            return this.get('color') !== none;
        }
    }, {
        colorCode: {
            black: black,
            white: white,
            none:  none
        },
        validColorCode: function(color) {
            return _.indexOf(_.values(this.colorCode), color) > -1;
        }
    });
})();

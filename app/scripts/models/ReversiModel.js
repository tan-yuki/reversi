/* global App */

(function() {
    'use strict';

    var black = 'black',
        white = 'white',
        none  = 'none';

    App.ReversiModel = Backbone.Model.extend({
        cell: null,

        initialize: function(cell) {
            this.set('color', none, {slient: true});
            this.cell = cell;
        },

        getColor: function() {
            return this.get('color');
        },

        setColor: function(color) {
            if (color === this.get('color')) {
                return true;
            }

            if (App.ReversiModel.validColor(color)) {
                this.set('color', color);
                return true;
            }
            return false;
        },

        hasColor: function(color) {
            if (color) {
                return this.get('color') === color;
            }
            return this.get('color') !== none;
        },

        toggle: function() {
            if (this.getColor() === black) {
                return this.setColor(white);
            }

            if (this.getColor() === white) {
                return this.setColor(black);
            }
        },

        hasDifferentColor: function(color) {
            if (color === white) {
                return this.get('color') === black;
            } else if (color === black) {
                return this.get('color') === white;
            }

            return false;
        }
    }, {
        colorCode: {
            black: black,
            white: white,
            none:  none
        },
        validColor: function(color) {
            return _.indexOf(_.values(this.colorCode), color) > -1;
        }
    });
})();

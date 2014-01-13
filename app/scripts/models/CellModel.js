/* global App */

(function() {
    'use strict';

    App.CellModel = Backbone.Model.extend({
        row: 0,

        col: 0,

        reversi: null,

        initialize: function(options) {
            options = _.extend({
                row: 0,
                col: 0,
            }, options);

            this.row = options.row;
            this.col = options.col;

            this.reversi = new App.ReversiModel();
        },

        putReversi: function(color) {
            this.reversi.setColor(color);
        },

        hasReversi: function() {
            return this.reversi.hasColor();
        },

        getPoint: function(toObj) {
            if (toObj) {
                return {row: this.row, col: this.col};
            }
            return [this.row, this.col];
        }
    });
})();

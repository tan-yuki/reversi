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
            return this.reversi.setColor(color);
        },

        hasReversi: function() {
            return this.reversi.hasColor();
        },

        getPoint: function(toObj) {
            if (toObj) {
                return {row: this.row, col: this.col};
            }
            return [this.row, this.col];
        },

        getColor: function() {
            return this.reversi.getColor();
        },

        enableToPut: function() {
            if (this.hasReversi()) {
                return false;
            }
        },

        getAroundCell: function() {
            var arounds = [],
                points = [
                    [this.row - 1, this.col - 1],
                    [this.row - 1, this.col    ],
                    [this.row - 1, this.col + 1],
                    [this.row    , this.col - 1],
                    [this.row    , this.col + 1],
                    [this.row + 1, this.col - 1],
                    [this.row + 1, this.col    ],
                    [this.row + 1, this.col + 1]
                ];

            // except minus point cell
            points = _.filter(points, function(p) {
                var row = p[0],
                    col = p[1];
                return row >= 0 && col >= 0;
            });

            _.each(points, _.bind(function(p) {
                arounds.push(this.collection.search(p[0], p[1]));
            }, this));
            return arounds;
        }
    });
})();

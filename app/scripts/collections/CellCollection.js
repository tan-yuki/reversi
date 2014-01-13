/* global App */

(function() {
    'use strict';

    var colorCode = App.ReversiModel.colorCode;

    App.CellCollection = Backbone.Collection.extend({
        model: App.CellModel,

        edge: 0,

        initialize: function(models, options) {
            this.edge = options.edge;
        },

        setInitialReversi: function() {
            var edge = this.edge;

            this.addReversi((edge / 2) - 1, (edge / 2) - 1, colorCode.black);
            this.addReversi((edge / 2) - 1, (edge / 2),     colorCode.white);
            this.addReversi((edge / 2),     (edge / 2) - 1, colorCode.white);
            this.addReversi((edge / 2),     (edge / 2),     colorCode.black);
        },

        /**
         * @param {Number} row Row number
         * @param {Number} col Column number.
         * @param {String} color Color code.
         */
        addReversi: function(row, col, color) {
            var cell = this.search(row, col);
            if (! cell || cell.hasReversi()) {
                return;
            }

            cell.putReversi(color);
        },

        /**
         * @param {Number} row Row number
         * @param {Number} col Column number
         * @return {Object} App.CellModel
         */
        search: function(row, col) {
            var models = this.filter(function(model) {
                return model.row === row && model.col === col;
            });

            if (models.length) return models[0];
            return null;
        }
    });
})();

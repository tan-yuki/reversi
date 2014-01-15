/* global App */

(function() {
    'use strict';

    var colorCode = App.ReversiModel.colorCode;

    App.CellCollection = Backbone.Collection.extend({
        model: App.CellModel,

        edge: 0,

        initialize: function(models, options) {
            var edge = this.edge = options.edge;
            models = [];
            for (var i = 0; i < edge; i++) {
                for (var j = 0; j < edge; j++) {
                    models.push(new App.CellModel({
                        row: i,
                        col: j
                    }));
                 }
            }
            this.reset(models, _.extend({silent: true}, options));
            this.setInitialReversi();
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
                return false;
            }

            return cell.putReversi(color);
        },

        /**
         * Search cell
         *
         * @param {Number} row Row number
         * @param {Number} col Column number
         * 
         * @return {Object} App.CellModel
         */
        search: function(row, col) {
            var models = this.filter(function(model) {
                return model.row === row && model.col === col;
            });

            if (models.length) return models[0];
            return null;
        },

        /**
         * Get cells which reversi is put
         *
         * @param {Number} row Row number
         * @param {Number} col Column number
         * 
         * @return {Object} App.CellModel
         */
        getCellsWithReversi: function() {
            return this.filter(function(model) {
                return model.hasReversi();
            });
        }
    });
})();

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
         * Add reversi.
         * オセロを置くときのvalidation、
         * オセロの裏返しは行わない.
         * 
         * @param {Number} row Row number
         * @param {Number} col Column number.
         * @param {String} color Color code.
         */
        addReversi: function(row, col, color) {
            var cell = this.search(row, col);
            if (! cell) {
                return false;
            }

            return cell.putReversi(color, {
                validation: false,
                reverse: false,
            });
        },

        /**
         * Return true if there is no cell to put reversi.
         * 
         * @return {Boolean}
         */
        isFullReversi: function() {
            return this.countReversies() === this.edge * this.edge;
        },

        /**
         * Return true if there is only one color.
         * 
         * @return {Boolean}
         */
        isOnlyColor: function() {
            return this.isOnly(colorCode.black) || this.isOnly(colorCode.white);
        },

        /**
         * Return true if there is only one color.
         * 
         * @param {String} color
         * @return {Boolean}
         */
        isOnly: function(color) {
            return this.countReversies(color) === this.countReversies();
        },

        /**
         * Put reversi.
         * 
         * @param {Number} row Row number
         * @param {Number} col Column number.
         * @param {String} color Color code.
         */
        putReversi: function(row, col) {
            var cell = this.search(row, col);
            if (! cell) {
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

            if (models.length) {
                return models[0];
            }
            return null;
        },

        /**
         * Get cells which has reversi
         *
         * @method getCellsReversi
         * @return {Array} The list of App.CellModel
         */
        getCellsPuttingReversi: function() {
            return this.filter(function(model) {
                return model.hasReversi();
            });
        },

        /**
         * Get reversies which is put on the board
         * 
         * @method getReversies
         * @param {String} [color]
         * @return {Array} The list of App.ReversiModel
         */
        getReversies: function(color) {
            var cells = this.getCellsPuttingReversi();
            var reversies = _.map(cells, function(c) {
                return c.reversi;
            });

            if (!color) {
                return reversies;
            }

            return _.filter(reversies, function(r) {
                return r.getColor() === color;
            });
        },

        /**
         * Count reversies
         * 
         * @method countReversies
         * @param {String} [color]
         * @return {Integer} The count of reversies
         */
        countReversies: function(color) {
            return this.getReversies(color).length;
        },

        /**
         * Return cells on which we can put reversi.
         * 
         * @method getCandidates
         * @param {String} color
         * @return {Array} List of App.CellModel
         */
        getCandidates: function(color) {
            return this.filter(function(cell) {
                return cell.canPutReversi(color);
            });
        },

        /**
         * Return the count of cells on which we can put reversi.
         * 
         * @method countCandidates
         * @param {String} color
         * @return {Array} List of App.CellModel
         */
        countCandidates: function(color) {
            return this.getCandidates(color).length;
        }

    });
})();

/* global App */

(function() {
    'use strict';

    var colorCode = App.ReversiModel.colorCode;

    /**
     * @namespace App
     * @class CellCollection
     * @extends Backbone.Collection
     */
    App.CellCollection = Backbone.Collection.extend({

        /**
         * @property model
         * @type App.CellModel
         */
        model: App.CellModel,

        /**
         * The count of edge cells.
         * 
         * @property edge
         * @type Integer
         * @default 0
         */
        edge: 0,

        /**
         * @constructor
         */
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
        },

        /**
         * Set initialize revesies.
         * @method setInitializeReversi
         */
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
         * @method addReversi
         * @param {Integer} row Row index. 
         * @param {Integer} col Column index.
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
         * Put reversi.
         * 
         * @method putReversi
         * @param {Number} row Row number
         * @param {Number} col Column number.
         * @param {String} color Color code.
         */
        putReversi: function(row, col, color) {
            var cell = this.search(row, col);
            if (! cell) {
                return false;
            }

            return cell.putReversi(color);
        },

        /**
         * Return true if there is no cell to put reversi.
         * 
         * @method isFullReversi
         * @return {Boolean}
         */
        isFullReversi: function() {
            return this.countReversies() === this.edge * this.edge;
        },

        /**
         * Return true if there is only one color.
         * 
         * @method isOnlyColor
         * @return {Boolean}
         */
        isOnlyColor: function() {
            return this.isOnly(colorCode.black) || this.isOnly(colorCode.white);
        },

        /**
         * Return true if there is only one color.
         * 
         * @method isOnly
         * @param {String} color
         * @return {Boolean}
         */
        isOnly: function(color) {
            return this.countReversies(color) === this.countReversies();
        },

        /**
         * Search cell
         *
         * @method search
         * 
         * @param {Integer} row Row index
         * @param {Integer} col Column index
         * 
         * @return {App.CellModel}
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
         * @method getCellsPuttingReversi
         * @param {String} [color] Color code
         * @return {Array}
         *   The list of {{#crossLink "App.CellModel"}}{{/crossLink}}
         */
        getCellsPuttingReversi: function(color) {
            return this.filter(function(model) {
                return model.hasReversi(color);
            });
        },

        /**
         * Get reversies which is put on the board
         * 
         * @method getReversies
         * @param {String} [color] The color code
         * @return {Array}
         *   The list of {{#crossLink "App.ReversiModel"}}{{/crossLink}}
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
         * Count reversies already put on the board.
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
         * @return {Array}
         *   The list of {{#crossLink "App.CellModel"}}{{/crossLink}}
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
         * @return {Integer} The number of candidates.
         */
        countCandidates: function(color) {
            return this.getCandidates(color).length;
        }

    });
})();

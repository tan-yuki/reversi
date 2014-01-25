/* global App */

(function() {
    'use strict';

    /**
     * @namespace App.CPUStrategy
     */
    App.CPUStrategy = {};

    /**
     * @private
     * @class Strategy
     */
    var Strategy = Backbone.Model.extend({

        /**
         * Cells that cpu can put.
         * The list of App.CellModel
         * 
         * @type Array
         * @property cells
         */
        cells: null,

        /**
         * @type String
         * @property color
         */
        color: null,

        /**
         * @type App.Collection.CellCollection
         * @property collection
         */
        collection: null,

        initialize: function(options) {
            this.cells = options.cells;
            this.color = options.color;
            this.collection = options.collection;
        },

        /**
         * Select cells according to strageties.
         *     
         *     var stragegy = new Strategy({
         *         cells: cells,
         *         color: color
         *     });
         *     var cell = strategy.select([
         *         strategy.mostReversable,
         *         strategy.edge
         *     ]);
         *     
         * @param {Array}
         *     The list fo Stragegy's function
         * 
         * @return {App.CellModel}
         */
        select: function(strategies) {
            if (!this.cells.length) {
                return null;
            }

            var cells = this.cells;
            if (_.isArray(strategies)) {
                for (var i = 0, len = strategies.length; i < len; i++) {

                    // Execute strategy
                    var s = strategies[i];
                    s = _.bind(s, {
                        cells:      cells,
                        color:      this.color,
                        collection: this.collection,
                    })();

                    // Get result
                    var newCells = s.cells;
                    if (!newCells.length) {
                        break;
                    }
                    cells = newCells;
                }
            }

            return _.selectAtRandom(cells);
        },

        /**
         * Choose cells which is not placed at edge.
         * 
         * @return {Strategy}
         *
         */
        notEdge: function() {
            this.cells = _.filter(this.cells, function(c) {
                return ! c.isEdge();
            });
            return this;
        },

        /**
         * Choose cells which is placed at edge.
         * 
         * @return {Strategy}
         */
        edge: function() {
            this.cells = _.filter(this.cells, function(c) {
                return c.isEdge();
            });
            return this;
        },

        /**
         * Choose cells which is placed at corner.
         * 
         * @return {Strategy}
         */
        corner: function() {
            this.cells = _.filter(this.cells, function(c) {
                return c.isCorner();
            });
            return this;
        },

        aroundCorner: function() {
            this.cells = _.filter(this.cells, function(c) {
                return c.isAroundCorner();
            });
            return this;
        },

        _createReversiMap: function() {
            var color = this.color;
            var map = {};
            _.each(this.cells, function(c) {
                var count = c.countReverse(color);
                if (!map[count]) {
                    map[count] = [];
                }
                map[count].push(c);
            });
            return map;
        },

        /**
         * Choose most reversiable cells
         * 
         * @return {Strategy}
         */
        mostReversable: function() {
            var map = this._createReversiMap();
            var index = _.max(_.keys(map));

            this.cells = map[index];
            return this;
        },

        /**
         * Choose most reversiable cells
         * 
         * @return {Strategy}
         */
        leastReversable: function() {
            var map = this._createReversiMap();
            var index = _.max(_.keys(map));

            this.cells = map[index];
            return this;
        },

        /**
         * Placed at diagonal corner
         * 
         * @return {Strategy}
         */
        starPosition: function() {
            this.cells =_.filter(this.cells, function(c) {
                return c.isStarPosition();
            });
            return this;
        }
    });

    /**
     * @class App.CPUStrategy.StrategyModel
     * @extends Backbone.Model
     */
    App.CPUStrategy.StrategyModel = Backbone.Model.extend({

        /**
         * @constructor
         * @param {Object} options
         *   @param {App.Collection.CellCollection} collection
         */
        initialize: function(options) {
            this.collection = options.collection;
        },

        /**
         * Select cell which CPU put reversi
         * 
         * @param {String} color
         *     The color code of CPU's reversi.
         * @param {Array} cells
         *     The list of App.CellModel
         *     which CPU can put reversi.
         * 
         * @return {App.CellModel}
         *     The cell CPU put reversi.
         */
        selectCell: function(color, cells) {
            throw 'Not implements selectCell';
        },

        /**
         * Put reversi
         * 
         * @param {String} color
         * @return {Boolean} Success or not
         */
        putReversi: function(color) {
            var cells = this.collection.getCandidates(color);
            if (!cells.length) {
                return false;
            }

            var cell = this.selectCell(color, cells);
            if (!cell) {
                return false;
            }
            return cell.putReversi(color);
        },


        /**
         * Create new stragety.
         *     
         *     var strategy = this.strategy;
         *     var cell = strategy.select([
         *         strategy.edge,
         *         strategy.mostReversable
         *     ]);
         *     
         * @param {String} color
         *     The color code of CPU's reversi.
         * @param {Array} cells
         *     The list of App.CellModel
         *     which CPU can put reversi.
         * @return {Strategy}
         */
        strategy: function(color, cells) {
            return new Strategy({
                collection: this.collection,
                cells: cells,
                color: color
            });
        }
    });
})();

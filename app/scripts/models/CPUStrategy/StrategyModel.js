/* global App */

(function() {
    'use strict';

    App.CPUStrategy = {};

    /**
     * This class can only create instance in
     * {{#crossLink "App.CPUStrategy.StrategyModel/strategy:method"}}{{/crossLink}}
     * 
     * @class Strategy
     * @extends Backbone.Model
     */
    var StrategyModel = Backbone.Model.extend({

        /**
         * Cells that cpu can put.
         * This is the list of {{#crossLink "App.CellModel"}}{{/crossLink}}
         * 
         * @type Array
         * @property cells
         */
        cells: null,

        /**
         * The reversi color.
         * 
         * @type String
         * @property color
         */
        color: null,

        /**
         * Cell Collections.
         * 
         * @type App.CellCollection
         * @property collection
         */
        collection: null,

        /**
         * @constructor
         * @param options Optional Data.
         *   @param options.cells {Array}
         *     This is array of {{#crossLink "App.CellModel"}}{{/crossLink}}
         * 
         *   @param options.color {String}
         *     This is array of {{#crossLink "App.CellModel"}}{{/crossLink}}
         * 
         *   @param options.collection {App.CellCollection}
         *     This is the collection of Cells.
         */
        initialize: function(options) {
            this.cells = options.cells;
            this.color = options.color;
            this.collection = options.collection;
        },

        /**
         * Select cells according to the strategies
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
         * @method select
         * @param {Array}
         *     The list of this strategy functions
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
                    s = _.bind(s, _.extend(this, {
                        cells: cells,
                    }))();

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
         * See {{#crossLink "App.CellModel/isEdge:method"}}
         * 
         * @method notEdge
         * @chainable
         */
        notEdge: function() {
            this.cells = _.filter(this.cells, function(c) {
                return ! c.isEdge();
            });
            return this;
        },

        /**
         * Choose cells which is placed at edge.
         * See {{#crossLink "App.CellModel/isEdge:method"}}
         * 
         * @method edge
         * @chainable
         */
        edge: function() {
            this.cells = _.filter(this.cells, function(c) {
                return c.isEdge();
            });
            return this;
        },

        /**
         * Choose cells which is placed at corner.
         * See {{#crossLink "App.CellModel/isCorner:method"}}
         * 
         * @method corner
         * @chainable
         */
        corner: function() {
            this.cells = _.filter(this.cells, function(c) {
                return c.isCorner();
            });
            return this;
        },

        /**
         * Choose cells which is placed around corner.
         * See {{#crossLink "App.CellModel/isAroundCorner:method"}}
         * 
         * @method aroundCorner
         * @chainable
         */
        aroundCorner: function() {
            this.cells = _.filter(this.cells, function(c) {
                return c.isAroundCorner();
            });
            return this;
        },

        /**
         * Create reversi map.
         * 
         * 以下の様なObjectを返す。
         * - key: オセロを裏返す数
         * - value: CellModelの配列
         * 
         * @private
         * @method aroundCorner
         * @return {Object}
         */
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
         * @method mostReversable
         * @chainable
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
         * @method leastReversable
         * @chainable
         */
        leastReversable: function() {
            var map = this._createReversiMap();
            var index = _.min(_.keys(map));

            this.cells = map[index];
            return this;
        },

        /**
         * Choose start position cell.
         * See {{#crossLink "App.CellModel/isStarPosition:method"}}
         * 
         * @method starPosition
         * @chainable
         */
        starPosition: function() {
            this.cells =_.filter(this.cells, function(c) {
                return c.isStarPosition();
            });
            return this;
        }
    });

    /**
     * @class StrategyModel
     * @namespace App.CPUStrategy
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
         * __caution__: This method should be implemented in the child class.
         * 
         * @method selectCell
         * @param {Array} cells
         *   The list of App.CellModel
         *   which CPU can put reversi.
         * @param {String} color
         *   The color code of CPU's reversi.
         * 
         * @return {App.CellModel}
         *   The cell CPU put reversi.
         */
        selectCell: function(cells, color) {
            throw 'Not implements selectCell';
        },

        /**
         * Put reversi
         * 
         * @method putReversi
         * @param {String} color
         * @return {Boolean} Success or not
         */
        putReversi: function(color) {
            var cells = this.collection.getCandidates(color);
            if (!cells.length) {
                return false;
            }

            var cell = this.selectCell(cells, color);
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
         *         strategy.mostReversable,
         *         strategy.edge
         *     ]);
         *     
         * See {{#crossLink "Strategy"}}{{/crossLink}}
         * 
         * @method stragegy
         * @param {Array} cells
         *   The list of App.CellModel
         *   which CPU can put reversi.
         * @param {String} color
         *   The color code of CPU's reversi.
         * @return {Strategy}
         */
        strategy: function(cells, color) {
            return new StrategyModel({
                collection: this.collection,
                cells: cells,
                color: color
            });
        }
    });
})();

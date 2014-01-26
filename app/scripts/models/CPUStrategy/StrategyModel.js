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
                    s = _.bind(s, _.extend({}, this, {
                        cells: cells,
                    }))();

                    // Get result
                    var newCells = s.cells;
                    if (!newCells.length) {
                        continue;
                    }
                    cells = newCells;
                }
            }

            return _.selectAtRandom(cells);
        },

        /**
         * Execute opposite strategy.
         *     
         *     var stragegy = new Strategy({
         *         cells: cells,
         *         color: color
         *     });
         *     // This cells don't contain edge cell.
         *     var cells = strategy.not(strategy.edge)().cells;
         *     var cells = strategy.not('edge')().cells;
         *     
         * @method not
         * @return {Function}
         */
        not: function(func) {
            if (_.isFunction(func)) {
            } else if (_.isString(func)) {
                func = this[func];
            }
            var self = _.extend({}, this, {
                filter: function(f) {
                    this.cells = _.reject(this.cells, f);
                    return this;
                }
            });
            return _.bind(func, self);
        },

        /**
         * Filter cells.
         * 
         * @private
         * @param {Function} func
         *   @param {App.CellModel}
         * @chainable
         */
        filter: function(func) {
            this.cells = _.filter(this.cells, func);
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
            return this.filter(function(c) {
                return c.isEdge();
            });
        },

        /**
         * Choose cells which is placed at corner.
         * See {{#crossLink "App.CellModel/isCorner:method"}}
         * 
         * @method corner
         * @chainable
         */
        corner: function() {
            return this.filter(function(c) {
                return c.isCorner();
            });
        },

        /**
         * Choose cells which is placed around corner.
         * See {{#crossLink "App.CellModel/isAroundCorner:method"}}
         * 
         * @method aroundCorner
         * @chainable
         */
        aroundCorner: function() {
            return this.filter(function(c) {
                return c.isAroundCorner();
            });
        },

        /**
         * Create reversi map.
         * 
         * 以下の様なObjectを返す。
         * - key: オセロを裏返す数
         * - value: CellModelの配列
         * 
         * @private
         * @method createReversiMap
         * @return {Object}
         */
        createReversiMap: function() {
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
            var map = this.createReversiMap();
            var maxCount = parseInt(_.max(_.keys(map)));
            var color = this.color;
            return this.filter(function(c) {
                return c.countReverse(color) === maxCount;
            });
        },

        /**
         * Choose most reversiable cells
         * 
         * @method leastReversable
         * @chainable
         */
        leastReversable: function() {
            var map = this.createReversiMap();
            var minCount = parseInt(_.min(_.keys(map)));
            var color = this.color;
            return this.filter(function(c) {
                return c.countReverse(color) === minCount;
            });
        },

        /**
         * Choose start position cell.
         * See {{#crossLink "App.CellModel/isStarPosition:method"}}
         * 
         * @method starPosition
         * @chainable
         */
        starPosition: function() {
            return this.filter(function(c) {
                return c.isStarPosition();
            });
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

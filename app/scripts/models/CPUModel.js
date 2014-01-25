/* global App */

(function() {
    'use strict';

    var CPUStrategy = App.CPUStrategy;

    /**
     * Levels for this CPU
     * 
     * @type Array
     */
    var levels = {
        easy  : 'easy',
        normal: 'normal',
        hard  : 'hard'
    };

    /**
     * @class App.CPUModel
     * @extends Backbone.Model
     */
    App.CPUModel = Backbone.Model.extend({

        /**
         * List of App.CPUStrategy.Strategy
         * 
         * @private
         * @type {Array}
         * @property strategies
         */
        strategies: null,

        /**
         * Current selected strategy.
         * 
         * @private
         * @type {App.CPUStrategy.Strategy}
         * @property strategy
         */
        strategy: null,


        defaults: function() {
            return {
                level: levels.easy
            };
        },

        validate: function(attrs, options) {
            if (_.indexOf(levels, attrs.level)) {
                return 'Invalid level: ' + attrs.level;
            }
        },

        /**
         * @constructor
         * @param {Object} options
         *   @param {App.Collection.CellCollection} collection
         */
        initialize: function(options) {
            var s = {},
                c = options.collection,
                l = levels;

            this.strategies = [];

            // set strategies
            this.strategies[l.easy]   = new CPUStrategy.EasyStrategyModel({collection: c});
            this.strategies[l.normal] = new CPUStrategy.NormalStrategyModel({collection: c});
            this.strategies[l.hard]   = new CPUStrategy.HardStrategyModel({collection: c});

            this.setLevel(options.level);
        },

        /**
         * Put CPU reversi
         * 
         * @method putReversi
         * @param {String} color
         */
        putReversi: function(color) {
            return this.getStrategy().putReversi(color);
        },

        /**
         * Set CPU level
         * 
         * @method setLevel
         * @param {String} level
         */
        setLevel: function(level) {
            this.set('level', level, {validate: true});
            this.strategy = this.strategies[level];
        },

        /**
         * Return CPU strategy
         * 
         * @private
         * @method getStrategy
         * @return {App.CPUStrategy.StrategyModel}
         */
        getStrategy: function() {
            if (!this.strategy) {
                this.setLevel(this.get('level'));
            }
            return this.strategy;
        }

    }, {
        levels: levels
    });
})();

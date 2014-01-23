/* global App */

(function() {
    'use strict';

    var CPUStrategy = App.CPUStrategy;

    // levels
    var levels = {
        easy  : 1,
        normal: 2,
        hard  : 3
    };

    /**
     * Flag whether CPU is taking action now.
     * @private
     * @type {Boolean}
     */
    var isAction = false;

    App.CPUModel = Backbone.Model.extend({

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
         * List of App.CPUStrategy.Strategy
         * @var {Array}
         */
        strategies: [],

        /**
         * @var {App.CPUStrategy.Strategy}
         */
        strategy: null,

        initialize: function(options) {
            var s = {},
                c = options.collection,
                l = levels;

            // set strategies
            s[l.easy]   = new CPUStrategy.EasyStrategyModel({collection: c});
            s[l.normal] = new CPUStrategy.NormalStrategyModel({collection: c});
            s[l.hard]   = new CPUStrategy.HardStrategyModel({collection: c});
            this.strategies = s;

            this.setLevel(options.level);
        },

        putReversi: function(color) {
            return this.getStrategy().putReversi(color);
        },

        setLevel: function(level) {
            this.set('level', level, {validate: true});
            this.strategy = this.strategies[level];
        },

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

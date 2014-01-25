/* global App */

(function() {
    'use strict';

    /**
     * @class App.CPUStrategy.StrategyModel
     * @extends Backbone.Model
     */
    App.CPUStrategy.EasyStrategyModel = App.CPUStrategy.StrategyModel.extend({

        selectCell: function(color, cells) {
            var collection = this.collection,
                edge = collection.edge;


            var strategy = this.strategy(color, cells);

            if (collection.countReversies() < (edge * edge / 4)) {
                strategy.mostReversable();
            } else {
                strategy.leastReversable();
            }

            return strategy.select([
                strategy.starPosition,
                strategy.aroundCorner,
                strategy.notEdge
            ]);
        }
    });
})();

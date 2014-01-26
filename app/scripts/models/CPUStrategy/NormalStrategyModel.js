/* global App */

(function() {
    'use strict';

    App.CPUStrategy.NormalStrategyModel = App.CPUStrategy.StrategyModel.extend({

        selectCell: function(cells, color) {
            var collection = this.collection,
                edge = collection.edge;


            var strategy = this.strategy(cells, color);

            var reversiCountStrategy;
            if (collection.countReversies() < (edge * edge * (3 / 5))) {
                reversiCountStrategy = strategy.leastReversable;
            } else {
                reversiCountStrategy = strategy.mostReversable;
            }

            return strategy.select([
                strategy.corner,
                strategy.not(strategy.starPosition),
                strategy.not(strategy.aroundCorner),
                strategy.edge,
                reversiCountStrategy
            ]);

        }
    });
})();

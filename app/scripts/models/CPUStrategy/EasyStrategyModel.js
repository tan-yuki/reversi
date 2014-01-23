/* global App */

(function() {
    'use strict';

    App.CPUStrategy.EasyStrategyModel = App.CPUStrategy.StrategyModel.extend({
        putReversi: function(color) {
            // Get cells on which we can put by this color.
            var cells = this.collection.getPutableReversiCells(color);
            if (!cells.length) {
                return false;
            }

            /*
             * key: Reverse count
             * value: The list of cell
             */
            var map = {};
            _.each(cells, function(c) {
                var count = c.countReverse(color);
                if (!map[count]) {
                    map[count] = [];
                }
                map[count].push(c);
            });

            // Select least reverse cell.
            var minCount = _.min(_.keys(map));
            var minReverseCells = map[minCount];

            // select at ramdom.
            var cell = minReverseCells[_.random(0, minReverseCells.length - 1)];
            if (!cell.putReversi(color)) {
                console.log('Could not put cell (row, col) = ' +
                    '(' + cell.row + ', ' + cell.col + ')');
                return false;
            }
            return true;
        }
    });
})();

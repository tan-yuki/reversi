/* global App */

(function() {
    'use strict';

    App.CPUStrategy.NormalStrategyModel = App.CPUStrategy.StrategyModel.extend({

        selectCell: function(color, cells) {

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

            /*
             * 盤上においてあるオセロの数が
             *   - 半分以下の場合: 最もオセロが裏返せない位置に置く
             *   - 半分以上の場合: 最もオセロが裏返せる位置に置く
             */
            var index;
            if (collection.countReversies() < (edge * edge / 2)) {
                index = _.min(_.keys(map));
            } else {
                index = _.max(_.keys(map));
            }
            var cells = map[index];

            var maxCount = _.max(_.keys(map));
            var maxReverseCells = map[maxCount];

            // select at ramdom.
            return _.selectAtRandom(maxReverseCells);
        }
    });
})();

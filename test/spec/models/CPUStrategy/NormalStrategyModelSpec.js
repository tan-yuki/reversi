/* global describe, it */

(function () {
    'use strict';

    var collection;
    var normal;
    var colorCode = App.ReversiModel.colorCode;
    var black = colorCode.black;
    var white = colorCode.white;

    describe('App.CPUStrategy.NormalStrategyModel', function() {
        before(function() {
            collection = new App.CellCollection(false, {
                edge: 8
            });

            normal = new App.CPUStrategy.NormalStrategyModel({
                collection: collection
            });

            /*
             * Set up below borad,
             * then test it.
             * 
             * b = black
             * w = white
             * 
             *        1   2   3   4
             *     -----------------
             *  0   |   |   |   |   
             *     -----------------
             *  1   |   |   | w | b 
             *     -----------------
             *  2   |   | w |   |   
             *     -----------------
             *  3   |   | b | b | b 
             *     -----------------
             *  4   |   | w | w |   
             *     -----------------
             *  5   |   |   |   |   
             * 
             */
             collection.addReversi(2, 3, black);
             collection.addReversi(3, 3, black);
             collection.addReversi(4, 3, black);
             collection.addReversi(4, 1, black);

             collection.addReversi(2, 2, white);
             collection.addReversi(3, 1, white);
             collection.addReversi(2, 4, white);
             collection.addReversi(3, 4, white);
        });

        it('should not put cell on star position', function() {
            var cells = collection.getCandidates(black);
            var cell = normal.selectCell(cells, black);
            expect(cell.col).to.equals(5);
        });
    });
})();

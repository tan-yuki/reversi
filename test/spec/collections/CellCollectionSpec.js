/* global describe, it */

(function () {
    'use strict';

    /**
     * @type {App.CellCollection}
     */
    var collection;

    describe('CellCollection', function () {
        before(function() {
            collection = new App.CellCollection(false, {
                edge: 8
            });
        });

        describe('#setInitialReversi', function () {
            var initCells;

            before(function() {
                collection.setInitialReversi();
                initCells = [
                    collection.search(3, 3),
                    collection.search(3, 4),
                    collection.search(4, 3),
                    collection.search(4, 4)
                ];
            });

            it('should put 4 reversi', function () {
                expect(collection.getCellsWithReversi().length).to.equals(4);
            });

            it('should put at center on the board', function () {
                _.each(initCells, function(cell) {
                    expect(cell.hasReversi()).to.be.true;
                });
            });

            it('should put reversies to cross diagonally', function () {
                var c1 = initCells[0],
                    c2 = initCells[1],
                    c3 = initCells[2],
                    c4 = initCells[3];

                expect(c1.getColor()).to.equals(c4.getColor());
                expect(c2.getColor()).to.equals(c3.getColor());
                expect(c1.getColor()).not.to.equals(c2.getColor());
            });
        });
    });
})();

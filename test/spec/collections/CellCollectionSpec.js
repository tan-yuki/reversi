/* global describe, it */

(function () {
    'use strict';

    var createCellCollection = function() {
        return new App.CellCollection(false, {
            edge: 8
        });
    };

    describe('CellCollection', function () {
        describe('#setInitialReversi', function () {
            it('should put 4 reversi', function () {
                var collection = createCellCollection();
                collection.setInitialReversi();
                expect(collection.getCellsWithReversi().length).to.equals(4);
            });

            it('should put at center on the board', function () {
                var collection = createCellCollection();
                collection.setInitialReversi();

                var cell_1 = collection.search(3, 3);
                var cell_2 = collection.search(3, 4);
                var cell_3 = collection.search(4, 3);
                var cell_4 = collection.search(4, 4);

                expect(cell_1.hasReversi()).to.be.true;
                expect(cell_2.hasReversi()).to.be.true;
                expect(cell_3.hasReversi()).to.be.true;
                expect(cell_4.hasReversi()).to.be.true;
            });

            it('should put reversies to cross diagonally', function () {
                var collection = createCellCollection();
                collection.setInitialReversi();

                var cell_1 = collection.search(3, 3);
                var cell_2 = collection.search(3, 4);
                var cell_3 = collection.search(4, 3);
                var cell_4 = collection.search(4, 4);

                expect(cell_1.getColor()).to.equals(cell_4.getColor());
                expect(cell_2.getColor()).to.equals(cell_3.getColor());
                expect(cell_1.getColor()).not.to.equals(cell_2.getColor());
            });
        });
    });
})();

/* global describe, it */

(function () {
    'use strict';

    describe('CellModel', function () {
        var collection,
            colorCode = App.ReversiModel.colorCode,
            black = colorCode.black,
            white = colorCode.white;

        describe('#putReversi', function() {
            before(function() {
                // Initialize
                collection = new App.CellCollection(false, {
                    edge: 8
                });
                collection.setInitialReversi();
            });

            it('should return false if this cell has reversi already', function() {
                var cell = collection.search(3, 3);
                var oldCount = collection.countReversies();
                expect(cell.putReversi(black)).to.be.false;
                expect(collection.countReversies()).to.be.equals(oldCount);
            });

            it('should return false if there are no cells around this cell', function() {
                var cell = collection.search(1, 1);
                var oldCount = collection.countReversies();
                expect(cell.putReversi(black)).to.be.false;
                expect(collection.countReversies()).to.be.equals(oldCount);
            });

            it('should return false if there is no eversible reversi', function() {
                var cell = collection.search(3, 5);
                var oldCount = collection.countReversies();
                expect(cell.putReversi(white)).to.be.false;
                expect(collection.countReversies()).to.be.equals(oldCount);
            });

            it('should return true if there is eversible reversi', function() {
                var cell = collection.search(3, 5);
                var oldCount = collection.countReversies();
                expect(cell.putReversi(black)).to.be.true;
                expect(collection.countReversies()).to.be.equals(5);
                expect(collection.countReversies(black)).to.be.equals(4);
            });
        });
    });
})();

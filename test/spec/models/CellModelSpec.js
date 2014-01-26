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
                expect(cell.putReversi(black)).to.be.true;
                expect(collection.countReversies()).to.be.equals(5);
                expect(collection.countReversies(black)).to.be.equals(4);
            });
        });

        describe('#canPutReversi', function() {
            before(function() {
                // Initialize
                collection = new App.CellCollection(false, {
                    edge: 8
                });
                collection.setInitialReversi();
            });

            it('should return false if this cell has reversi already', function() {
                var cell = collection.search(3, 3);
                expect(cell.canPutReversi(black)).to.be.false;
            });

            it('should return false if there are no cells around this cell', function() {
                var cell = collection.search(1, 1);
                expect(cell.canPutReversi(black)).to.be.false;
            });

            it('should return false if there is no eversible reversi', function() {
                var cell = collection.search(3, 5);
                expect(cell.canPutReversi(white)).to.be.false;
            });

            it('should return true if there is eversible reversi', function() {
                var cell = collection.search(3, 5);
                expect(cell.canPutReversi(black)).to.be.true;
            });
        });

        describe('#isEdge', function() {
            before(function() {
                // Initialize
                collection = new App.CellCollection(false, {
                    edge: 8
                });
            });

            it('should return true if this cell is placed at edge', function() {
                expect(collection.search(0, 4).isEdge()).to.be.true;
                expect(collection.search(3, 7).isEdge()).to.be.true;
                expect(collection.search(7, 2).isEdge()).to.be.true;
                expect(collection.search(1, 0).isEdge()).to.be.true;
            });

            it('should return false if this cell is not placed at edge', function() {
                expect(collection.search(1, 2).isEdge()).to.be.false;
                expect(collection.search(3, 4).isEdge()).to.be.false;
            });
        });

        describe('#isCorner', function() {
            before(function() {
                // Initialize
                collection = new App.CellCollection(false, {
                    edge: 8
                });
            });

            it('should return true if this cell is placed at corner', function() {
                expect(collection.search(0, 0).isCorner()).to.be.true;
                expect(collection.search(0, 7).isCorner()).to.be.true;
                expect(collection.search(7, 0).isCorner()).to.be.true;
                expect(collection.search(7, 7).isCorner()).to.be.true;
            });

            it('should return false if this cell is not placed at corner', function() {
                expect(collection.search(1, 2).isCorner()).to.be.false;
                expect(collection.search(0, 5).isCorner()).to.be.false;
                expect(collection.search(7, 5).isCorner()).to.be.false;
                expect(collection.search(2, 0).isCorner()).to.be.false;
                expect(collection.search(2, 7).isCorner()).to.be.false;
            });
        });

        describe('#isStarPosition', function() {
            before(function() {
                // Initialize
                collection = new App.CellCollection(false, {
                    edge: 8
                });
            });

            it('should return true if this cell is placed at diagonal corner', function() {
                expect(collection.search(1, 1).isStarPosition()).to.be.true;
                expect(collection.search(1, 6).isStarPosition()).to.be.true;
                expect(collection.search(6, 1).isStarPosition()).to.be.true;
                expect(collection.search(6, 6).isStarPosition()).to.be.true;
            });

            it('should return false if this cell is not placed at diagonal corner', function() {
                expect(collection.search(0, 0).isStarPosition()).to.be.false;
                expect(collection.search(0, 1).isStarPosition()).to.be.false;
                expect(collection.search(5, 4).isStarPosition()).to.be.false;
                expect(collection.search(7, 6).isStarPosition()).to.be.false;
                expect(collection.search(7, 7).isStarPosition()).to.be.false;
            });
        });

        describe('#isAroundCorner', function() {
            before(function() {
                // Initialize
                collection = new App.CellCollection(false, {
                    edge: 8
                });
            });

            it('should return true if this cell is placed at around corner', function() {
                // top left corner
                expect(collection.search(1, 1).isAroundCorner()).to.be.true;
                expect(collection.search(0, 1).isAroundCorner()).to.be.true;
                expect(collection.search(1, 0).isAroundCorner()).to.be.true;

                // top right corner
                expect(collection.search(1, 6).isAroundCorner()).to.be.true;
                expect(collection.search(0, 6).isAroundCorner()).to.be.true;
                expect(collection.search(1, 7).isAroundCorner()).to.be.true;

                // bottom left corner
                expect(collection.search(6, 1).isAroundCorner()).to.be.true;
                expect(collection.search(6, 0).isAroundCorner()).to.be.true;
                expect(collection.search(7, 1).isAroundCorner()).to.be.true;

                // bottom right corner
                expect(collection.search(6, 6).isAroundCorner()).to.be.true;
                expect(collection.search(6, 7).isAroundCorner()).to.be.true;
                expect(collection.search(7, 6).isAroundCorner()).to.be.true;
            });

            it('should return false if this cell is not placed at around corner', function() {
                expect(collection.search(0, 0).isAroundCorner()).to.be.false;
                expect(collection.search(0, 7).isAroundCorner()).to.be.false;
                expect(collection.search(7, 0).isAroundCorner()).to.be.false;
                expect(collection.search(7, 7).isAroundCorner()).to.be.false;
                expect(collection.search(0, 2).isAroundCorner()).to.be.false;
                expect(collection.search(3, 2).isAroundCorner()).to.be.false;
            });
        });
    });
})();

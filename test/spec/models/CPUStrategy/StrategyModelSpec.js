/* global describe, it */

(function () {
    'use strict';

    var FakeStrategyModel = App.CPUStrategy.StrategyModel.extend({
        selectCell: function(cells, color) {
            return cells[0];
        }
    });

    /**
     * @type App.CellCollection
     */
    var collection;

    /**
     * @type FakeStrategyModel
     */
    var fakeStrategy;

    var colorCode = App.ReversiModel.colorCode,
        black = colorCode.black,
        white = colorCode.white;

    describe('CPUStrategy.StrategyModel', function () {
        before(function() {
            // Initialize
            collection = new App.CellCollection(false, {
                edge: 8
            });
            collection.setInitialReversi();

            fakeStrategy = new FakeStrategyModel({
                collection: collection
            });
        });

        describe('#putReversi', function() {

            it('should put one reversi', function() {
                var oldCount = collection.countReversies();
                fakeStrategy.putReversi(white);
                var newCount = collection.countReversies();
                expect(newCount - oldCount).to.equals(1);
            });

            it('should put reversi in candidate cells', function() {
                var candidates = collection.getCandidates(white);
                fakeStrategy.putReversi(white);
                var whiteCells = collection.getCellsPuttingReversi(white);

                var expectsToPut = candidates[0];
                var target = _.filter(whiteCells, function(c) {
                    return c.row === expectsToPut.row &&
                           c.col === expectsToPut.col;
                });
                expect(target).to.have.length(1);
            });
        });

        describe('#strategy', function() {

            describe('#edge', function() {
                var execEdgeStrategy = function(cells) {
                    return fakeStrategy
                        .strategy(cells, black)
                        .edge()
                        .cells;
                };

                it('should return only edge cells', function() {
                    var cells = [
                        collection.search(0, 4),
                        collection.search(5, 7),
                        collection.search(0, 7),
                        collection.search(5, 5)
                    ];
                    cells = execEdgeStrategy(cells);

                    expect(cells).to.have.length(3);
                    _.each(cells, function(c) {
                        var result = c.row === 0 || c.row === 7 ||
                                     c.col === 0 || c.col === 7;
                        expect(result).to.be.true;
                    });
                });
            });

            describe('#notEdge', function() {
                var execNotEdgeStrategy = function(cells) {
                    return fakeStrategy
                        .strategy(cells, black)
                        .notEdge()
                        .cells;
                };
                it('should return only center cells', function() {
                    var cells = [
                        collection.search(0, 4),
                        collection.search(5, 7),
                        collection.search(0, 7),
                        collection.search(5, 5)
                    ];
                    cells = execNotEdgeStrategy(cells);

                    expect(cells).to.have.length(1);

                    var target = cells[0];
                    expect(target.row).to.equals(5);
                    expect(target.col).to.equals(5);
                });
            });

            describe('#corner', function() {
                var execCornerStrategy = function(cells) {
                    return fakeStrategy
                        .strategy(cells, black)
                        .corner()
                        .cells;
                };
                it('should return only corner cells', function() {
                    var cells = [
                        collection.search(0, 4),
                        collection.search(5, 7),
                        collection.search(0, 7),
                        collection.search(5, 5)
                    ];
                    cells = execCornerStrategy(cells);

                    expect(cells).to.have.length(1);

                    var target = cells[0];
                    expect(target.row).to.equals(0);
                    expect(target.col).to.equals(7);
                });
            });

            describe('#aroundCorner', function() {
                var execCornerStrategy = function(cells) {
                    return fakeStrategy
                        .strategy(cells, black)
                        .aroundCorner()
                        .cells;
                };

                it('should return only around corner cells', function() {
                    var cells = [
                        collection.search(0, 4),
                        collection.search(5, 7),
                        collection.search(0, 7),
                        collection.search(6, 1),
                        collection.search(1, 0),
                        collection.search(5, 5)
                    ];
                    cells = execCornerStrategy(cells);

                    expect(cells).to.have.length(2);

                    cells = _.sortBy(cells, function(c) {
                        return c.row;
                    });
                    expect(cells[0].row).to.equals(1);
                    expect(cells[0].col).to.equals(0);

                    expect(cells[1].row).to.equals(6);
                    expect(cells[1].col).to.equals(1);
                });
            });

            describe('#starPosition', function() {
                var execStarPositionStrategy = function(cells) {
                    return fakeStrategy
                        .strategy(cells, black)
                        .starPosition()
                        .cells;
                };

                it('should return only star position cells', function() {
                    var cells = [
                        collection.search(0, 4),
                        collection.search(5, 7),
                        collection.search(0, 7),
                        collection.search(6, 1),
                        collection.search(1, 0),
                        collection.search(5, 5)
                    ];
                    cells = execStarPositionStrategy(cells);

                    expect(cells).to.have.length(1);

                    var target = cells[0];
                    expect(target.row).to.equals(6);
                    expect(target.col).to.equals(1);
                });
            });

            describe('reverse count strategy', function() {
                before(function() {
                    /*
                     * Set up below borad,
                     * then test it.
                     * 
                     * b = black
                     * w = white
                     * 
                     *       2   3   4
                     *     ---------------
                     *  0  |   |   |   |
                     *     ---------------
                     *  1  |   |   |   |
                     *     ---------------
                     *  2  |   | w | b |
                     *     ---------------
                     *  3  |   | w | b |
                     *     ---------------
                     *  4  |   | w | b |
                     *     ---------------
                     *  5  |   |   |   |
                     *     ---------------
                     * 
                     * In this situation, candidate black cells are:
                     *   (2, 1), (2, 2), (2, 3), (2, 4), (2, 5)
                     */
                    collection = new App.CellCollection(false, {
                        edge: 8
                    });
                    collection.addReversi(4, 2, black);
                    collection.addReversi(4, 3, black);
                    collection.addReversi(4, 4, black);

                    collection.addReversi(3, 2, white);
                    collection.addReversi(3, 3, white);
                    collection.addReversi(3, 4, white);
                });

                describe('#mostReversable', function() {
                    var execMostReversableStrategy = function(cells) {
                        return fakeStrategy
                            .strategy(cells, black)
                            .mostReversable()
                            .cells;
                    };


                    it('should filter cells flip the most of the reversi', function() {
                        var cells = collection.getCandidates(black);
                        cells = execMostReversableStrategy(cells);

                        expect(cells).to.have.length(2);

                        cells = _.sortBy(cells, function(c) {
                            return c.col;
                        });

                        expect(cells[0].row).to.equals(2);
                        expect(cells[0].col).to.equals(2);
                        expect(cells[1].row).to.equals(2);
                        expect(cells[1].col).to.equals(4);
                    });
                });

                describe('#leastReversable', function() {
                    var execLeastReversableStrategy = function(cells) {
                        return fakeStrategy
                            .strategy(cells, black)
                            .leastReversable()
                            .cells;
                    };

                    it('should filter cells flip the least of the reversi', function() {
                        var cells = collection.getCandidates(black);
                        cells = execLeastReversableStrategy(cells);

                        expect(cells).to.have.length(3);

                        cells = _.sortBy(cells, function(c) {
                            return c.col;
                        });

                        expect(cells[0].row).to.equals(2);
                        expect(cells[0].col).to.equals(1);
                        expect(cells[1].row).to.equals(2);
                        expect(cells[1].col).to.equals(3);
                        expect(cells[2].row).to.equals(2);
                        expect(cells[2].col).to.equals(5);
                    });
                });
            });

            describe('#select', function() {
                before(function() {
                    /*
                     * Set up below borad,
                     * then test it.
                     * 
                     * b = black
                     * w = white
                     * 
                     *       0   1   2
                     *     ---------------
                     *  0  |   |   |   |
                     *     ---------------
                     *  1  |   | w | b |
                     *     ---------------
                     *  2  |   | w | b |
                     *     ---------------
                     *  3  |   | w | b |
                     *     ---------------
                     *  4  |   |   | w |
                     *     ---------------
                     *  5  |   |   |   |
                     *     ---------------
                     * 
                     * In this situation, candidate black cells are:
                     *   (0, 1), (0, 2), (0, 3), (0, 4), (2, 4)
                     */
                    collection = new App.CellCollection(false, {
                        edge: 8
                    });
                    collection.addReversi(2, 1, black);
                    collection.addReversi(2, 2, black);
                    collection.addReversi(2, 3, black);

                    collection.addReversi(1, 1, white);
                    collection.addReversi(1, 2, white);
                    collection.addReversi(1, 3, white);
                    collection.addReversi(2, 4, white);
                });

                it('should set several strategies', function() {
                    var cells = collection.getCandidates(black);
                    var strategy = fakeStrategy.strategy(cells, black);
                    var cell = strategy.select([
                        strategy.leastReversable,
                        strategy.notEdge
                    ]);

                    expect(cell.row).to.equal(2);
                    expect(cell.col).to.equal(5);
                });
            });
        });
    });
})();

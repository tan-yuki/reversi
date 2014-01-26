/* global describe, it */

(function () {
    'use strict';

    /**
     * @type {App.CellCollection}
     */
    var collection;

    var colorCode = App.ReversiModel.colorCode,
        black = colorCode.black,
        white = colorCode.white;

    describe('CellCollection', function () {

        describe('#setInitialReversi', function () {
            var initCells;

            before(function() {
                collection = new App.CellCollection(false, {
                    edge: 8
                });
                collection.setInitialReversi();
                initCells = [
                    collection.search(3, 3),
                    collection.search(3, 4),
                    collection.search(4, 3),
                    collection.search(4, 4)
                ];
            });

            it('should put 4 reversi', function () {
                expect(collection.getCellsPuttingReversi()).to.have.length(4);
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

        describe('#getCandidates', function () {
            describe('when first placement of reversi,', function () {
                before(function() {
                    collection = new App.CellCollection(false, {
                        edge: 8
                    });
                    collection.setInitialReversi();
                });
                it('return 4 cells if you try to put black reversi', function () {
                    var cells = collection.getCandidates(black);
                    expect(cells).to.have.length(4);
                    _.each(cells, function(c) {
                        switch (c.row) {
                        case 2:
                            expect(c.col).to.equals(4);
                            break;
                        case 3:
                            expect(c.col).to.equals(5);
                            break;
                        case 4:
                            expect(c.col).to.equals(2);
                            break;
                        case 5:
                            expect(c.col).to.equals(3);
                            break;
                        default:
                            // failed
                            expect(true).to.be.false;
                        }
                    });
                });
                it('return 4 cells if you try to put white reversi', function () {
                    var cells = collection.getCandidates(white);
                    expect(cells).to.have.length(4);
                    _.each(cells, function(c) {
                        switch (c.row) {
                        case 2:
                            expect(c.col).to.equals(3);
                            break;
                        case 3:
                            expect(c.col).to.equals(2);
                            break;
                        case 4:
                            expect(c.col).to.equals(5);
                            break;
                        case 5:
                            expect(c.col).to.equals(4);
                            break;
                        default:
                            // failed
                            expect(true).to.be.false;
                        }
                    });
                });
            });
        });

        describe('#getCellsPuttingReversi', function () {
            describe('when first placement of reversi,', function () {
                before(function() {
                    collection = new App.CellCollection(false, {
                        edge: 8
                    });
                    collection.setInitialReversi();
                });
                it('should return 4 cells', function() {
                    expect(collection.getCellsPuttingReversi()).to.have.length(4);
                });
                it('should return list of App.CellModel', function() {
                    var cells = collection.getCellsPuttingReversi();
                    _.each(cells, function(c) {
                        expect(c).to.be.instanceof(App.CellModel);
                    });
                });
                it('should return cells placed reversi', function() {
                    var cells = collection.getCellsPuttingReversi();
                    _.each(cells, function(c) {
                        expect(c.hasReversi()).to.be.true;
                    });
                });
            });
            describe('when\n' +
                'black reversies placed on (3,4),(3,3),(4,2),(2,4),(3,5),(6,7), and\n' +
                'white reversies placed on (4,4),(5,6),(2,5),(4,7)', function() {

                var cells;

                before(function() {
                    collection = new App.CellCollection(false, {
                        edge: 8
                    });
                    collection.addReversi(3, 3, black);
                    collection.addReversi(4, 2, black);
                    collection.addReversi(2, 4, black);
                    collection.addReversi(3, 5, black);
                    collection.addReversi(6, 7, black);
                    collection.addReversi(3, 4, black);

                    collection.addReversi(4, 4, white);
                    collection.addReversi(5, 6, white);
                    collection.addReversi(2, 5, white);
                    collection.addReversi(4, 7, white);
                });

                describe('and not specified color,', function() {
                    var cells;
                    before(function() {
                        cells = collection.getCellsPuttingReversi();
                    });
                    it('should return 10 cells', function() {
                        expect(cells).to.have.length(10);
                    });
                    it('should return list of App.CellModel', function() {
                        _.each(cells, function(c) {
                            expect(c).to.be.instanceof(App.CellModel);
                        });
                    });
                    it('should return cells placed reversi', function() {
                        _.each(cells, function(c) {
                            expect(c.hasReversi()).to.be.true;
                        });
                    });
                });
                describe('and specified black color,', function() {
                    var cells;
                    before(function() {
                        cells = collection.getCellsPuttingReversi(black);
                    });
                    it('should return 6 cells', function() {
                        expect(cells).to.have.length(6);
                    });
                    it('should return cells putting black reversi', function() {
                        _.each(cells, function(c) {
                            expect(c.hasReversi(black)).to.be.true;
                        });
                    });
                    it('should contains (3,3) reversi', function() {
                        var targets = _.filter(cells, function(c) {
                            return c.row === 3 && c.col === 3;
                        });
                        expect(targets).to.have.length(1);
                    });
                });
                describe('and specified white color,', function() {
                    var cells;
                    before(function() {
                        cells = collection.getCellsPuttingReversi(white);
                    });
                    it('should return 4 cells', function() {
                        expect(cells).to.have.length(4);
                    });
                    it('should return cells putting white reversi', function() {
                        _.each(cells, function(c) {
                            expect(c.hasReversi(white)).to.be.true;
                        });
                    });
                    it('should contains (4,4) reversi', function() {
                        var targets = _.filter(cells, function(c) {
                            return c.row === 4 && c.col === 4;
                        });
                        expect(targets).to.have.length(1);
                    });
                });
            });
        });
    });
})();

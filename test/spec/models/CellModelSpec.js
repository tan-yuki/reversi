/* global describe, it */

(function () {
    'use strict';

    describe('CellModel', function () {
        var collection;

        before(function() {
            collection = new App.CellCollection(false, {
                edge: 8
            });
        });

        describe('#getAroundCell', function () {
            /**
             * App.CellModel
             */
            var cell;

            /**
             * array of App.CellModel
             */
            var arounds;

            describe('at center', function() {

                before(function() {
                    cell = collection.search(3, 3);
                    arounds = cell.getAroundCell();
                });

                it('should return the array of CellModel', function () {
                    expect(arounds).to.be.an('array');
                    expect(arounds.length).to.be.greaterThan(0);
                    _.each(arounds, function(cell) {
                        expect(cell).to.be.instanceof(App.CellModel);
                    });
                });

                it('should return 8 CellModels', function () {
                    expect(arounds).to.have.length(8);
                });

                it('should return CellModels which is adjacent this cell', function () {
                    _.each(arounds, function(c) {
                        expect(c.row === cell.row && c.col === cell.col).to.be.false;
                        expect(c.row -1 <= cell.row && cell.row <= c.row + 1).to.be.true;
                        expect(c.col -1 <= cell.col && cell.col <= c.col + 1).to.be.true;
                    });
                });

                it('should return CellModels which is unique', function () {
                    var points = [];
                    _.each(arounds, function(c) {
                        var point = {row: c.row, col: c.col};
                        _.each(points, function(p) {
                            expect(p.row === point.row && p.col === point.col).to.be.false;
                        });
                        points.push(point);
                    });
                });

                it('should return CellModels which belongs to CellCollection', function () {
                    _.each(arounds, function(c) {
                        expect(c.collection).to.be.instanceof(App.CellCollection);
                    });
                });
            });

            describe('at the edge', function() {

                before(function() {
                    cell = collection.search(0, 3);
                    arounds = cell.getAroundCell();
                });

                it('should return 5 CellModels', function () {
                    expect(arounds).to.have.length(5);
                });
            });

            describe('at the corner', function() {
                before(function() {
                    cell = collection.search(0, 0);
                    arounds = cell.getAroundCell();
                });

                it('should return 3 CellModels', function () {
                    expect(arounds).to.have.length(3);
                });
            });
        });
    });
})();

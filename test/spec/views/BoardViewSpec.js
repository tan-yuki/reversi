/* global describe, it */

(function () {
    'use strict';

    var boardView;
    var collection;
    var cpu;
    var colorCode = App.ReversiModel.colorCode;
    var black = colorCode.black;

    var oldAlert = App.alert;

    describe('BoardView', function () {
        before(function() {
            App.alert = function() {};
            cpu = new App.CPUModel({
                collection: this.collection
            });
            collection = new App.CellCollection(false, {
                edge: 8
            });
            collection.setInitialReversi();

            boardView = new App.BoardView({
                collection: collection,
                cpu: cpu
            });
            $('#workspace').append(boardView.render().$el);
        });
        after(function() {
            $('#workspace').empty();

            App.alert = oldAlert;
        });
        describe('#onClick', function () {
            it('should add black reversi at (row,col) = (2,4) when player click the cell (2,4)', function() {

                $('#workspace').find('tr').eq(4).find('td').eq(2).click();

                var cell = boardView.collection.search(2, 4);
                expect(cell.hasReversi()).to.be.true;
                expect(cell.getColor()).to.equals(black);
            });
        });
    });
})();

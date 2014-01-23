/* global describe, it */

(function () {
    'use strict';

    describe('BoardView', function () {
        before(function() {
            $('body').append('<div id="workspace"></div>');
        });
        after(function() {
            $('#workspace').remove();
        });
        describe('#render', function () {
            before(function() {
            });
            it('should put model (row,col) = (2,5) to ' +
                '2 left, 5 bottom position from left-top corner', function() {

                var view = new App.BoardView({
                    edge: 8
                });
                view.render();

                var $cell = view.$('tr').eq(5).find('td').eq(2).data('row');
                expect($cell.data('row')).to.equals(2);
                expect($cell.data('col')).to.equals(5);
            });
        });
    });
})();

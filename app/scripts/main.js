/* global App */

(function() {
    'use strict';

    var edge = 8;

    var view = new App.BoardView({
        edge: edge
    });
    $('#main').append(view.render().$el);
})();

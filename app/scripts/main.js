/* global App */

(function() {
    'use strict';

    /**
     * @module App.exports
     */
    App.exports = {};

    var view = new App.AppView();
    view.render();

    /**
     * @property view
     * @type App.AppView
     */
    App.exports.view = view;
})();

/* global App */

(function() {
    'use strict';

    App.AppView = Backbone.View.extend({
        el: '#main',

        boardView: null,

        settingView: null,

        cpu: null,

        collection: null,

        edge: 8,

        initialize: function() {

            // Create cell collection
            this.collection = new App.CellCollection(false, {
                edge: this.edge
            });
            this.collection.setInitialReversi();

            // Create CPU model
            this.cpu = new App.CPUModel({
                collection: this.collection
            });

            // Render board view
            this.boardView = new App.BoardView({
                collection: this.collection,
                cpu: this.cpu
            });

            // Render setting view
            this.settingView = new App.SettingView({
                collection: this.collection,
                cpu: this.cpu
            });

        },

        render: function() {
            this.$('#board').empty().append(this.boardView.render().$el);
        }
    });
})();

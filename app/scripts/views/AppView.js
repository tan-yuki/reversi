/* global App */

(function() {
    'use strict';

    App.AppView = Backbone.View.extend({
        el: '#main',

        render: function() {
            this.boardView = new App.BoardView({
                edge: 8
            });
            this.$('#board').append(this.boardView.render().$el);

            this.settingView = new App.SettingView({
                collection: this.boardView.collection
            });
        }
    });
})();

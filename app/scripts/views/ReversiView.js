/* global App */

(function() {
    'use strict';

    App.ReversiView = Backbone.View.extend({
        tagName: 'div',

        className: 'reversi',

        model: null,

        render: function() {
            this.$el.removeClass();
            if (this.model.hasColor()) {
                var color = this.model.getColor();
                this.$el.addClass(color);
            }
            this.$el.addClass(this.className);
            return this;
        }
    });
})();

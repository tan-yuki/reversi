/* global App */

(function() {
    'use strict';

    App.ReversiView = Backbone.View.extend({
        tagName: 'div',

        className: 'reversi',

        model: null,

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            if (this.model.hasColor()) {
                var color = this.model.getColor();
                this.$el.addClass(color);
            } else {
                this.$el.removeClass();
                this.$el.addClass(this.className);
            }
            return this;
        }
    });
})();

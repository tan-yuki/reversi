/* global App */

(function() {
    'use strict';

    var colorCode = App.ReversiModel.colorCode;

    App.CellView = Backbone.View.extend({
        tagName: 'td',
        className: 'cell',

        model: null,

        events: {
            'click': 'onClick'
        },

        onClick: function(e) {
            e.stopPropagation();
            var color = $('input[name=color]:checked').val();
            this.model.putReversi(color);
        },

        render: function() {
            var view = new App.ReversiView({
                model: this.model.reversi
            });
            this.$el.html(view.render().el);
            return this;
        }
    });
})();

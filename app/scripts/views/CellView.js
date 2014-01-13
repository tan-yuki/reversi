/* global App */

(function() {
    'use strict';

    var colorCode = App.CellModel.colorCode;

    App.CellView = Backbone.View.extend({
        tagName: 'td',
        className: 'cell',

        model: null,

        events: {
            'click': 'onClick'
        },

        onClick: function(e) {
            this.model.putReversi(colorCode.black);
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

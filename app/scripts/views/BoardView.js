/* global App */

(function() {
    'use strict';

    App.BoardView = Backbone.View.extend({
        tagName: 'table',

        className: 'board',

        collection: null,

        edge: 0,

        cpu: null,

        initialize: function(options) {
            var edge = this.edge = options.edge;
            this.collection = new App.CellCollection(false, {
                edge: edge
            });
            this.cpu = new App.CPUModel({
                collection: this.collection
            });
            this.listenTo(App.mediator, 'board:render', this.renderBoard);
        },

        render: function() {
            App.mediator.trigger('board:render');
            App.mediator.trigger('cell:render');
            return this;
        },

        renderBoard: function() {
            this.$el.empty();

            var edge = this.edge;
            var rows = [];
            for (var i = 0; i < edge; i++) {
                var $tr = $('<tr>'),
                    cells = [];
                for (var j = 0; j < edge; j++) {
                    var view = new App.CellView({
                        model: this.collection.search(j, i),
                        cpu: this.cpu
                    });
                    cells.push(view.render().$el);
                }
                rows.push($tr.append(cells));
            }
            this.$el.append(rows);
        }
    });
})();

/* global App */

(function() {
    'use strict';

    App.BoardView = Backbone.View.extend({
        tagName: 'table',

        className: 'board',

        collection: null,

        initialize: function(options) {
            var edge = this.edge = options.edge;
            var models = [];
            for (var i = 0; i < edge; i++) {
                for (var j = 0; j < edge; j++) {
                    models.push(new App.CellModel({
                        row: i,
                        col: j
                    }));
                 }
            }
            this.collection = new App.CellCollection(models, {
                edge: edge
            });
            this.collection.setInitialReversi();
        },

        render: function() {
            var edge = this.edge;
            var rows = [];
            for (var i = 0; i < edge; i++) {
                var $tr = $('<tr>'),
                    cells = [];
                for (var j = 0; j < edge; j++) {
                    var view = new App.CellView({
                        model: this.collection.search(i, j)
                    });
                    cells.push(view.render().$el);
                }
                rows.push($tr.append(cells));
            }
            this.$el.append(rows);
            return this;
        }
    });
})();

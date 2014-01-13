/* global App */

(function() {
    'use strict';

    App.BoardView = Backbone.View.extend({
        tagName: 'table',

        className: 'board',

        collection: null,

        edge: 0,

        initialize: function(options) {
            var edge = this.edge = options.edge;
            this.collection = new App.CellCollection(false, {
                edge: edge
            });
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

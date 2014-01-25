/* global App,alert */

(function() {
    'use strict';

    var colorCode = App.ReversiModel.colorCode;

    var playerColor = colorCode.black;
    var cpuColor    = colorCode.white;


    App.CellView = Backbone.View.extend({
        tagName: 'td',

        className: 'cell',

        isGameEnd: false,

        model: null,

        cpu: null,

        reversiView: null,

        events: {
            'click': 'onClick'
        },

        initialize: function(options) {
            options = _.extend({
                cpu: null
            }, options);

            this.reversiView = new App.ReversiView({
                model: this.model.reversi
            });

            this.cpu = options.cpu;
            this.listenTo(App.mediator, 'cell:render', this.render);
        },

        onClick: function(e) {
            e.stopPropagation();
            if (this.checkGameEnd()) {
                return;
            }

            this.putReversi();
            App.mediator.trigger('cell:render');
        },

        putReversi: function() {
            if (!this.model.putReversi(playerColor)) {
                return;
            }

            if (this.checkGameEnd()) {
                return;
            }

            this.putReversiByCPU();
        },

        putReversiByCPU: function() {
            if (this.checkGameEnd()) {
                return false;
            }

            if (!this.cpu.putReversi(cpuColor)) {
                this.cannotPutCPUReversi();
                return;
            }

            if (this.checkGameEnd()) {
                return;
            }

            // Check player reversi.
            // If there is no reversi which opponent can put,
            // CPU put reversi again.
            if (this.model.collection.countCandidates(playerColor) === 0) {
                this.cannotPutPlayerReversi();
                this.putReversiByCPU();
            }
        },

        checkGameEnd: function() {
            var collection = this.model.collection;
            if (this.isGameEnd) {
                return true;
            }

            if (collection.isFullReversi() || collection.isOnlyColor()) {
                this.finishGame();
                this.isGameEnd = true;
                return true;
            }
            return false;
        },

        finishGame: function() {

            var collection = this.model.collection;
            var playerCount = collection.countReversies(playerColor);
            var cpuCount    = collection.countReversies(cpuColor);

            var result = (playerCount > cpuCount) ? 'あなたの勝ちです。' :
                         (playerCount < cpuCount) ? 'CPUの勝ちです。' :
                         '引き分けです。';

            var msg =
                'ゲームが終了しました。\n' +
                'あなた: ' + playerCount + '\n' +
                'CPU:    ' + cpuCount + '\n' +
                result;
            alert(msg);
        },

        cannotContinueGame: function() {
            var collection = this.model.collection;
            var endGame = function(result) {
                var msg =
                    'オセロが一色のみになったのでゲームを終了します。\n' +
                    result;
                alert(msg);
                return true;
            };

            if (collection.isOnly(cpuColor)) {
                endGame('あなたの勝ちです。');
                return true;
            }
            if (collection.isOnly(playerColor)) {
                endGame('あなたの負けです。');
                return true;
            }
            return false;
        },

        cannotPutPlayerReversi: function() {
            if (!this.isGameEnd) {
                alert('あなたの番ですがオセロが置けません。CPUの番です。');
            }
        },

        cannotPutCPUReversi: function() {
            if (!this.isGameEnd) {
                alert('CPUのオセロが置けません。あなたの番です。');
            }
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.reversiView.render().el);

            if (this.model.isCandidate(playerColor)) {
                this.$el.append('<div class="candidate"></div>');
            }

            return this;
        }
    });
})();

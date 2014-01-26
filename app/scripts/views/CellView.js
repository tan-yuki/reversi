/* global App */

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
            if (this.isGameEnd) {
                return;
            }

            this.putReversiByPlayer();
            this.putReversiByCPU();
        },

        putReversiByPlayer: function() {
            if (this.isGameEnd) {
                return;
            }

            var result = this.model.putReversi(playerColor);
            App.mediator.trigger('cell:render');

            if (this.checkGameEnd()) {
                return;
            }

            if (!result) {
                this.cannotPutPlayerReversi();
            }
        },

        putReversiByCPU: function() {
            if (this.isGameEnd) {
                return;
            }

            var result = this.cpu.putReversi(cpuColor);
            App.mediator.trigger('cell:render');

            if (this.checkGameEnd()) {
                return;
            }

            if (!result) {
                this.cannotPutCPUReversi();
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

            if (collection.isFullReversi()) {
                this.finishGame('ゲームが終了しました。');
                return true;
            }

            if (collection.isOnlyColor()) {
                this.finishGame('オセロが一色のみになったのでゲームを終了します。');
                return true;
            }

            var candidatesCount =
                collection.countCandidates(playerColor) +
                collection.countCandidates(cpuColor);

            if (!candidatesCount) {
                this.finishGame('両方のオセロが置けなくなったのでゲームを終了します。');
                return true;
            }

            return false;
        },

        finishGame: function(additionalMsg) {
            if (!additionalMsg) {
                additionalMsg = '';
            }
            this.isGameEnd = true;

            var collection = this.model.collection;
            var playerCount = collection.countReversies(playerColor);
            var cpuCount    = collection.countReversies(cpuColor);

            var result = (playerCount > cpuCount) ? 'あなたの勝ちです。' :
                         (playerCount < cpuCount) ? 'CPUの勝ちです。' :
                         '引き分けです。';

            var msg =
                'あなた: ' + playerCount + '\n' +
                'CPU:    ' + cpuCount + '\n' +
                result;

            App.alert(additionalMsg + '\n' + msg);
        },

        cannotPutPlayerReversi: function() {
            if (!this.isGameEnd) {
                App.alert('あなたの番ですがオセロが置けません。CPUの番です。');
            }
        },

        cannotPutCPUReversi: function() {
            if (!this.isGameEnd) {
                App.alert('CPUのオセロが置けません。あなたの番です。');
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

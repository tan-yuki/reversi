/* global App */

(function() {
    'use strict';

    /**
     * @class CellModel
     * @extends Backbone.Model
     */
    App.CellModel = Backbone.Model.extend({

        /**
         * Row index
         * 
         * @type {Integer}
         * @property row
         */
        row: 0,

        /**
         * Column index
         * 
         * @type {Integer}
         * @property col
         */
        col: 0,

        /**
         * Reversi model
         * 
         * @type {App.RevesiModel}
         * @property reversi
         */
        reversi: null,

        /**
         * @constructor
         * @param {Object} options
         *   @param {Integer} row Row index
         *   @param {Integer} col Column index
         */
        initialize: function(options) {
            options = _.extend({
                row: 0,
                col: 0,
            }, options);

            this.row = options.row;
            this.col = options.col;

            this.reversi = new App.ReversiModel({
                cell: this
            });
        },

        /**
         * Put reversi in this cell.
         * 
         * @method putReversi
         * @param {String} color
         * @param {Object} [options] Optional data
         *   @param {Boolean} [options.validation=true] If you don't need validation, set false.
         *   @param {Boolean} [options.reverse=true] If you don't need to reverse other reversi, set false.
         * @return {Boolean} Success or not
         */
        putReversi: function(color, options) {
            options = _.extend({
                validation: true,
                reverse: true,
            }, options);

            console.log('Set reversi ' +
                '(row, col) = (' + this.row + ',' + this.col + ') ' +
                'color:' + color);


            if (options.validation && this.hasReversi()) {
                return false;
            }

            if (options.reverse) {
                if (!this.reverse(color)) {
                    if (options.validation) {
                        return false;
                    }
                }
            }

            return this.reversi.setColor(color);
        },

        /**
         * Put black reversi in this cell.
         * 
         * @method putBlackReversi
         * @return {Boolean} Success or not
         */
        putBlackReversi: function() {
            return this.reversi.setColor(App.ReversiModel.colorCode.black);
        },

        /**
         * Put white reversi in this cell.
         * 
         * @method putWhiteReversi
         * @return {Boolean} Success or not
         */
        putWhiteReversi: function() {
            return this.reversi.setColor(App.ReversiModel.colorCode.white);
        },

        /**
         * Return true if this cell has reversi.
         * 
         * @method hasReversi
         * @param {String} [color] Color code
         * @return {Boolean}
         */
        hasReversi: function(color) {
            return this.reversi.hasColor(color);
        },

        /**
         * Return this cell's row and col data.
         * 
         *     var cell = this.collection.search(3, 5);
         *     var point = cell.getPoint();
         *     point[0]; // 3
         *     point[1]; // 5
         * 
         *     var point = cell.getPoint(true);
         *     point.row; // 3
         *     point.col; // 5
         * 
         * @method getPoint
         * @param {Boolean} toObj If true, return as object.
         * @return {Array|Object} This cell's point.
         */
        getPoint: function(toObj) {
            if (toObj) {
                return {row: this.row, col: this.col};
            }
            return [this.row, this.col];
        },

        /**
         * Return this cell's reversi color.
         * 
         * @method getColor
         * @return {String} Color code.
         */
        getColor: function() {
            return this.reversi.getColor();
        },

        /**
         * Reverse other reversi
         * 
         * @private
         * @method reverse
         * @param {String} Put reversi color
         * @return {Boolean} 裏返せたオセロが一つでもあった場合はtrueを返す
         */
        reverse: function(color) {
            var vectors = [
                {row: -1, col: -1},
                {row: -1, col:  0},
                {row: -1, col:  1},
                {row:  0, col: -1},
                {row:  0, col:  1},
                {row:  1, col: -1},
                {row:  1, col:  0},
                {row:  1, col:  1}
            ];

            var reversedCount = 0;
            for (var i = 0, len = vectors.length; i < len; i++) {
                var v = vectors[i];
                if (this.countReverseToVector(v, color) > 0) {
                    reversedCount += this.toggleRecursively(v, color);
                }
            }
            return reversedCount > 0;
        },

        /**
         * 裏返せるオセロの数を返す
         * 
         * @method countReverse
         * @param {String} color
         * @return {Integer}
         */
        countReverse: function(color) {
            var vectors = [
                {row: -1, col: -1},
                {row: -1, col:  0},
                {row: -1, col:  1},
                {row:  0, col: -1},
                {row:  0, col:  1},
                {row:  1, col: -1},
                {row:  1, col:  0},
                {row:  1, col:  1}
            ];

            var count = 0;
            for (var i = 0, len = vectors.length; i < len; i++) {
                var v = vectors[i];
                count += this.countReverseToVector(v, color);
            }
            return count;
        },

        /**
         * Return true if we cann put reversi on this cell.
         * 
         * @method canPutReversi
         * @param {String} color
         * @return {Boolean}
         */
        canPutReversi: function(color) {
            return (!this.hasReversi()) && (this.countReverse(color) > 0);
        },

        /**
         * 渡されたcellの位置からvector方向へ
         * 裏返せるオセロがいくつあるか調べる
         *
         * @private
         * @method canReverse
         * @param {Object} vector Vector to reverse
         *   @param {int} row x-axis Vactor (-1 or 0 or 1)
         *   @param {int} col y-axis Vactor (-1 or 0 or 1)
         * @param {String} color プレイヤーが置いたオセロの色
         * @return {Integer}
         *   裏返せるオセロの数
         */
        countReverseToVector: function(vector, color) {
            var canReverse = true;

            var _countReverse = _.bind(function(cell, vector, color) {
                var row = cell.row + vector.row;
                var col = cell.col + vector.col;
                cell = this.collection.search(row, col);

                if (!cell) {
                    canReverse = false;
                    return 0;
                }
                if (!cell.hasReversi()) {
                    canReverse = false;
                    return 0;
                }
                if (cell.reversi.hasDifferentColor(color)) {
                    return 1 + _countReverse(cell, vector, color);
                }
                return 0;
            }, this);

            var count = _countReverse(this, vector, color);
            if (!canReverse) {
                return false;
            }
            return count;
        },

        /**
         * 渡されたcellの位置からvector方向へ
         * 裏返しを行う
         *
         * @private
         * @method toggleRecursively
         * @param {Object} vector Vector to reverse
         *   @param {int} row x-axis Vactor (-1 or 0 or 1)
         *   @param {int} col y-axis Vactor (-1 or 0 or 1)
         * @param {String} color プレイヤーが置いたオセロの色
         * @reutrn {Integer} 裏返したオセロの数
         */
        toggleRecursively: function(vector, color) {
            var _toggleRecursively = _.bind(function(cell, vector, color) {
                var row = cell.row + vector.row;
                var col = cell.col + vector.col;
                cell = this.collection.search(row, col);

                if (cell && cell.hasReversi() && cell.reversi.hasDifferentColor(color)) {
                    cell.reversi.toggle();
                    return 1 + _toggleRecursively(cell, vector, color);
                }
                return 0;
            }, this);

            return _toggleRecursively(this, vector, color);
        },

        /**
         * Return true if this cell is the same  arguments one.
         * 
         * @method isEquals
         * @param {App.CellModel} cell
         * @return {Boolean}
         */
        isEquals: function(cell) {
            return cell.row === this.row && cell.col === this.col;
        },

        /**
         * Return true if this cell is placed at edge.
         * Edge position is below 'x' marked position.
         * 
         *      -----------------------
         *     | x | x | x | x | x | x |
         *     |-----------------------|
         *     | x |   |   |   |   | x |
         *     |-----------------------|
         *     | x |   |   |   |   | x |
         *     |-----------------------|
         *     | x |   |   |   |   | x |
         *     |-----------------------|
         *     | x |   |   |   |   | x |
         *     |-----------------------|
         *     | x | x | x | x | x | x |
         *      -----------------------
         * 
         * 
         * @method isEdge
         * @return {Boolean}
         */
        isEdge: function() {
            var edge = this.collection.edge - 1;
            return this.row === 0    ||
                   this.row === edge ||
                   this.col === 0    ||
                   this.col === edge ;
        },

        /**
         * Return true if this cell is placed at corner.
         * Corner position is below 'x' marked position.
         * 
         *      -----------------------
         *     | x |   |   |   |   | x |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     | x |   |   |   |   | x |
         *      -----------------------
         * 
         * @method isCorner
         * @return {Boolean}
         */
        isCorner: function() {
            var edge = this.collection.edge - 1;
            return this.row === 0    && this.col === 0    ||
                   this.row === 0    && this.col === edge ||
                   this.row === edge && this.col === 0    ||
                   this.row === edge && this.col === edge;
        },

        /**
         * Return true if this cell is placesd at around corner.
         * Around corner position is below 'x' marked position.
         * 
         *      -----------------------
         *     |   | x |   |   | x |   |
         *     |-----------------------|
         *     | x | x |   |   | x | x |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     | x | x |   |   | x | x |
         *     |-----------------------|
         *     |   | x |   |   | x |   |
         *      -----------------------
         * 
         * 
         * @method isAroundCorner
         * @return {Boolean}
         */
        isAroundCorner: function() {
            var edge = this.collection.edge - 1;
            return this.isStarPosition() ||
                   // top left corner
                   this.row === 0 && this.col === 1 ||
                   this.row === 1 && this.col === 0 ||

                   // top right corner
                   this.row === edge -1 && this.col === 0 ||
                   this.row === edge    && this.col === 1 ||

                   // bottom left corner
                   this.row === 0 && this.col === edge - 1 ||
                   this.row === 1 && this.col === edge     ||

                   // bottom right corner
                   this.row === edge -1 && this.col === edge ||
                   this.row === edge    && this.col === edge - 1;
        },

        /**
         * Return true if this cell is placesd at diagonal corner.
         * Start position is below 'x' marked position.
         * 
         *      -----------------------
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   | x |   |   | x |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *     |-----------------------|
         *     |   | x |   |   | x |   |
         *     |-----------------------|
         *     |   |   |   |   |   |   |
         *      -----------------------
         * 
         * @method isStarPosition
         * @return {Boolean}
         */
        isStarPosition: function() {
            var edge = this.collection.edge - 1;
            return this.row === 1        && this.col === 1        ||
                   this.row === 1        && this.col === edge - 1 ||
                   this.row === edge - 1 && this.col === 1        ||
                   this.row === edge - 1 && this.col === edge - 1;
        },

        /**
         * Return this cell's (row, col)
         * 
         *     var cell = this.collection.search(3, 5);
         *     cell.toString() // '(row, col) = (3, 5)'
         * 
         * @method toString
         * @return {String}
         */
        toString: function() {
            return '(row, col) = (' + this.row + ',' + this.col + ')';
        }
    });
})();

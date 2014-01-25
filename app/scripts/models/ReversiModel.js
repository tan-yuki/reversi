/* global App */

(function() {
    'use strict';

    var black = 'black',
        white = 'white',
        none  = 'none';

    /**
     * @namespace App
     * @class ReversiModel
     * @extends Backbone.Model
     */
    App.ReversiModel = Backbone.Model.extend({

        /**
         * The cell on which this reversi put
         * 
         * @type {App.CellModel}
         * @property cell
         */
        cell: null,

        /**
         * @constructor
         * @param {Object} options
         *   @param {App.CellModel} CellModel
         */
        initialize: function(options) {
            this.set('color', none, {slient: true});
            this.cell = options.cell;
        },

        /**
         * Return color code.
         * 
         * @method getColor
         * @return {String} Color code
         */
        getColor: function() {
            return this.get('color');
        },

        /**
         * Set color code.
         * 
         * @method setColor
         * @param {String} color Color code
         */
        setColor: function(color) {
            if (color === this.get('color')) {
                return true;
            }

            if (App.ReversiModel.validColor(color)) {
                this.set('color', color);
                return true;
            }
            return false;
        },

        /**
         * Return true if this reversi has this color.
         * 
         * If there is no arguments, Return true 
         * if this reversi has some color.
         * 
         * @method hasColor
         * @param {String} [color] Color code
         */
        hasColor: function(color) {
            if (color) {
                return this.get('color') === color;
            }
            return this.get('color') !== none;
        },

        /**
         * Set opposite color
         * 
         * @method toggle
         */
        toggle: function() {
            if (this.getColor() === black) {
                return this.setColor(white);
            }

            if (this.getColor() === white) {
                return this.setColor(black);
            }
        },

        /**
         * Return true if this reversi 
         * is different color from this arguments.
         * 
         * @method hasDifferentColor
         * @param {String} color Color code
         * @return {Boolean}
         */
        hasDifferentColor: function(color) {
            if (color === white) {
                return this.get('color') === black;
            } else if (color === black) {
                return this.get('color') === white;
            }

            return false;
        }
    }, {

        /**
         * Return true if this color is valid.
         * 
         * @static
         * @method validColr
         * @param {String} color
         * @return {Boolean}
         */
        validColor: function(color) {
            return _.indexOf(_.values(this.colorCode), color) > -1;
        },

        /**
         * Color codes
         */
        colorCode: {

            /**
             * Black color code.
             * 
             * @static
             * @property black
             * @type String
             */
            black: black,

            /**
             * White color code.
             * 
             * @static
             * @property white
             * @type String
             */
            white: white,

            /**
             * None color code.
             * 
             * @static
             * @property none
             * @type String
             */
            none:  none
        }
    });
})();

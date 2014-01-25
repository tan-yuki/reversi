(function() {
    'use strict';

    _.mixin({
        selectAtRandom: function(arr) {
            if (!_.isArray(arr)) {
                return null;
            }

            if (!arr.length) {
                return null;
            }

            return arr[_.random(arr.length - 1)];
        }
    });
})();

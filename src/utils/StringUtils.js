(function() {

    /**
     * A utility class for manipulating strings.
     *
     * @class StringUtils
     * @memberof Machine
     *
     **/
    Machine.StringUtils = function() {};


    /**
     * Creates a text border of a given length and color.
     * @function
     * @static
     * @memberOf  Machine.StringUtils
     * @param {Number} length The length of a border.
     * @param {String} color An ANSI Color {@link Machine.ANSI}
     * @return {String}   The border string.
     */
    Machine.StringUtils.border = function(length, color) {
        var s = "";
        for (var i = 0; i < length; i++) {
            s += "*"
        }
        return Machine.ANSI.colorize(s + "\n", color);
    };

})();
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


    /**
     * A replace at index psoition utility function.
     * @function
     * @static
     * @param {String} str The string to modify
     * @param {Number} index  The position to modify
     * @param {String} character The replacement character
     *
     */
    Machine.StringUtils.replaceAt = function(str, index, character) {
        return str.substr(0, index) + character + str.substr(index + character.length);
    }


    /**
     * Replaces the empty string of length zero with an epsilon character
     * of length 1. Useful for debug output. 
     * 
     * @function
     * @static
     * @param {String} ch The input character
     * @return {String} The input character or epsilon if the string is empty
     **/
    Machine.StringUtils.transformEpsilon = function(ch) {
        if (ch == Machine.Alphabet.EPSILON_STRING) {
            return "ε"
        } else {
           return ch; 
        }

    }

})();
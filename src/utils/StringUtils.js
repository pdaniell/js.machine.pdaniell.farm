(function() {

    /**
     * A utility class for manipulating strings.
     *
     * @class StringUtils
     * @memberof Machine
     *
     **/
    Machine.StringUtils = function() {};



    Machine.StringUtils.border = function(length, color) {
        var s = "";
        for (var i = 0; i < length; i++) {
            s += "*"
        }
        return Machine.ANSI.colorize(s + "\n", color);
    };

})();
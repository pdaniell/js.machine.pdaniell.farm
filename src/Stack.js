(function() {

    /**
     * A class to represent a stack used in
     *
     * @class Stack
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.Alphabet} [attribs.alphabet] The stack alphabet.
     
     *
     **/
    Machine.Stack = function(attribs) {
        this._init(attribs);
    };

    Machine.Stack.prototype = {
        // Private Methods
        _init: function(attribs) {
            this.data = []


        },

    };

})();
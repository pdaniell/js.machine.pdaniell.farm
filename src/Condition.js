(function() {


    /**
     *
     * @class Condition
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.Condition = function(attribs) {
        this._init(attribs);
    };


    Machine.Condition.prototype = {

        // Private Methods
        _init: function(attribs) {
            this.state = attribs.state;
            this.character = attribs.character;

            if (attribs.action && action in attribs &&
                attribs.action in Machine.Transition.TRANSITION_ENUM) {
                this.action = attribs.action;
            } else {
                this.action = undefined;
            }

            if (attribs.argument && argument in attribs) {
                this.argument = attribs.argument;
            } else {
                this.argument = undefined;
            }

        },

        // Public Methods
        /** @method **/
        getState: function() {
            return this.state;
        },

        /** @method **/
        getCharacter: function() {
            return this.character;
        },


    };



})();
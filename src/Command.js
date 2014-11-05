(function() {


    /**
     *
     * @class Command
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.Command= function(attribs) {
        this._init(attribs);
    };




    Machine.Command.prototype = {

        // Private Methods
        _init: function(attribs) {
            this.to = attribs.to;

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
        getToState: function() {
            return this.to;
        },

        /** @method **/
        getAction: function() {
            return this.action;
        },

        /** @method **/
        getArgument: function() {
            return this.argument;
        }

    };



    var MOVE_RIGHT =

        /** @constant  **/
        Machine.Command.MOVE_RIGHT = "0";

    var MOVE_LEFT =

        /** @constant  **/
        Machine.Command.MOVE_LEFT = "1";

    var ERASE =

        /** @constant  **/
        Machine.Command.ERASE = "3";

    /** @constant  **/
    var WRITE =

        /** @constant  **/
        Machine.Command.WRITE = "4";

    /** @constant  **/
    var NOOP =

        /** @constant  **/
        Machine.Command.NOOP = "5";


    /** @constant **/
    Machine.Command.TRANSITION_ENUM = {
        MOVE_RIGHT: Machine.Command.MOVE_RIGHT,
        MOVE_LEFT: Machine.Command.MOVE_LEFT,
        ERASE: Machine.Command.ERASE,
        WRITE: Machine.Command.WRITE,
        NOOP: Machine.Command.NOOP
    };


})();

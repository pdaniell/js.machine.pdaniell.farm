(function() {


    /**
     *
     * @class Command
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.Command = function(attribs) {
        this._init(attribs);
    };



    Machine.Command.prototype = {

        // Private Methods
        _init: function(attribs) {

            if (attribs.state instanceof Machine.State == false) {
                throw new Error("attribs.state not of type Machine.State");
            }


            this.state = attribs.state;

            if (attribs.hasOwnProperty("action") &&
                Machine.Command.isValidCommand(attribs.action)) {
                this.action = attribs.action;
            } else {
                this.action = null;
            }

            if (attribs.hasOwnProperty("argument")) {
                this.argument = attribs.argument;
            } else {
                this.argument = null;
            }

        },


        // Public Methods

        /** @method **/
        getState: function() {
            return this.state;
        },

        /** @method **/
        setState: function(state) {

            if (state instanceof Machine.State == false) {
                throw new Error("attribs.state not of type Machine.State");
            }
            this.state = state;
        },

        /** @method **/
        hasAction: function() { 
            if(this.action == null){
                return false; 
            }
            return true; 
        }, 

        /** @method **/
        getAction: function() {
            return this.action;
        },

        /** @method **/
        setAction: function(action) {
            this.action = action;
        },

        /** @method **/
        removeAction: function() { 
            this.action = null; 
        }, 

        /** @method **/
        hasArgument: function() {
            if(this.argument == null){
                return false; 
            }
            return true; 
        },

        /** @method **/
        getArgument: function() {
            return this.argument;
        },

        /** @method **/
        setArgument: function(argument) {
            this.argument = argument;
        }, 

        /** @method **/
        removeArgument: function(){
            this.argument = null; 
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
    Machine.Command.CommandSet = new Machine.HashSet();
    Machine.Command.CommandSet.add(Machine.Command.MOVE_RIGHT);
    Machine.Command.CommandSet.add(Machine.Command.MOVE_LEFT);
    Machine.Command.CommandSet.add(Machine.Command.ERASE);
    Machine.Command.CommandSet.add(Machine.Command.WRITE);
    Machine.Command.CommandSet.add(Machine.Command.NOOP);

    /** @method 
     *  @memberof Machine.Command
     **/
    Machine.Command.isValidCommand = function(command) {
        return Machine.Command.CommandSet.contains(command);
    };


})();
(function() {


    /**
     * This class encapsulates the information for what a machine should
     * do when it is in a particular machine condition. The parameters
     * of the command are machine dependent and different types of machines
     * should be expected to have different kinds of commands.
     *
     * @class Command
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.State} attribs.state The state a machine should be in after executing the command
     * @param {Object} [attribs.action] The action the machine should execute. It should be a member of {@link Machine.Command.CommandSet}.
     * @param {String} [attribs.argument] A parameter for the action. Usually this is a character associatied with the {@link Machine.Command.WRITE} action.
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
                Machine.Command.isValidAction(attribs.action)) {
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

        /**
         * Returns the command state.
         * @method
         * @return {Machine.State} The state to go to after the command has been executed.
         */
        getState: function() {
            return this.state;
        },

        /**
         * Sets the command state.
         * @method
         * @param {Machine.State} state The command state.
         */
        setState: function(state) {

            if (state instanceof Machine.State == false) {
                throw new Error("attribs.state not of type Machine.State");
            }
            this.state = state;
        },

        /**
         * Checks whether this command has an action.
         * @method
         * @return {Boolean} True if the command has an action.
         */
        hasAction: function() {
            if (this.action == null) {
                return false;
            }
            return true;
        },

        /**
         * Retrieves the action of the command.
         * @method
         * @return {Object} The command action or null.
         */
        getAction: function() {
            return this.action;
        },

        /**
         * Sets the action of the command.
         * @method
         * @param {Object} action The command action.
         */
        setAction: function(action) {
            if (Machine.Command.isValidAction(action) == true) {
                this.action = action;
            }
        },

        /**
         * Removes the command action.
         * @method
         */
        removeAction: function() {
            this.action = null;
        },

        /**
         * Checks whether this command has an action argument.
         * @method
         * @return {Boolean} True if argument is present.
         */
        hasArgument: function() {
            if (this.argument == null) {
                return false;
            }
            return true;
        },

        /**
         * Retrieves the action argument
         * @method
         * @return {String} The action argument.
         */
        getArgument: function() {
            return this.argument;
        },

        /**
         * Sets the action argument.
         * @method
         * @param {String} argument The argument, a character usualy.
         */
        setArgument: function(argument) {
            this.argument = argument;
        },

        /**
         * Removes the action argument.
         * @method
         */
        removeArgument: function() {
            this.argument = null;
        },

        /**
         * Returns a human readable string representing the command.
         * @method
         * @returns {String} The human readable string.
         */
        characterDisplay: function() {
            if (this.hasAction() == true && this.hasArgument() == true) {

                var ch = "";
                if (this.getArgument() == Machine.Alphabet.EPSILON_STRING) {
                    ch = "ε"
                } else {
                    ch = this.getArgument();
                }

                return this.getState().getLabel() + "," +
                 Machine.Command.getActionCode(this.getAction()) + "," + ch;

            } else if (this.hasAction() == true && this.hasArgument() == false) {
                
                return this.getState().getLabel() + "," + 
                Machine.Command.getActionCode(this.getAction());

            } else if (this.hasAction() == false && this.hasArgument() == false) {
                
                return this.getState().getLabel();

            } else {
                throw new Error("Invalid commmand: argument with unspecified action.");

            }
        }

    };



    var MOVE_RIGHT =

        /** 
         * The machine action to move right on a tape.
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.MOVE_RIGHT = "0";

    var MOVE_LEFT =

        /**
         * The machine action to move left on a tape.
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.MOVE_LEFT = "1";

    var ERASE =

        /**
         * The machine action to erase the current cell on the tape.
         * @costant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.ERASE = "3";

    var WRITE =

        /**
         * The machine action to write a character to the cell on the tape.
         * (Usually requires an argument.)
         * @constant
         * @static
         * @type {Object}
         * @memberOf Machine.Command
         */
        Machine.Command.WRITE = "4";


    var NOOP =

        /**
         * The machine action to do nothing
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.NOOP = "5";

    var STACK_CHANGE = 


        /**
         * The machien action to push an element on a stack. 
         * @constant
         * @static
         * @type {Object}
         * @memberOf  Machine.Command
         */
        Machine.Command.STACK_CHANGE = "6"; 


    /**
     * The hashset whih contains all the official machine actions.
     * @constant
     * @static
     * @type {Machine.HashTable}
     * @memberOf  Machine.Command
     */
    Machine.Command.ACTION_SET = new Machine.HashTable();
    Machine.Command.ACTION_SET.put(Machine.Command.MOVE_RIGHT, "Ri");
    Machine.Command.ACTION_SET.put(Machine.Command.MOVE_LEFT, "Le");
    Machine.Command.ACTION_SET.put(Machine.Command.ERASE, "Er");
    Machine.Command.ACTION_SET.put(Machine.Command.WRITE, "Wr");
    Machine.Command.ACTION_SET.put(Machine.Command.NOOP, "Np");
    Machine.Command.ACTION_SET.put(Machine.Command.STACK_CHANGE, "St");
    /** 
     * A static method which assesses whether an object is a valid action.
     * @method
     * @static
     *  @memberof Machine.Command
     **/
    Machine.Command.isValidAction = function(command) {
        return Machine.Command.ACTION_SET.containsKey(command);
    };


    /**
     * A statuc netgid which returns a short description code for a
     * machine action.
     * @method
     * @static
     * @memberOf  Machine.Command
     */
    Machine.Command.getActionCode = function(command) {
        if (Machine.Command.isValidAction(command) == false) {
            throw new Error("Invalid action");
        }

        return Machine.Command.ACTION_SET.get(command);

    };


})();
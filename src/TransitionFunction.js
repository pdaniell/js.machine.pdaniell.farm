(function() {

    /**
     * A class to represent a transition function, which maps objects of
     * the class {@link Machine.Condition} to objects of the class {@link}
     * 
     * 
     * @class TransitionFunction
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.StateTable} [attribs.stateTable] Start with an already initialized state table. 
     * @params {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet for the transition function.
     *
     **/
    Machine.TransitionFunction = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype = {
        // Private Methods
        _init: function(attribs) {
            
            //this is where we will ulimately map conditions to commands
            this.map = new Machine.HashTable();

            if(attribs.hasOwnProperty("stateTable")){
                this.stateTable = attribs.stateTable;
            } else {
                this.stateTable = new Machine.StateTable(); 
            }

            if(attribs.hasOwnProperty("alphabet")){
                this.alphabet = attribs.alphabet; 
            } else {
                this.stateTable = new Machine.Alphabet.UNRESTRICTED;
            }


        },


        // Public Methods
        /**
         * Adds a transition to the function using two objects. 
         *         
         * @param {Machine.Condition} condition The condition for the mapping.
         * @param {Machine.Command} command   The command for the mapping.
         */
        add: function(condition, command) {

            if (condition instanceof Machine.Condition == false) {
                throw new Error("Invalid condition.");
            }

            if (this.stateTable.contains(condition.getState()) == false) {
                throw new Error ("Invalid state for condition.");
            }

            if (this.alphabet.contains(condition.getCharacter()) == false) {
                throw new Error("Invalid character for condition given alphabet");
            }


            if (command instanceof Machine.Command == false) {
                throw  new Error("Invalid command.");
            }


            if (this.stateTable.contains(command.getState()) == false) {
                throw new Error("Invalid state for command.");
            }

            if (command.hasAction() &&
                command.getAction() == Machine.Command.WRITE &&
                this.alphabet.contains(command.getArgument()) == false) {
                throw new Error("Invalid argument for command.");
            }


            this.map.put(JSON.stringify(condition), command);

            return condition;

        },

        /**
         * Removes a transition from the mapping by its domain element.
         * @method
         * @param  {Machine.Condition} condition The condition to remove
         */
        removeTransitionByCondition: function(condition) {
            this.map.remove(JSON.stringify(condition));
        },


        /**
         * Get the command for this condition.
         * @method 
         * @param  {Machine.Condition} condition  The conditions
         * @return {Machine.command}           The command
         */
        getCommand: function(condition) {
            if (this.map.containsKey(JSON.stringify(condition)) == false && this.requireTotal == true) {
                throw "Missing transition condition.";
            }

            return this.map.get(JSON.stringify(condition));
        },

        /**
         * Retrieves the alphabet for this transition function.
         * @method
         * @return {Machine.Alphabet} The alphabet.
         */
        getAlphabet: function() {
            return this.alphabet;
        },


        /**
         * Retrieves the state table for the transition function.
         * @method
         * @return {Machine.StateTable} The state table.
         */
        getStateTable: function() {
            return this.stateTable;
        },

        /**
         * Retrieves the list of the conditions mapped by the transition function.  I.e. this retrieves the domain of the function.
         * @method
         * @return {Array} An array of {@link Machine.Condition} objects.
         */
        getConditions: function() {
            var list = this.map.keys();
            var toReturn = [];
            for (var i = 0; i < list.length; i++) {

                var obj = $.parseJSON(list[i]);
                var state = new State({
                    label: obj.state.label,
                    isAccepting: obj.state.isAccepting,
                    x: obj.state.x,
                    y: obj.state.y,
                    w: obj.state.w,
                    h: obj.state.h,
                    isVisible: obj.state.isVisible
                });

                var condition = new Condition({
                    state: state,
                    character: obj.character
                });
                toReturn[i] = condition;
            }
            return toReturn;


        },

        /**
         * Sets the alphabet for this transition function. 
         * Be  cautious using this function as it provides no internal validation for consistency. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /**
         * Sets the state table for the transition function. 
         * Be cautious using this fuction as it provides no interna validation for consistency.
         * @param {Machine.StateTable} stateTable The state table
         */
        setStateTable: function(stateTable) {
            this.stateTable = stateTable;
        },


        /**
         * A useful method which returns the state of the transition function as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        getTransitionDescriptions: function() {
            var descriptions = [];

            this.map.each(function(key, val) {
                var result = JSON.parse(key);
                var str = "(" + result.state.label + ":" + result.character + ")" + "->" + val.toString();

                descriptions.push(str);
            });
            return descriptions;

        }
    };



})();
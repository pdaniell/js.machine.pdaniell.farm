(function() {

    /**
     * A class which represents a set of states. Importantly the table
     * requires that the labels of states are unique.
     * 
     * @class StateTable
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.StateTable = function(attribs) {
        this._init(attribs);
    };


    Machine.StateTable.prototype = {
        // Private Methods
        _init: function(attribs) {
            this.stateMap = new Machine.HashTable();
            this.acceptingStates = new Machine.HashSet();
            this.controlStates = new Machine.HashSet();

        },


        // Public Methods
        /**
         * Adds a state to the table.
         * @method
         * @param {Machine.State} state The state to add to the table
         */
        add: function(state) {

            if (state instanceof Machine.State == false) {
                throw "Object invalid for adding to state table.";
            }

            if (state.getIsAccepting() == true) {
                this.acceptingStates.add(state);
            } else {
                this.controlStates.add(state);
            }

            this.stateMap.put(state.getLabel(), state);
        },

        /**
         * Removes a state from the state table.
         * @method
         * @param  {String} label The label of the state
         */
        remove: function(label) {
            var state = this.getStateByLabel(label);
            this.stateMap.remove(label);
            if (this.acceptingStates.contains(state)) {
                this.acceptingStates.remove(state);
            }


            if (this.controlStates.contains(state)) {
                this.controlStates.remove(state);
            }

        },

        /**
         * Returns a hashset of the control states (i.e. the non-acccepting states). 
         * @method
         * @return {Machine.HashSet} The set of control states.
         */
        getControlStates: function() {
            return this.controlStates;
        },


        /**
         * Returns a hashset of the accepting states.
         * @method
         * @return {Machine.HashSet} The set of accepting states.
         */
        getAcceptingStates: function() {
            return this.acceptingStates;
        },

        /**
         * Gets a state object from a (string) label.
         * @method
         * @param  {String} label A name for the state
         * @return {Machine.State}       The state object
         */
        getStateByLabel: function(label) {
            if (label == null) return false;
            return this.stateMap.get(label);
        },

        /**
         * Checks whether a state is in this table.
         * @method
         * @param  {Machine.State} state The candidate state.
         * @return {Boolean}       True if the state is in the table.
         */
        contains: function(state) {
            if (state == null) return false;

            if (this.stateMap.containsValue(state)) {
                return true;
            }
            return false;
        },

        /**
         * Returns the size of the state table.
         * @return {Number} The size of the state table.
         */
        length: function() {
            return this.stateMap.keys().length;
        },

        /**
         * Returns a list of the state labels.
         * @return {List} A list of the state table.
         */
        labels: function() {
            return this.stateMap.keys();
        },

        /**
         * A useful method which returns a summary of the state table as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function() {
            var s = "";

            s = s + "|| Control: ";

            for (var controlKey in this.controlStates.keys()) {
                s = s + controlKey + " | ";
            }

            s = s + "\n || Accepting: ";


            for (var acceptKey in this.acceptingStates.keys()) {
                s = s + acceptKey + " | ";
            }

            s = s + "\n ";

        }


    };



})();
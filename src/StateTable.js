(function() {

    /**
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
        /** @method **/
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

        /** @method **/
        remove: function(label) {
            var state = this.getStateFromLabel(label);
            this.stateMap.remove(label);
            if (this.acceptingStates.contains(state)) {
                this.acceptingStates.remove(state);
            }


            if (this.controlStates.contains(state)) {
                this.controlStates.remove(state);
            }

        },

        /** @method **/
        getControlStates: function() {
            return this.controlStates;
        },


        /** @method **/
        getAcceptingStates: function() {
            return this.acceptingStates;
        },

        /** @method **/
        getStateFromLabel: function(label) {
            if (label == null) return false;
            return this.stateMap.get(label);
        },

        /** @method **/
        contains: function(state) {
            if (state == null) return false;

            if (this.stateMap.containsValue(state)) {
                return true;
            }
            return false;
        },

        /** @method **/
        length: function() {
            return this.stateMap.keys().length;
        },

        /** @method **/
        labels: function() {
            return this.stateMap.keys();
        },

        /** @method **/
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
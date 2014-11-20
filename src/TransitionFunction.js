(function() {

    /**
     *
     * @class TransitionFunction
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.TransitionFunction = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype = {
        // Private Methods
        _init: function(attribs) {
            this.map = new Machine.HashTable();
            this.stateTable = attribs.stateTable;
            this.alphabet = attribs.alphabet;

            if (attribs.hasOwnProperty("requireTotal")) {
                this.requireTotal = attribs.requireTotal;
            } else {
                this.requireTotal = false; 
            }
        },


        // Public Methods
        /** @method **/
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

        /** @method **/
        removeTransitionByCondition: function(condition) {
            this.map.remove(JSON.stringify(condition));
        },


        /** @method **/
        getCommand: function(condition) {
            if (this.map.containsKey(JSON.stringify(condition)) == false && this.requireTotal == true) {
                throw "Missing transition condition.";
            }

            return this.map.get(JSON.stringify(condition));
        },

        /** @method **/
        getAlphabet: function() {
            return this.alphabet;
        },


        /** @method **/
        getStateTable: function() {
            return this.stateTable;
        },

        /** @method **/
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

        /** @method **/
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /** @method **/
        setStateTable: function(stateTable) {
            this.stateTable = stateTable;
        },


        /** @method **/
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
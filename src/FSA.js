(function() {

    /**
     *
     * This class represents a Finite State Automaton (FSA). An FSA is a
     *
     * @class FSA Finite State Automaton
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration
     * @param {Boolean} attribs.validate
     * @param {List} attribs.states A list of states
     **/
    Machine.FSA = function(attribs) {
        this._init(attributes);
    };



    Machine.FSA.prototype = {

        // Private Methods
        _init: function(attribs) {
            this.validate = attribs.validate;
            this.setAlphabet(attribs.alphabet);
            this.stateTable = new Machine.StateTable();

            this.stateTable.add(attribs.initialState);
            this.setInitialState(attribs.initialState);
            this.currentState = attribs.initialState;
            this.inputString = "";
            this.inputIndex = 0;

            this.tape = new Machine.Tape({
                alphabet: attribs.alphabet,
                chars: ""
            });

            this.transitionFunction = new Machine.TransitionFunction({
                alphabet: this.alphabet,
                stateTable: this.stateTable
            });
        },

        //Public Methods

        /** @method **/
        getAlphabet: function() {
            return this.alphabet;
        },

        /** @method **/
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },


        /** @method **/
        addState: function(state) {
            this.stateTable.add(state);
        },

        /** @method **/
        setInitialState: function(initialState) {
            if (this.stateTable.contains(state) == false) {
                throw new Error("Initial State is not in State Table");
            }

            this.initialState = initialState;

        },

        /** @method **/
        getInitialState: function() {
            return this.initialState;
        },

        /** @method **/ 
        getCurrentState: function(){  
            return this.currentState; 
        }, 

        /** @method **/
        reset: function() {
            this.currentState = this.getInitialState();
            this.inputIndex = 0;
        },

        /** @method **/
        setInput: function(input) {
            this.input = input;

        },

        /** @method **/
        getInput: function() {
            return this.input;
        },

        /** #method **/
        setInputIndex: function(inputIndex) {
            this.inputIndex = inputIndex;
        },

        /** @method **/ 
        incrementInputIndex: function() { 

        },

        /** @method **/
        getInputIndex: function() {
            return this.inputIndex;
        },

        /** @method **/
        getCurrentCharacter: function() {
            return this.getInput(this.getInputIndex());
        },


        /** @method **/
        addTransition: function(currentState, currentCharacter, transitionState){
            var condition = new Machine.Condition({
                state: currentState,
                character:currentCharacter
            }); 

            var command = new Machine.Command({state:transitionState});
            this.transitionFunction.add(condition, command);
        }, 


        /** @method **/ 
        step: function() { 
            var currentCharacter = this.getCurrentCharacter(); 
            var currentState = this.getCurrenState(); 

        }






    };



})();
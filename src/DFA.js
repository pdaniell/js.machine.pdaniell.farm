(function() {

    /**
     *
     * This class represents a Deterministic Finite  Automaton (DFA). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Deterministic_finite_automaton}
     * and also suggestions for fruther reading.
     *
     * @class FSA Finite State Automaton
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration
     * 
    
     **/
    Machine.FSA = function(attribs) {
        this._init(attributes);
    };



    Machine.FSA.prototype = {

        // Private Methods
        _init: function(attribs) {
            if(attribs.hasOwnProperty("alphabet")){
                this.setAlphabet(attribs.alphabet);
            } else { 
                this.setAlphabet(Machiine.Alphabet.UNRESTRICTED);
            }

            // create an empty state table
            // we'll add to it later
            this.stateTable = new Machine.StateTable();

            this.currentState = null; 
            this.is = false; 
            this.hasHalted = false; 

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
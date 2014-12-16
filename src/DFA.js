(function() {

    /**
     *
     * This class represents a Deterministic Finite  Automaton (DFA). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Deterministic_finite_automaton}
     * and also suggestions for further reading.
     *
     *
     * @class DFA
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration object
     * @param {Mmachine.Alphabet} [attribs.alphabet={@link Machine.Alphabet}] [description]    
     **/
    Machine.DFA = function(attribs) {
        this._init(attributes);
    };



    Machine.DFA.prototype = {

        // Private Methods
        _init: function(attribs) {
            if(attribs.hasOwnProperty("alphabet")){
                this.setAlphabet(attribs.alphabet);
            } else { 
                this.setAlphabet(Machiine.Alphabet.UNRESTRICTED);
            }

            // Create an empty state table
            // We'll add to it later
            this.stateTable = new Machine.StateTable();


            // The current state of te machine. Since the state table
            // is empty this has to be null
            this.currentState = null; 

            // The indicator that the DFA has processed its last cell of 
            // input and it is in an accepting state
            this.accepted = false; 



            // The indicator that either the DFA has processed the last
            // cell of its input and it is in a control (i.e. non-accepting state)
            // or the DFA had remaining input for which there was no suitable
            // transition condition. 
            this.halted = false; 


            // Now iniitialize the tape. 
            this.tape = new Machine.Tape({
                alphabet: this.getAlphabet(), 
                chars: ""
            });

            // Now we initialize the Transition Function. 
            this.transitionFunction = new Machine.TransitionFunction({
                alphabet: this.getAlphabet(),
                stateTable: this.getStateTable()
            });


            // Here we add some event listeners objects
            this.onAddState = function(state){};  
            this.onRemoveState = function(state){}; 
            this.onAddTransition = function(condition, command){}; 
            this.onRemoveTransition = function(condition, command){}; 
            this.onStep = function(condition, command, stepCount, indexPointer){};
            this.onHalt = function(state, stepCount, indexPointer){}; 
            this.onAccept = function(state, stepCount, indexPointer){}; 
            this.onReject = function(state, stepCount, indexPointer){}; 

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
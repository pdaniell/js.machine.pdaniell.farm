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
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet.    
     **/
    Machine.DFA = function(attribs) {
        this._init(attribs);
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
            this.isAccepted = false; 

            // The indicator that either the DFA has processed the last
            // cell of its input and it is in a control (i.e. non-accepting state)
            // or the DFA had remaining input for which there was no suitable
            // transition condition. 
            this.isHalted = false; 


            // Now iniitialize the tape. 
            this.tape = new Machine.Tape({
                alphabet: this.getAlphabet(), 
                chars: ""
            });

            // There is only one pointer on a DFA tape
            // We initialize it here at posiiton 0
            this.pointerPosition = 0; 

            // Step counter: we haven't done anything yet so set 
            // the step count to 0
            this.stepCounter = 0; 

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

        /**
         * Retrieves the alphabet for this DFA. 
         * @method
         * @return {Machine.Alphabet} The alphabet
         */
        getAlphabet: function() {
            return this.alphabet;
        },

        /**
         * Sets the alphabet for the DFA.Beware: there are no internal 
         * consistency checks for replacing a state table in situ. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet.
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },


        /**
         * Adds a state to the machine using primitives.  
         * @method  
         * @param {String}  stateLabel  The name of the state
         * @param {Boolean} isAccepting Whether of not the state is an accepting state.
         */
        addStateByLabel: function(stateLabel, isAccepting) {
            var state = new Machine.State({label:stateLabel, isAccepting:isAccepting}); 
            this.addState(state); 
        },


        /**
         * Adds a non-accepting (control) state to the machine using primitives. 
         * @method
         * @param {String}  stateLabel  The name of the state
         */
        addControlStateByLabel: function(stateLabel) {
            var state = new Machine.State({label:stateLabel, isAccepting:false}); 
            this.addState(state); 
        },


        /**
         * Adds a state using a state object.
         * @method
         * @param {Machine.State}  state  The state object
         */
        addState: function(state) {
            this.stateTable.add(state);
            this.onAddState.call(state); 
        },


        /**
         * Remove state by label. 
         * @method
         * @param {String} stateLabel The name for the label
         */
        removeStateByLabel:function(stateLabel) { 

            var state = this.stateTable.getStateByLabel(stateLabel); 
            // - ---------------TODO ------------------------------
            //  We have to remove the state but also associate transitions
            //
            this.onRemoveState.call(state); 
        }, 

        

        /**
         * [setInitialState description]
         * @param {Machine.State} initialState [description]
         */
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
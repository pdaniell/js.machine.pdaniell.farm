(function() {

    /**
     *
     * This abstract class is a base class for common machine methods. This class
     * shouldn't be constructed. 
     *
     *
     * @class BaseMachine
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet.
     **/
    Machine.BaseMachine = function(attribs) {
        this._init(attribs);
    };



    Machine.BaseMachine.prototype = {

        //Private Methods
        _init: function(attribs) {

            if (attribs && attribs.hasOwnProperty("alphabet")) {
                this.setAlphabet(attribs.alphabet);
            } else {
                this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            // Create an empty state table
            // We'll add to it later
            this.stateTable = new Machine.StateTable();

            // The starting state
            this.initialState = null;


            // The current state of te machine. Since the state table
            // is empty this has to be null
            this.currentState = null;

            // The indicator that either the DFA has processed the last
            // cell of its input and it is in a control (i.e. non-accepting state)
            // or the DFA had remaining input for which there was no suitable
            // transition condition. 
            this.isHalted = false;


            // Step counter: we haven't done anything yet so set 
            // the step count to 0
            this.stepCount = 0;

            // Now we initialize the Transition Function. 
            this.transitionFunction = new Machine.TransitionFunction({
                alphabet: this.getAlphabet(),
                stateTable: this.getStateTable()
            });

            // Here we add some event listeners objects
            this.onAddState = function(state){};  
            this.onRemoveState = function(state){}; 
            this.onAddTransition = function(condition, command){}; 
            this.onRemoveTransition = function(condition){}; 
            this.onStep = function(condition, command, stepCount){};
            this.onHalt = function(state, stepCount){}; 


        },


        //Public Methods

        /**
         * Retrieves the alphabet for this machine. Typically, this alphabet 
         * is for the input language.
         * @method
         * @return {Machine.Alphabet} The alphabet
         */
        getAlphabet: function() {
            return this.alphabet;
        },

        /**
         * Sets the alphabet for the machine. Typically, this alphabet is
         * for the input language.
         * Beware: there are no internal 
         * consistency checks for replacing a state table in situ. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet.
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /**
         * Retrieves the state table. 
         * @method 
         * @return {Machine.StateTable} The state table.
         * 
         */
        getStateTable: function(){
            return this.stateTable; 
        },

        /**
         * Sets the state table. Using this method
         * is not recommended since there are no internal
         * checks for consistency. 
         * @method
         * @param {Machine.StateTable} stateTable The state table. 
         */
        setStateTable: function(stateTable){ 
            this.stateTable = stateTable;
        }, 


        /**
         * Retrieves the transition function.
         * @method 
         * @return {Machine.TransitionFunction} The transition function.
         * 
         */
        getTransitionFunction: function(){
            return this.transitionFunction;  
        },

        /**
         * Sets the transition function. Using this method
         * is not recommended since there are no internal
         * checks for consistency. 
         * @method
         * @param {Machine.TransitionFunction} transitionFunction The transition function.
         */
        setTransitionFunction: function(transitionFunction){ 
            this.transitionFunction = transitionFunction; 
        }, 


        /** 
         * Retrieves the initial state. 
         * @method 
         * @return {Machine.State} The initial state.
         */
        getInitialState: function() {
            return this.initialState;
        },

        /**
         * Sets the initial state. If the current state is set 
         * @method
         * @param {Machine.State} initialState The initial state.
         */
        setInitialState: function(initialState) {
            if (this.stateTable.contains(initialState) == false) {
                throw new Error("Initial State is not in State Table");
            }

            this.initialState = initialState;
            if(this.getCurrentState() == null) { 
                this.setCurrentState(initialState); 
            }

        },


        /**
         * Sets the initial state with a label. 
         * @method 
         * @param {String} initialStateLabel The initial state.
         */
        setInitialStateByLabel: function(initialStateLabel) {
            var state = this.stateTable.getStateByLabel(initialStateLabel); 
            this.setInitialState(state); 
        },


        /** 
         * Returns the current state. 
         * @method
         * 
         * @return {Machine.State} The current state.
         */
        getCurrentState: function(){  
            return this.currentState; 
        }, 

        /**
         * Sets the current state.
         * @method
         * @param {Machine.State} currentState The new current state.
         */
         setCurrentState: function(currentState){
            if (this.stateTable.contains(currentState) == false) {
                throw new Error("Initial State is not in State Table");
            }

            this.currentState = currentState;   
         }, 

        /**
         * Sets the current state label.
         * @method
         * @param {Machine.State} currentStateLabel The new current state.
         */
         setCurrentStateByLabel: function(currentStateLabel){
            var state = this.stateTable.getStateByLabel(currentStateLabel); 
            this.setCurrentState(state); 
         }, 


        /**
         * Returns whether the machine is in a halting state. 
         * @method 
         * @return {Boolean} True if in halted state.
         */
         getIsHalted: function()  {
            return this.isHalted; 
         }, 


         /**
          * Sets the value of the halted state of the machine.
          * @method
          * @param {Boolean} isHalted The new halted state.
          * 
          */
         setIsHalted: function(isHalted){
            this.isHalted = isHalted;
         },


         /**
          * Returns the step counter.
          * @method 
          * @return {Number} The step count.
          * 
          */
         getStepCount: function(){
            return this.stepCount;
         }, 

         /**
          * Sets the step count
          * @method
          * @param {Number} stepCount The step count.
          */
         setStepCount: function(stepCount){
            this.stepCount = stepCount;
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
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            this.setCurrentState(this.getInitialState());
            this.setStepCount(0);
            this.setIsHalted(false); 
        },


        /**
         * Adds a transition
         * @method 
         * @param {Machine.Condition} condition The transition condition
         * @param {Machine.command} command The transition command
         */
        addTransition: function(condition, command){
            this.getTransitionFunction().add(condition, command); 
            this.onAddTransition.call(condition,command); 
        }, 


        /**
         * Removes a transition. 
         * @method 
         * @param {Machine.Condition} [varname] [description]
         * 
         */
        removeTransition:function(condition){
            this.getTransitionFunction.removeTransitionByCondition(condition); 
            this.onRemoveTransition.call(condiiton); 
        },



    };



})();
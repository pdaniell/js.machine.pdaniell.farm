(function() {

    /**
     *
     * This class represents a (Deterministic) Finite State Transducer(FST)). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Finite_state_transducer}
     * and also suggestions for further reading.
     *
     *
     * @class FST
     * @constructor
     * @memberof Machine
     * @augments {Machine.BaseMachine}
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The input alphabet.    
     * @param {Machine.Alphabet} [attribs.outputAlphabet={@link Machine.Alphabet.UNRESTRICTED}] The output alphabet.
     * @param {Boolean} [allowEpsilonTransitions=true] Permit epsilon transitions 
     **/
    Machine.FST = function(attribs) {
        this._init(attribs);
    };



    Machine.FST.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs){
                Machine.BaseMachine.prototype._init.call(this, attribs); 
            } else {
                Machine.BaseMachine.prototype._init.call(this); 
            }


            if (attribs && attribs.hasOwnProperty("outputAlphabet")) {
                this.setOutputAlphabet(attribs.outputAlphabet);
            } else {
                this.setOutputAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            if(attribs && attribs.hasOwnProperty("allowEpsilonTransitions")){
                this.setAllowEpsilonTransitions(attribs.allowEpsilonTransitions); 
            } else { 
                this.setAllowEpsilonTransitions(true); 
            }


            // The indicator that the FST has processed its last cell of 
            // input and it is in an accepting state
            this.isAccepted = false; 


            // Now iniitialize the input tape. 
            this.inputTape = new Machine.Tape({
                alphabet: this.getAlphabet(), 
                chars: ""
            });

            // Now initialize the output tape

            this.outputTape = new Machine.Tape({
                alphabet: this.getOutputAlphabet(), 
                chars: ""
            });

            // There are two pointers for a FST
            // We initialize ithe input pointer at posiiton 0
            this.inputPointerPosition = 0; 

            // And the output pointer
            this.outputPointerPosition = 0; 


            //Some custom listener functions for FST class
            this.onAccept = function(state, stepCount, indexPointer){}; 
            this.onReject = function(state, stepCount, indexPointer){};
            this.onInputPointerChange = function(position){};  
            this.onOutputPointerChange = function(position){};  

        },

        //Public Methods


        /**
         * Retrives whether or not this machine allows epsilon output 
         * transitions. 
         * @returns {Boolean} True if epsilon transitions allowed
         */
        
        getAllowEpsilonTransitions: function() { 
            return this.allowEpsilonTransitions; 
        }, 

        /**
         * Sets whether or not this machine allows epsilon transitions. 
         * @param {Boolean} allowEpsilonTransitions True if epsilon transitions allowed.
         */
        setAllowEpsilonTransitions: function(allowEpsilonTransitions){

            this.allowEpsilonTransitions = allowEpsilonTransitions; 
        }, 

        /**
         * Retrieves the output alphabet for this machine. 
         * @method
         * @return {Machine.Alphabet} The output alphabet
         */
        getOutputAlphabet: function() {
            return this.outputAlphabet;
        },

        /**
         * Sets the output alphabet for the machine. 
         * 
         * @method
         * @param {Machine.Alphabet} outputAlphabet The output alphabet.
         */
        setOutputAlphabet: function(outputAlphabet) {
            this.outputAlphabet = outputAlphabet;
        },


        
        /**
         * Returns whether the FST is in an accepting state. 
         * @method 
         * @return {Boolean} True if in accepted state.
         */
         getIsAccepted: function()  {
            return this.isAccepted; 
         }, 


         /**
          * Sets the value of the accepted state of the FST.
          * @method
          * @param {Boolean} isAccepted The new accepted state.
          * 
          */
         setIsAccepted: function(isAccepted){
            this.isAccepted = isAccepted;
         },


         /**
          * Returns the input tape pointer position. 
          * @method 
          * @return {Number} The pointer position.
          * 
          */
         getInputPointerPosition: function(){
            return this.inputPointerPosition;
         }, 

         /**
          * Sets the input pointer position. 
          * @method
          * @param {Number} inputPointerPosition The pointer position.
          */
         setInputPointerPosition: function(inputPointerPosition){
            this.inputPointerPosition = inputPointerPosition; 
            this.onInputPointerChange.call(this.inputPointerPosition);
         },

         /**
          * Returns the output tape pointer position. 
          * @method 
          * @return {Number} The pointer position.
          * 
          */
         getOutputPointerPosition: function(){
            return this.outputPointerPosition;
         }, 

         /**
          * Sets the output pointer position. 
          * @method
          * @param {Number} pointerPosition The pointer position.
          */
         setOutputPointerPosition: function(outputPointerPosition){
            this.outputPointerPosition = outputPointerPosition; 
            this.onOutputPointerChange.call(this.outputPointerPosition);
         },



         /**
          * Returns the input tape object. 
          * @method
          * @return {Machine.Tape} The input tape.
          */
         getInputTape: function() { 
            return this.inputTape;
         }, 


         /** 
          * Sets the input tape object. Beware when using this 
          * method, there are no checks of internal consistency
          * with other aspects of the FST. 
          * 
          * @method
          * @param {Machine.Tape} inputTape The tape
          */
         setInputTape: function(inputTape){
            this.inputTape = inputTape; 
         }, 

         /**
          * Returns the output tape object. 
          * @method
          * @return {Machine.Tape} The output tape.
          */
         getOutputTape: function() { 
            return this.outputTape;
         }, 


         /** 
          * Sets the output tape object. Beware when using this 
          * method, there are no checks of internal consistency
          * with other aspects of the FST. 
          * 
          * @method
          * @param {Machine.Tape} outputTape The tape
          */
         setOutputTape: function(outputTape){
            this.outputTape = outputTape; 
         }, 

         /**
          * Sets the input string on the tape for the FST and
          * sends the input pointer back to the beginning of the string.
          * 
          * @method
          * @param {String} input The input string
          * 
          */
         setInputString: function(input) { 
                this.getInputTape().setChars(input);
                this.setInputPointerPosition(0); 

         },


         /**
          * Sets the output string on the tape for the FST and
          * sends the output pointer back to the beginning of the string.
          * 
          * @method
          * @param {String} output The output string
          * 
          */
         setOutputString: function(output) { 
                this.getOutputTape().setChars(output);
                this.setInputPointerPosition(0); 

         },


        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            Machine.BaseMachine.prototype.reset.call(this); 
            this.setInputPointerPosition(0);
            this.setOutputString(""); 
            this.setOutputPointerPosition(0); 
            this.setIsAccepted(false); 
        },




        /** 
         * Adds a transition.
         * @method
         * @param {Mahine.State} conditionState The condition state.
         * @param {String} conditionCharacter The condition character.
         * @param {Machine.State} transitionState  The state to transition to.
         * @param {String} outputCharacter The output character.
         */
        addTransitionByStatesAndCharacter: function(conditionState, currentCharacter, transitionState, outputCharacter){

            if(outputCharacter == Machine.Alphabet.EPSILON_STRING && this.getAllowEpsilonTransitions() == false) { 
                throw new Error("Epsilon transitions not permitted for this machine"); 
            }

            var condition = new Machine.Condition({
                state: conditionState,
                character:currentCharacter
            }); 

            var command = new Machine.Command({state:transitionState, action: Machine.Command.WRITE, argument:outputCharacter});
            this.addTransition(condition,command); 
        }, 

        /** 
         * Adds a transition by state label.
         * @method
         * @param {String} conditionStateLabel The condition state label.
         * @param {String} conditionCharacter The condition character.
         * @param {String} transitionStateLabel  The state label to transition to.
         * @param {String} outputCharacter The output character.
         */
        addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, transitionStateLabel, outputCharacter){
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel); 
            var transitionState = this.getStateTable().getStateByLabel(transitionStateLabel); 
            this.addTransitionByStatesAndCharacter(conditionState, currentCharacter, transitionState, outputCharacter); 
        }, 


        /**
         * Removes a transition by label and character
         * @method 
         * @param {String} conditionStateLabel The condition state label
         * @param {String} conditionCharacter The condition character
         */
        removeTransitionByStateLabelsAndCharacter: function(conditionStateLabel, conditionCharacter){ 
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel); 
            var condition = new Machine.Condition({state:condiitonState, 
                character:conditionCharacter}); 
            this.removeTrandition(condition);
        }, 





        /** 
         * Executes one step of the DFA. 
         * @method
         * @return {Boolean} True if halted
         */
        step: function() { 
            if(this.getIsHalted() == true)  {
                //The DFA is halted so there is nothing do so, so return. 
                return true; 

            }

            // Increment the stepCount
            this.setStepCount(this.getStepCount() + 1); 
            var currentState = this.getCurrentState(); 

            if(this.getInputPointerPosition() >= this.getInputTape().length()){
                
                this.setIsHalted(true); 
                // We have run out of characters to read
                // Are we in an accepting state?
                if(currentState.getIsAccepting() == true){
                    this.setIsAccepted(true);
                    this.onAccept.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                } else {
                    this.setIsAccepted(false); 
                    this.onReject.call(currentState,this.getStepCount(), this.getInputPointerPosition());

                }

                this.onHalt.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                return true; 
            }


            var currentCharacter = null; 
            var condition = null; 

            if (this.getTransitionFunction().hasEpsilonTransition(currentState)) {
                //take the epsilon transition

                currentCharacter = Machine.Alphabet.EPSILON_STRING;
                condition = this.getTransitionFunction().getEpsilonTransitionCondition(currentState);


            } else {


                currentCharacter = this.getInputTape().charAt(this.getInputPointerPosition());  


                condition = new Machine.Condition (
                    {
                        state: currentState, 
                        character: currentCharacter
                    }); 


            }

            var command = this.getTransitionFunction().getCommand(condition); 

            if(command == null){ 
                // There was no transition for the appropriate condition
                // so we have to halt and reject.
                this.setIsHalted(true); 
                this.setIsAccepted(false); 
                this.onReject.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                this.onHalt.call(currentState,this.getStepCount(), this.getInputPointerPosition());
                return true; 
            }


            // Now we come to the nondegenerate case

            // Increment the pointer position 
            if(currentCharacter != Machine.Alphabet.EPSILON_STRING){
                this.setInputPointerPosition(this.getInputPointerPosition() + 1); 
            }

            // Because this is a finite state transducer, we assume that 
            // the action is Machine.Command.WRITE
            if(command.getArgument() != Machine.Alphabet.EPSILON_STRING){
                this.getOutputTape().alter(this.getOutputPointerPosition(), command.getArgument());
                this.setOutputPointerPosition(this.getOutputPointerPosition() + 1);
            } else if(command.getArgument() == Machine.Alphabet.EPSILON_STRING && this.getAllowEpsilonTransitions() == false) { 
                throw new Error("Epsilon transitions not permitted for this machine."); 
            }

            // Change the state
            this.setCurrentState(command.getState()); 

            // Fire the event
            this.onStep.call(condition, command, this.getStepCount(), this.getInputPointerPosition());

            return false; 

        }, 


        /**
         * Runs the DFA with a specified maximum number of steps.
         * @method
         * @param {Number} maxSteps The maximum number of steps to execute
         * @returns {Boolean} True if the machine has halted
         */
        run: function(maxSteps){ 
            for(var i=0; i < maxSteps; i++){
                var returned = this.step(); 
                if(returned == true){
                    return true;                    
                }
            }

            return false; 
        }, 


        /**
         * Creates a human readable string describing the DFA. 
         * @method 
         * @return {String} The human readable string.
         */
        characterDisplay: function() { 
            var s = Machine.StringUtils.border((this.getInputTape().length() * 5) + 10, Machine.ANSI.ANSI_RED); 

            s = s + Machine.ANSI.colorize(this.getInputTape().characterDisplay(this.getInputPointerPosition()), 
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";

            s = s + Machine.ANSI.colorize(this.getOutputTape().characterDisplay(this.getOutputPointerPosition()), 
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";            

            s = s + Machine.ANSI.colorize(this.getStateTable().characterDisplay(this.getCurrentState().getLabel()), 
                Machine.ANSI.ANSI_BLUE);

            s = s + Machine.ANSI.colorize("#" + this.getStepCount() + " Halted: "  
                + Machine.ANSI.invert(this.getIsHalted()) + " Accepted: " 
                + Machine.ANSI.invert(this.getIsAccepted()) + "\n", Machine.ANSI.ANSI_LIGHT_GRAY);
          
            var currentState = this.getCurrentState(); 
            var character = this.getInputTape().charAt(this.getInputPointerPosition()); 
            var condition = new Machine.Condition({state:currentState, character:character}); 

            s = s + Machine.ANSI.colorize(this.getTransitionFunction().characterDisplay(condition), Machine.ANSI.ANSI_GREEN); 

            s = s +Machine.StringUtils.border((this.getInputTape().length() * 5)+ 10, Machine.ANSI.ANSI_RED); 




            return s; 

        }





    };

    Machine.ClassUtils.extend(Machine.FST, Machine.BaseMachine); 



})();
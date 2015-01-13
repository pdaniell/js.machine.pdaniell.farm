(function() {

    /**
     *
     * This class represents a Deterministic Finite  Automaton (TM). For more information
     * consult the wikipedia article at {@link http://en.wikipedia.org/wiki/Deterministic_finite_automaton}
     * and also suggestions for further reading.
     *
     *
     * @class TM
     * @constructor
     * @memberof Machine
     * @augments {Machine.BaseMachine}
     * @param {Object} attribs A configuration object
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet.
     **/
    Machine.TM = function(attribs) {
        this._init(attribs);
    };



    Machine.TM.prototype = {

        // Private Methods
        _init: function(attribs) {

            if (attribs) {
                Machine.BaseMachine.prototype._init.call(this, attribs);
            } else {
                Machine.BaseMachine.prototype._init.call(this);
            }



            // The indicator that the TM has processed its last cell of 
            // input and it is in an accepting state
            this.isAccepted = false;


            // Now iniitialize the tape. 
            this.tape = new Machine.Tape({
                alphabet: this.getAlphabet(),
                chars: ""
            });

            // There is only one pointer on a TM tape
            // We initialize it here at posiiton 0
            this.pointerPosition = 0;

            //Some custom listener functions for TM class
            this.onAccept = function(state, stepCount, indexPointer) {};
            this.onReject = function(state, stepCount, indexPointer) {};
            this.onPointerChange = function(position) {};

        },

        //Public Methods



        /**
         * Returns whether the TM is in an accepting state.
         * @method
         * @return {Boolean} True if in accepted state.
         */
        getIsAccepted: function() {
            return this.isAccepted;
        },


        /**
         * Sets the value of the accepted state of the TM.
         * @method
         * @param {Boolean} isAccepted The new accepted state.
         *
         */
        setIsAccepted: function(isAccepted) {
            this.isAccepted = isAccepted;
        },


        /**
         * Returns the tape pointer position.
         * @method
         * @return {Number} The pointer position.
         *
         */
        getPointerPosition: function() {
            return this.pointerPosition;
        },

        /**
         * Sets the pointer position.
         * @method
         * @param {Number} pointerPosition The pointer position.
         */
        setPointerPosition: function(pointerPosition) {
            this.pointerPosition = pointerPosition;
            this.onPointerChange.call(this.pointerPosition);
        },


        /**
         * Returns the tape object.
         * @method
         * @return {Machine.Tape} The input tape.
         */
        getTape: function() {
            return this.tape;
        },


        /** 
         * Sets the tape object. Beware when using this
         * method, there are no checks of internal consistency
         * with other aspects of the TM.
         *
         * @method
         * @param {Machine.Tape} tape The tape
         */
        setTape: function(tape) {
            this.tape = tape;
        },


        /**
         * Retrieve the contents of the Turing machine tape. 
         * @method 
         * @returns {String} The Turing machine tape
         */
        getTapeContents: function() {
            return this.getTape().getChars(); 
        }, 

        /**
         * Sets the input string on the tape for the TM and
         * sends the pointer back to the beginning of th string.
         *
         * @method
         * @param {String} input The input string
         *
         */
        setInputString: function(input) {
            this.getTape().setChars(input);
            this.setPointerPosition(0);

        },

        /** 
         * Resets the current state to the initial state (i.e. start state)
         * and resets the tape position to 0.
         * @method
         */
        reset: function() {
            Machine.BaseMachine.prototype.reset.call(this);
            this.setPointerPosition(0);
            this.setIsAccepted(false);
        },



        /** 
         * Adds a transition.
         * @method
         * @param {Mahine.State} conditionState The condition state.
         * @param {String} conditionCharacter The condition character.
         * @param {Machine.State} transitionState  The state to transition to.
         */
        addTransitionByStatesAndCharacter: function(conditionState, currentCharacter, transitionAction, transitionArgument, transitionState) {

            if (currentCharacter == Machine.Alphabet.EPSILON_STRING) {
                throw new Error("Epsilon modifications not permitted in this machine");
            }

            if(transitionAction == Machine.Command.WRITE 
                && (transitionArgument == null || transitionArgument.length != 1 || this.getAlphabet().contains(transitionArgument) == false)) {
                throw new Error("Invalid argument for Turing Machine write:" + transitionArgument);                
            }


            var condition = new Machine.Condition({
                state: conditionState,
                character: currentCharacter
            });

            var command = new Machine.Command({
                state: transitionState, 
                action: transitionAction, 
                argument: transitionArgument
            });
            this.addTransition(condition, command);
        },

        /** 
         * Adds a transition by state label.
         * @method
         * @param {String} conditionStateLabel The condition state label.
         * @param {String} conditionCharacter The condition character.
         * @param {String} transitionStateLabel  The state label to transition to.
         */
        addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, transitionActionDescription, transitionArgument, transitionStateLabel) {
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel);
            var transitionState = this.getStateTable().getStateByLabel(transitionStateLabel);
            var transitionAction = Machine.Command.getActionFromDescription(transitionActionDescription);
            this.addTransitionByStatesAndCharacter(conditionState, currentCharacter, transitionAction, transitionArgument, transitionState);
        },


        /**
         * Removes a transition by label and character
         * @method
         * @param {String} conditionStateLabel The condition state label
         * @param {String} conditionCharacter The condition character
         */
        removeTransitionByStateLabelsAndCharacter: function(conditionStateLabel, conditionCharacter) {
            var conditionState = this.getStateTable().getStateByLabel(conditionStateLabel);
            var condition = new Machine.Condition({
                state: condiitonState,
                character: conditionCharacter
            });
            this.removeTrandition(condition);
        },

        /**
         * Checks to see if the machine should halt and configures the machine
         * accordingly. 
         * 
         * @method
         * @return {Boolean} True if the machine has halted
         */
        halt: function(){ 

            // we first check to see if we're already in an accepting state. 
            // This is usually the case when the initial state is already an
            // accepting state. We don't want to try to check to see if there
            // is a condition to advance a command. 


            var currentState = this.getCurrentState(); 

            if (currentState.getIsAccepting() == true) {
                this.setIsHalted(true);
                this.setIsAccepted(true);
                this.onAccept.call(currentState, this.getStepCount(), this.getPointerPosition());
                this.onHalt.call(currentState, this.getStepCount(), this.getPointerPosition());
                return true;
            }


        }, 

        /** 
         * Executes one step of the TM.
         * @method
         * @return {Boolean} True if halted
         */
        step: function() {
            if (this.getIsHalted() == true) {
                //The TM is halted so there is nothing do so, so return. 
                return true;

            }

            // Increment the stepCount
            this.setStepCount(this.getStepCount() + 1);
            var currentState = this.getCurrentState();


            // Check to see whether we are in a haltable situation
            if(this.halt() == true){
                return true; 
            }



            var currentCharacter = this.getTape().charAt(this.getPointerPosition());


            var condition = new Machine.Condition({
                state: currentState,
                character: currentCharacter
            });


            var command = this.getTransitionFunction().getCommand(condition);

            if (command == null) {
                // There was no transition for the appropriate condition
                // so we have to halt and reject.
                this.setIsHalted(true);
                this.setIsAccepted(false);
                this.onReject.call(currentState, this.getStepCount(), this.getPointerPosition());
                this.onHalt.call(currentState, this.getStepCount(), this.getPointerPosition());
                return true;
            }





            // Left Move
            if (command.getAction() == Machine.Command.MOVE_LEFT) {

                if (this.getPointerPosition() == 0) {
                    this.getTape().prepend(this.getAlphabet().getBlank());
                } else {
                    this.setPointerPosition((this.getPointerPosition()-1));
                }

            }


            // Right Move
            else if (command.getAction() == Machine.Command.MOVE_RIGHT) {
                if (this.getPointerPosition() >= this.getTape().length() - 1) {
                    this.getTape().append(this.getAlphabet().getBlank());
                }
                this.setPointerPosition(this.getPointerPosition() + 1);

            }

            // Erase
            else if (command.getAction() == Machine.Command.ERASE) {
                this.getTape().alter(this.getPointerPosition(), this.getAlphabet().getBlank()); 

            }

            // Write
            else if (command.getAction() == Machine.Command.WRITE) {

                var character = command.getArgument();
                if (character == null) {
                    throw  new Error("Missing parameter for write.");
                }

                this.getTape().alter(this.getPointerPosition(), character);

            } else if (command.getAction() == Machine.Command.NOOP) {
                //Nothing
            }



            // Change the state
            this.setCurrentState(command.getState());


            // Are we ready to halt? If so check for the appropriate condition.
            if(this.halt() == true){
                return true; 
            }



            // Fire the event
            this.onStep.call(condition, command, this.getStepCount(), this.getPointerPosition());

            return false;

        },


        /**
         * Runs the TM with a specified maximum number of steps.
         * @method
         * @param {Number} maxSteps The maximum number of steps to execute
         * @returns {Boolean} True if the machine has halted
         */
        run: function(maxSteps) {
            for (var i = 0; i < maxSteps; i++) {
                var returned = this.step();
                if (returned == true) {
                    return true;
                }
            }

            return false;
        },


        /**
         * Creates a human readable string describing the TM.
         * @method
         * @return {String} The human readable string.
         */
        characterDisplay: function() {
            var s = Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED);

            s = s + Machine.ANSI.colorize(this.getTape().characterDisplay(this.getPointerPosition()),
                Machine.ANSI.ANSI_YELLOW);

            s = s + "\n";

            s = s + Machine.ANSI.colorize(this.getStateTable().characterDisplay(this.getCurrentState().getLabel()),
                Machine.ANSI.ANSI_BLUE);

            s = s + Machine.ANSI.colorize("#" + this.getStepCount() + " Halted: " + Machine.ANSI.invert(this.getIsHalted()) + " Accepted: " + Machine.ANSI.invert(this.getIsAccepted()) + "\n", Machine.ANSI.ANSI_LIGHT_GRAY);

            var currentState = this.getCurrentState();
         
            var character = this.getTape().charAt(this.getPointerPosition());
            var condition = new Machine.Condition({
                    state: currentState,
                    character: character
                });
            

            s = s + Machine.ANSI.colorize(this.getTransitionFunction().characterDisplay(condition), Machine.ANSI.ANSI_GREEN);

            s = s + Machine.StringUtils.border((this.getTape().length() * 5) + 10, Machine.ANSI.ANSI_RED);



            return s;

        }



    };

    Machine.ClassUtils.extend(Machine.TM, Machine.BaseMachine);



})();
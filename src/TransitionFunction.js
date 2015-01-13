(function() {

    /**
     * A class to represent a transition function, which maps objects of
     * the class {@link Machine.Condition} to objects of the class {@link}
     * 
     * 
     * @class TransitionFunction
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.StateTable} [attribs.stateTable] Start with an already initialized state table. 
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet for the transition function.
     * @param {Boolean} [attribs.requireTotal=false] Makes the retrieve commmand methods throw an error if a condition is missing; otherwise they return null
     * @param {Boolean} [attribs.allowEpsilonTransitions=true] Allow epsilon transitions in the transition function
     *
     **/
    Machine.TransitionFunction = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype = {
        // Private Methods
        _init: function(attribs) {
            
            // this is where we will ulimately map conditions to commands
            this.map = new Machine.HashTable();

            // the epsilon transition map
            this.epsilonMap = new Machine.HashTable();  

            if(attribs && attribs.hasOwnProperty("stateTable")){
                this.stateTable = attribs.stateTable;
            } else {
                this.stateTable = new Machine.StateTable(); 
            }

            if(attribs && attribs.hasOwnProperty("alphabet")){
                this.alphabet = attribs.alphabet; 
            } else {
                this.alphabet = Machine.Alphabet.UNRESTRICTED;
            }

            if(attribs && attribs.hasOwnProperty("requireTotal")){
                this.requireTotal = attribs.requireTotal; 
            } else {
                this.requireTotal = false; 
            }

            if(attribs && attribs.hasOwnProperty("allowEpsilonTransitions")){
                this.setAllowEpsilonTransitions(attribs.allowEpsilonTransitions); 
            } else {
                this.setAllowEpsilonTransitions(true); 

            }



        },


        // Public Methods
        // 

        /**
         * Retrives the epsilon map, which is a mapping between states and
         * epsilon conditions. 
         * 
         * @returns {Machine.HashTable} The epsilon map.
         */
        
        getEpsilonMap: function() { 
            return this.epsilonMap; 
        }, 

        /**
         * Sets the epsilon map, a mapping between states and the epsilon 
         * conditions. 
         * 
         * @param {Machine.HashTable} epsilonMap The epsilon map. 
         */
        setEpilsonMap: function(epsilonMap){

            this.epsilonMap = epsilonMap; 
        }, 
 


        /**
         * Retrives whether or not this function allows epsilon  
         * transitions. 
         * @returns {Boolean} True if epsilon transitions allowed
         */
        
        getAllowEpsilonTransitions: function() { 
            return this.allowEpsilonTransitions; 
        }, 

        /**
         * Sets whether or not this function allows epsilon transitions. 
         * @param {Boolean} allowEpsilonTransitions True if epsilon transitions allowed.
         */
        setAllowEpsilonTransitions: function(allowEpsilonTransitions){

            this.allowEpsilonTransitions = allowEpsilonTransitions; 
        }, 
 
        /**
         * Adds a transition to the function using two objects. 
         *         
         * @param {Machine.Condition} condition The condition for the mapping.
         * @param {Machine.Command} command   The command for the mapping.
         */
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

            if(condition.getCharacter() == Machine.Alphabet.EPSILON_STRING){
                //we first check to make sure this is permitted 
                //
                if(this.getAllowEpsilonTransitions() == false){
                    throw new Error("Epsilon transitions not permitted in this function"); 
                }

                // Now make sure that there aren't existing 
                // transitions. You can only add an epsilon transition when
                // 
                var conditions = this.getConditions(); 

                for(var i = 0; i < conditions.length; i++){
                    var candidateCondition = conditions[i]; 
                    if(candidateCondition.getState().getLabel() 
                        == condition.getState().getLabel()) { 
                        // this state already has an associated transition condition
                        // so we are not going to be able to add an epsilon transition 
                        throw new Error("Unable to add epsilon transition because other transitions exist. Delete those first."); 
                   }
                }

                // Now we made sure no other conditions are associated with the state
                // So add the condition to the epsilon map
                
                this.getEpsilonMap().put(JSON.stringify(condition.getState()), condition); 

            } else {
                // we're trying to add a non-epsilon transition
                // but we shouldn't be able to do it 
                // if there is a already an epsilon transition associated with the state
                if(this.hasEpsilonTransition(condition.getState()) == true){
                    throw new Error("Unable to add transition because there are existing epsilon transitions");
                }
            }


            this.map.put(JSON.stringify(condition), command);

            return condition;

        },


        /**
         * Returns whether or not a given state has an epsilon transition; 
         * @method 
         * @param {Machine.State} state The condition state
         * @return {Boolean} True if this state 
         * 
         */
        hasEpsilonTransition: function(state){
            return this.getEpsilonMap().containsKey(JSON.stringify(state)); 
        },


        /**
         * Returns the condition for an epsilon transition for a given state; 
         * @method
         * @param {Machine.State} state The condition state
         * @return {Machine.Condition} The condition or null
         */
        getEpsilonTransitionCondition: function(state){ 
            return this.getEpsilonMap().get(JSON.stringify(state)); 
        },


        /**
         * Removes a transition from the mapping by its domain element.
         * @method
         * @param  {Machine.Condition} condition The condition to remove
         */
        removeTransitionByCondition: function(condition) {

            if(this.hasEpsilonTransition(condition.getState()) == true) { 
                this.getEpsilonMap().remove(JSON.stringify(condition.getState())); 
            }

            this.map.remove(JSON.stringify(condition));
        },


        /**
         * Get the command for this condition.
         * @method 
         * @param  {Machine.Condition} condition  The conditions
         * @return {Machine.command}           The command
         */
        getCommand: function(condition) {
            if (this.map.containsKey(JSON.stringify(condition)) == false && this.requireTotal == true) {
                throw "Missing transition condition.";
            }

            return this.map.get(JSON.stringify(condition));
        },

        /**
         * Retrieves the alphabet for this transition function.
         * @method
         * @return {Machine.Alphabet} The alphabet.
         */
        getAlphabet: function() {
            return this.alphabet;
        },

        /**
         * Retrieves the require total property. If this property
         * is true, the {@link Machine.TransitionFunction.getCommand} function
         * throws an error if it is missing a condition key. OTherwise, it returns 
         * null on a key miss.
         * @method 
         * @return {Boolean} True if the function is required to be total.
         */
        getRequireTotal: function() { 
            return this.requireTotal; 
        }, 


        /**
         * Sets the require total property. If this property
         * is true, the {@link Machine.TransitionFunction.getCommand} function
         * throws an error if it is missing a condition key. OTherwise, it returns 
         * null on a key miss.
         * @method 
         * @param {Boolean} requireTotal The require total property
         */
        setRequireTotal: function(requireTotal) { 
            this.requireTotal = requireTotal;
        }, 



        /**
         * Retrieves the state table for the transition function.
         * @method
         * @return {Machine.StateTable} The state table.
         */
        getStateTable: function() {
            return this.stateTable;
        },

        /**
         * Retrieves the list of the conditions mapped by the transition function.  I.e. this retrieves the domain of the function.
         * @method
         * @return {Array} An array of {@link Machine.Condition} objects.
         */
        getConditions: function() {
            var list = this.map.keys();
            var toReturn = [];
            for (var i = 0; i < list.length; i++) {


                var obj = JSON.parse(list[i]);
                var state = new Machine.State({
                    label: obj.state.label,
                    isAccepting: obj.state.isAccepting,
                });

                var condition = new Machine.Condition({
                    state: state,
                    character: obj.character, 
                    stackElement: obj.stackElement
                });
                toReturn[i] = condition;
            }
            return toReturn;


        },

        /**
         * Sets the alphabet for this transition function. 
         * Be  cautious using this function as it provides no internal validation for consistency. 
         * 
         * @method
         * @param {Machine.Alphabet} alphabet The alphabet
         */
        setAlphabet: function(alphabet) {
            this.alphabet = alphabet;
        },

        /**
         * Sets the state table for the transition function. 
         * Be cautious using this fuction as it provides no interna validation for consistency.
         * @param {Machine.StateTable} stateTable The state table
         */
        setStateTable: function(stateTable) {
            this.stateTable = stateTable;
        },


        /**
         * A useful method which returns the state of the transition function as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        getTransitionDescriptions: function() {
            var descriptions = [];

            this.map.each(function(key, val) {
                var result = JSON.parse(key);
                var str = "(" + result.state.label + ":" + result.character + ")" + "->" + val.toString();

                descriptions.push(str);
            });
            return descriptions;

        }, 

        /**
         * A useful method which returns the transition function as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function(highlightCondition) {
            var s = ""; 
            var conditions = this.getConditions().reverse(); 
            for(var i = 0; i < conditions.length; i++){ 
                var condition = conditions[i]; 
                var command = this.getCommand(condition); 
                if (condition.getState().getLabel() == highlightCondition.getState().getLabel() &&
                    condition.getCharacter() == highlightCondition.getCharacter() && condition.getStackElement() == highlightCondition.getStackElement())
                 { 
                    s += Machine.ANSI.invert("(" + condition.characterDisplay() + ":"  + command.characterDisplay() + ")"); 
                } else {
                    s += "(" + condition.characterDisplay()  + ":"  + command.characterDisplay()  + ")"; 
                }

            }

            return s + "\n"; 

        }

    };



})();
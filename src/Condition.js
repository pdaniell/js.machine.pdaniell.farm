(function() {


    /**
     * A class which usually encapsulates which state a machine is in
     * and which character it is reading in on the input tape. 
     * 
     * @class Condition
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.State} attribs.state The state the machine is in.
     * @param {String} attribs.character The character the machine is reading.
     *
     **/
    Machine.Condition = function(attribs) {
        this._init(attribs);
    };


    Machine.Condition.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs.state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.state = attribs.state;
            this.character = attribs.character;

            if(attribs.hasOwnProperty("stackElement")) { 
                this.stackElement = attribs.stackElement; 
            } else { 
                this.stackElement = null; 
            }

        },

        // Public Methods
        
        /**
         * Retrieves the stack element
         * @method
         * @return {String} The stack element
         */
        getStackElement: function() {
            return this.stackElement;
        },

        /**
         * Sets the stack element
         * @method
         * @param {String} stackElement The stack element
         */
        setStackElement: function(stackElement){
            if(state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.stackElement = stackElement; 
        }, 

        /**
         * Returns whether the condition has a stack element. 
         * @method
         * @returns {Boolean} True if the condition has a stack element. 
         */
        hasStackElement: function(){
            if(this.stackElement == null){
                return false; 
            }

            return true; 

        },

        /**
         * Retrieves the condition state. 
         * @method
         * @return {Machine.State} The condition state.
         */
        getState: function() {
            return this.state;
        },

        /**
         * Sets the condition state.
         * @method
         * @param {Machine.State} state The condition state.
         */
        setState: function(state){
            if(state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.state = state; 
        }, 

        /**
         * Retrieves the condition character.
         * @method
         * @return {String} The condition character.
         */ 
        getCharacter: function() {
            return this.character;
        },

        /**
         * Sets the condition character.
         * @method
         * @param {String} character The condition character.
         */
        setCharacter: function(character){
            this.character = character; 
        }, 

        /**
         * Returns a human readable string of the condition.
         * @method
         * @returns {String} The human readable string.
         */
        characterDisplay: function(){

            var ch = ""; 
            if(this.getCharacter() == Machine.Alphabet.EPSILON_STRING){
                ch = "ε"
            } else { 
                ch = this.getCharacter(); 
            }

            if(this.hasStackElement()){
                return this.getState().getLabel() + "," + ch + "," + this.getStackElement(); 
            } else { 
                 return this.getState().getLabel() + "," + ch; 
            }

        }

    };



})();
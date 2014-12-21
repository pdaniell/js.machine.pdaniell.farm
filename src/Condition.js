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
            return this.state;
        },

        /**
         * Sets the stack element
         * @method
         * @param {Machine.State} state The condition sate.
         */
        setStackElement: function(state){
            if(state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.state = state; 
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
         * @param {Machine.State} state The condition sate.
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
        }

    };



})();
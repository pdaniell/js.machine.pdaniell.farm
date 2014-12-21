(function() {

    /**
     * A class to represent a stack used in
     *
     * @class Stack
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.Alphabet} [attribs.alphabet] The stack alphabet.
     
     *
     **/
    Machine.Stack = function(attribs) {
        this._init(attribs);
    };

    Machine.Stack.prototype = {
        // Private Methods
        _init: function(attribs) {
            this.data = [];
            if (attribs && attribs.hasOwnProperty("alphabet")) {
                    this.setAlphabet(attribs.alphabet); 
             } else {
                    this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }


        },

        //Public Methods 
        //
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
         * Removes and returns the topmost element of the stack. 
         * @method
         * @return {String} The character
         */
        pop: function() { 
            return this.data.pop(); 
        }, 

        /**
         *  Adds a topmost element to the stack. 
         *  @method
         *  @param {String} character The stack character to push
         * 
         */
        push: function(character){
            
            if(character === Machine.Alphabet.EMPTY_STRING) { 
                return; 
            }

            if(this.getAlphabet().contains(character) == false)  {
                throw new Error("Invalid character for stack element"); 
            }            
            this.data.push(character); 
        },

        /**
         *  Adds a topmost element to the stack. 
         *  @method
         *  @param {String} character The stack character to push
         * @return {String} The popped character
         */
        poppush: function(character){
            var o = this.pop(); 
            if(this.getAlphabet().contains(character) == false)  {
                throw new Error("Invalid character for stack element"); 
            }            
            this.data.push(character); 
            return o; 
        },


        /**
         * A useful method which returns the state of the tape as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function() {
            var s = "";

            //header
            for (var i = 0; i < this.data.length; i++) {
                s = s + "____";
            }

            s = s + "\n";

            //tape contents
            s += "|";
            for (var i = 0; i < this.data.length; i++) {
                var character = this.data[i];

                s = s + " " + character;
                s = s + " |";
            }

            //footer 
            s = s + "\n";
            for (var i = 0; i < this.data.length; i++) {
                s = s + "‾‾‾‾";
            }

            return s;
        }


    };

})();
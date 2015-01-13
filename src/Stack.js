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
         * Returns whether or not the stack is empty 
         * @returns {Boolean} True if the stack is empty
         */
        isEmpty: function() { 
            if(this.data.length <= 0){
                return true;
            }

            return false; 
        }, 

        /**
         * Returns the topmost element of the stack without removing it.
         * @peek
         * @return {String} The character
         */
        peek:function() { 
            if(this.data.length > 0) { 
                return this.data[this.data.length-1]; 
            } else { 
                return Machine.Alphabet.EPSILON_STRING;
            }
        },


        /**
         * Removes and returns the topmost element of the stack. 
         * @method
         * @return {String} The character
         */
        pop: function() {
            if(this.data.length > 0) { 
                return this.data.pop(); 
            } else { 
                return Machine.Alphabet.EPSILON_STRING; 
            }
        }, 

        /**
         *  Adds a string to the stack. Note that the last element
         *  of the string is added to the stack first. 
         *  @method
         *  @param {String} str The stack string to push
         * 
         */
        push: function(str){
            
            if(str === Machine.Alphabet.EPSILON_STRING) { 
                return; 
            }

            if(this.getAlphabet().isCompatibleWith(str) == false)  {
                throw new Error("Invalid string for stack push."); 
            } 

            for(var i = str.length -1; i >=0; i--){           
                var ch = str.charAt(i); 
                this.data.push(ch); 
            }
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
         * Clears the stack so that it no longer contains any units. 
         * @method
         */
         clear: function() { 
            this.data = []; 
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
            if(this.data.length == 0){
                s += Machine.ANSI.invert("|Ø|"); 
            } else{
                s += "|";
            }
            for (var i = 0; i < this.data.length; i++) {
                var character = this.data[i];

                if(i == (this.data.length-1)){
                    s  = s +  Machine.ANSI.invert("*" + character);
                } else {
                    s = s + " " + character;
                }
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
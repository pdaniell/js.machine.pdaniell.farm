(function() {


    /**
     * An alphabet for a machine.
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration literal.
     * @param {String} [attribs.chars] A string containing all the characters in the alphabet
     * @param {String} attribs.blank The blank character
     * @param {Boolean} [attribs.unrestricted=false] A flag which lets all characters to be used in the alphabet. A blank character must still be specified but the chars property will be ignored. 
     **/
    Machine.Alphabet = function(attribs) {
        this._init(attribs);
    }

    Machine.Alphabet.prototype = {

        // Private Methods
        _init: function(attribs) {

            if(attribs.hasOwnProperty("unrestricted") && 
                    attribs.unrestricted == true){ 
                this.unrestricted = true; 
            } else { 
                this.unrestricted = false;
            }

            this.blank = attribs.blank;
            if (this.blank.length != 1) {
                throw new Error("Blank character must have length 1");
            }

            if(attribs.hasOwnProperty("chars")){
                this._setAlphabet(attribs.chars);
            }
        },

        _setAlphabet: function(chars) {
            this.alphabetSet = new Machine.HashSet(); 

            for (var i = 0; i < chars.length; i++) {
                var character = chars.charAt(i);
                this.alphabetSet.add(character);
            }

            this.alphabetSet.add(this.blank);

        },


        // Public Methods 

        /**
         * A method to verify whether the argument character is within 
         * the alphabet. If the <pre><code>unrestricted</code></pre> property is 
         * set, the method does nothing more than check that the input is
         * a single character
         * 
         * @method 
         * @param {String} character A string of length 1. 
         * @return {Boolean} True if contained.
        **/
        contains: function(character) {

            if(this.unrestricted == true){
                if (character.length == 1){
                    return true; 
                } else {
                    return false; 
                }

            }

            if (this.alphabetSet.contains(character)){
                return true;
            }

            return false;
                
        },

        /** 
         * A method to test for stiring compatibility with the alphabet.
         * 
         * @method 
         * @param {String} s A candidate string to test for compatibility.
         * @return {Boolean} True if compatible.
         **/
        isCompatibleWith: function(s){
            for (var i = 0; i < s.length; i++){
                if(this.contains(s.charAt(i)) == false){    
                    return false;                
                }
            }
            return true;

        },

        /**
         * Returns the blank character.
         * @method 
         * 
         * 
         * @return {String} The blank character
         */
        getBlank: function() {
            return this.blank;

        },

        /**
         * Sets the blank character.
         * @method
         * @param {String} blank A character.
         */
        setBlank: function(blank){ 
            this.blank = blank; 
            this.addCharacter(this.blank); 
        },


        /**
         * Adds a character to the alphabet. 
         * @method
         * @param {String} character The character to add.
         */
        addCharacter: function(character){
            this.alphabetSet.add(character);
        }, 


        /**
         * Removes a character from the alphabet. 
         * @method
         * @param  {character} character The character to remove
         */
        removeCharacter: function(character){
            this.alphabetSet.remove(character);
        }

    };

    /**
     * A constant to represent the empty string character. 
     *  
     * @const 
     * 
     * @memberOf Machine.Alphabet
     */
    Machine.Alphabet.EPSILON_STRING = ""; 

    /**
     * A binary notation with characters '0' and '1'. The blank character is '0'.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.TALLY_NOTATION = new Machine.Alphabet({blank:"0", chars:"01"}); 

    /**
     * An unrestricted alphabet where any character can be used. The blank character
     * is the space character.
     * 
     * @const
     *  
     * @type {Machine.Alphabet}
     * @memberOf  Machine.Alphabet
     */
    Machine.Alphabet.UNRESTRICTED = new Machine.Alphabet({blank: " ", unrestricted:true});
})();

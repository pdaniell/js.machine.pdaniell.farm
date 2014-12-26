(function() {

    /**
     * A class by which to represent a machine tape, i.e. a sequence of characters
     * divided into cells.
     * 
     * @class Tape
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {Machine.Alphabet} [attribs.alphabet={@link Machine.Alphabet.UNRESTRICTED}] The alphabet for the tape.
     *
     **/
    Machine.Tape = function(attribs) {
        this._init(attribs);
    };


    Machine.Tape.prototype = {


        // Private Methods
        _init: function(attribs) {
            if(attribs && attribs.hasOwnProperty("alphabet")){
                this.setAlphabet(attribs.alphabet); 
            } else{ 
                this.setAlphabet(Machine.Alphabet.UNRESTRICTED);
            }

            if(attribs && attribs.hasOwnProperty("chars")) {
                this.setChars(attribs.chars); 
            } else {
                this.setChars(""); //set it to the empty string
            }
        },


        // Public Methods


        /**
         * Retrieves the alphabet for the tape. 
         * @method
         * @return {Machine.Alphabet} The alphabet.
         */
        getAlphabet: function() {
            return this.alphabet;
        },


        /**
         * Retrieve the entire character content of the tape as a single string.
         * @method
         * @return {String} The contents of the tape.
         */
        getChars: function() {
            return this.chars;
        },


        /**
         * Sets the alphabet for the tape. 
         * @method
         * @param  {Machine.Alphabet} alphabet The new alphabet.
         */
        setAlphabet: function(alphabet) {
            if (alphabet instanceof Machine.Alphabet == false) {
                throw new Error("Invalid type for alphabet");
            }

            this.alphabet = alphabet;
        },

        /**
         * Sets the character content for the tape. This will be validated
         * against the specified alphabet.
         * @method
         * @param {String} chars [description]
         */
        setChars: function(chars) {
            if (this.alphabet.isCompatibleWith(chars) == false) {
                throw new Error("Incompatible alphabet for contents.");
            }

            this.chars = chars;
        },

        
        /**
         * Returns the length of the character content on the tape.
         * @method
         * @return {Number} The length of the tape.
         */
        length: function() {
            return this.chars.length;
        },


        /**
         * Returns the character at the specified point in the tape.
         * @method
         * @param  {Number} index A 0-based index.
         * @return {String}       The character at the tape.
         */
        charAt: function(index) {
            return this.chars.charAt(index);
        },


        /**
         * Returns whether there is a character at the specified point in the tape.
         * @method
         * @param  {Number}  pos A 0-based index
         * @return {Boolean}     True if a character exists at the position
         */
        hasCharAt: function(pos) {
            if (pos < 0) {
                return false;
            }

            if (pos >= this.chars.length) {
                return false;
            }

            return true;


        },

        /**
         * Prepend a string (a finite sequence of character) to the tape.
         * @method
         * @param  {String} s The string to prepend
         */
        prepend: function(s) {
            if(this.getAlphabet().isCompatibleWith(s) == false){
                throw new Error("String incompatible with alphabet"); 
            }
            this.chars = s + this.chars;
        },

        /**
         * Append a string (a finite sequence of character) to the tape.
         * @method
         * @param  {String} s The string to append
         */
        append: function(s) {
            if(this.getAlphabet().isCompatibleWith(s) == false){
                throw new Error("String incompatible with alphabet"); 
            }
            this.setChars(this.chars + s);
        },

        /**
         * Alter the tape at a specified position on the tape.
         * @method
         * @param  {Number} pos A 0-based index
         * @param  {String} c   A character to modify
         */
        alter: function(pos, c) {
            if(this.getAlphabet().contains(c) == false) {
                throw new Error("Incompatible character"); 
            }

            if (c.length != 1) {
                throw new Error("Invalid length.");
            }

            this.chars = Machine.StringUtils.replaceAt(this.chars, pos, c);
        },

        /**
         * A useful method which returns the state of the tape as a human
         * readable string.
         * @method
         * @return {String} The string summary. 
         */
        characterDisplay: function(pointerPosition) {
            var s = "";

            //header
            for (var i = 0; i < this.chars.length; i++) {
                s = s + "=====";
            }

            s = s + "\n";

            //tape contents
            s += "|";
            for (var i = 0; i < this.chars.length; i++) {
                var character = this.chars.charAt(i);
                if(i == pointerPosition) { 
                    s = s + Machine.ANSI.invert("*" + character);
                } else {
                    s = s + " " + character;
                }
                s = s + " |";
            }

            //footer 
            s = s + "\n";
            for (var i = 0; i < this.chars.length; i++) {
                s = s + "=====";
            }

            return s;
        }


    };


})();
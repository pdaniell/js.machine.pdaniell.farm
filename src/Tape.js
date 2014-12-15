(function() {

    /**
     *
     * @class Tape
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.Tape = function(attribs) {
        this._init(attribs);
    };


    Machine.Tape.prototype = {


        // Private Methods
        _init: function(attribs) {
            this.setAlphabet(attribs.alphabet); 

            if(attribs.hasOwnProperty("chars")) {
                this.setChars(attribs.chars); 
            } else {
                this.setChars(""); //set it to the empty string
            }
        },


        // Public Methods


        /** @method **/
        getAlphabet: function() {
            return this.alphabet;
        },


        /** @method **/
        getChars: function() {
            return this.chars;
        },


        /** @method **/
        setAlphabet: function(alphabet) {
            if (alphabet instanceof Machine.Alphabet == false) {
                throw new Error("Invalid type for alphabet");
            }

            this.alphabet = alphabet;
        },

        /** @method **/
        setChars: function(chars) {
            if (this.alphabet.isCompatibleWith(chars) == false) {
                throw new Error("Incompatible alphabet for contents.");
            }

            this.chars = chars;
        },

        /** @method **/
        length: function() {
            return this.chars.length;
        },


        /** @method **/
        charAt: function(index) {
            return this.chars.charAt(index);
        },


        /** @method **/
        hasCharAt: function(pos) {
            if (pos < 0) {
                return false;
            }

            if (pos >= this.chars.length) {
                return false;
            }

            return true;


        },

        /** @method **/
        prepend: function(s) {
            this.chars = s + this.chars;
        },

        /** @method **/
        append: function(s) {
            this.setChars(this.chars + s);
        },

        /** @method **/
        alter: function(pos, c) {
            if (c.length != 1) {
                throw "Invalid length.";
            }

            this.chars = StringUtils.replaceCharAt(this.chars, pos, c);
        },

        /** @method **/
        characterDisplay: function() {
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
                s = s + " " + character;
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
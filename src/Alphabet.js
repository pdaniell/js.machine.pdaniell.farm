(function() {


    /**
     * An alphabet for a machine.
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration literal.
     * @param {String} attribs.chars A string containing all the characters in the alphabet
     * @param {String} attribs.blank The blank character
     **/
    Machine.Alphabet = function(config) {
        this._init(config);
    }

    Machine.Alphabet.prototype = {

        // Private Methods

        _init: function(attribs) {
            this.blank = attribs.blank;
            if (this.blank.length != 1) {
                throw "Blank character must have length 1";
            }
            this._setAlphabet(attribs.chars);
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

        /** @method **/
        contains: function(character) {
            if (this.alphabetSet.contains(character))
                return true;

            return false;
        },


        /** @method **/
        getBlank: function() {
            return this.blank;

        }

    };

    Machine.Alphabet.TALLY_NOTATION = new Machine.Alphabet({blank:"0", chars:"01"}); 


})();

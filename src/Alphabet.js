(function() {


    /**
     * An alphabet for a machine.
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration literal.
     * @param {String} attribs.chars A string containing all the characters in the alphabet
     * @param {String} attribs.blank The blank character
     **/
    Machine.Alphabet = function(attribs) {
        this._init(attribs);
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
        isCompatibleWith: function(s){
            for (var i = 0; i < s.length; i++){
                if(this.contains(s.charAt(i)) == false){    
                    return false;                
                }
            }
            return true;

        },

        /** @method **/
        getBlank: function() {
            return this.blank;

        }

        /** @method **/
        setBlank: function(blank){ 
            this.blank = blank; 
            this.addCharacter(this.blank); 
        },


        /** @method **/
        addCharacter: function(character){
            this.alphabetSet.add(character);
        }, 


        /** @method **/
        removeCharacter: function(character){
            this.alphabetSet.remove(character);
        }

    };

    Machine.Alphabet.TALLY_NOTATION = new Machine.Alphabet({blank:"0", chars:"01"}); 


})();

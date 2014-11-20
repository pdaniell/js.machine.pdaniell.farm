(function() {


    /**
     *
     * @class Condition
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
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

        },

        // Public Methods
        /** @method **/
        getState: function() {
            return this.state;
        },

        /** @method **/
        setState: function(state){
            if(state instanceof Machine.State == false){
                throw new  Error("attribs.state not of type Machine.State"); 
            }

            this.state = state; 
        }, 

        /** @method **/
        getCharacter: function() {
            return this.character;
        },

        /** @method **/
        setCharacter: function(character){
            this.character = character; 
        }

    };



})();
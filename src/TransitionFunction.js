(function() {

    /**
     *
     * @class TransitionFunction
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.TransitionFunction = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype{ 
        // Private Methods
        _init: function(attribs){
            this.stateTable = attribs.stateTable; 
            this.functionHashtable = new Machine.HashTable(); 

        }, 


        // Public Methods
        /** @method **/
        add: function(condition, command){

        }
    };





})();

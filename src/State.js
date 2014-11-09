(function() {

    /**
     *
     * @class State
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.State = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype{ 
        // Private Methods
        _init: function(attribs){
            this.label = attribs.label; 
            this.isAccepting = attribs.isAccepting; 
        }, 


        // Public Methods
        /** @method **/
        getIsAccepting: function(){ 
            return this.isAccepting; 
        },

        /** @method **/
        setIsAccepting: function(isAccepting){
            this.isAccepting = isAccepting;         
        },

        /** @method **/
        getLabel: function(){ 
            return this.label; 
        }, 

        /** @method **/
        setLabel: function(label){
            this.label = label;         
        }
    };





})();

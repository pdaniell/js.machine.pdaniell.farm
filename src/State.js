(function() {

    /**
     * A class to represent a state in a finite state machine.
     * 
     * @class State
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     * @param {String} attribs.label The label for the state. 
     * @param {Boolean} attribs.isAccepting A flag indicating the state is an accepting state.
     *
     **/
    Machine.State = function(attribs) {
        this._init(attribs);
    };


    Machine.State.prototype = { 

        // Private Methods
        _init: function(attribs){
            this.label = attribs.label; 
            this.isAccepting = attribs.isAccepting; 
        }, 


        // Public Methods
        /**
         * Returns whether or not the state is accepting.
         * @method
         * @return {Boolean} True if it is accepting.
         */     
        getIsAccepting: function(){ 
            return this.isAccepting; 
        },

        /**
         * Specifies whether the state is accepting.
         * @method
         * @param {Boolean} isAccepting True if it is accpeting.
         */ 
        setIsAccepting: function(isAccepting){
            this.isAccepting = isAccepting;         
        },

        /**
         * Retrieves the label of the state.
         * @method
         * @return {String} A name for the state.
         */
        getLabel: function(){ 
            return this.label; 
        }, 

        /**
         * Sets the label for the state.
         * @method
         * @param {String} label A name for the state.
         */
        setLabel: function(label){
            this.label = label;         
        }
    };





})();

(function() {

    /**
     *
     * @class StateTable
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.StateTable = function(attribs) {
        this._init(attribs);
    };


    Machine.TransitionFunction.prototype{ 
        // Private Methods
        _init: function(attribs){
            this.stateMap = new Machine.Hashtable();  
            this.acceptingStates = new Machine.Hashset();  
            this.controlStates = new Machine.Hashset();  

        }, 


        // Public Methods
        /** @method **/
        add: function(state){
            
            if(state instanceof Machine.State == false){
                throw "Object invalid for adding to state table.";            
            }

            if (state.getIsAccepting() == true){
                this.acceptingStates.add(state);
            } else{ 
                this.controlStates.add(state);
            }
            
            this.stateMap.put(state.getLabel(), state); 
        }, 

        /** @method **/        
        remove: function(label){ 
            var state = this.getStateFromLabel(label); 
            this.stateMap.remove(label); 
            if(this.acceptingStates.contains(state)){
                this.acceptingStates.remove(state); 
            }
            
            
            if(this.controlStates.contains(state)){
                this.controlStates.remove(state); 
            }
            
        }, 

        /** @method **/
        getControlStates: function(){ 
            return this.controlStates;
        },

        /** @method **/
        getStateFromLabel: function(label) {
             return this.stateMap.get(label);
        },

        /** @method **/        
        contains: function(state){
            if(this.stateMap.containsValue(state)){
                return true; 
            }
            return false; 
        }, 

        /** @method **/        
        length: function(){ 
            return this.stateMap.keys().length; 
        }, 

        /** @method **/
        labels: function(){ 
            return this.stateMap.keys(); 
        }

    }); 
    };





})();

(function() {

    /**
     *
     * This class represents a Finite State Automaton (FSA). An FSA is a 
     * 
     * @class FSA Finite State Automaton
     * @constructor
     * @memberof Machine
     * @param {Object} attributes A configuration
     * @param {Boolean} attributes.validate  
     * @param {List} attributes.states A list of 
     **/
   	Machine.FSA = function(attribs){
    	this._init(attributes); 
    }; 




    Machine.FSA.prototype = {
    	_init: function(attribs){
    		this.validate = attribs.validate; 

    	},

    }; 


    /**
     * 
     * @class FSA.Transition FSA.Transition
     * @memberof Machine.FSA
     * @constructor
     * @param {Object} attributes
	 *
	 **/
    Machine.FSA.Transition = function(attribs){
    	this._init(attribs); 
    }; 


    Machine.FSA.Transition.prototype = {
    	_init: function(attribs)

    };



    /** @constant  **/
    Machine.FSA.Transition.MOVE_RIGHT = 0; 

     /** @constant  **/
    Machine.FSA.Transition.MOVE_LEFT = 1; 

	/** @constant  **/
	Machine.FSA.Transition.ERASE=3; 

	 /** @constant  **/
    Machine.FSA.Transition.WRITE=4; 

	 /** @constant  **/
    Machine.FSA.Transition.NOOP=4; 





})();

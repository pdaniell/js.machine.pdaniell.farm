(function() {


    /**
     * 
     * @class Transition 
     * @memberof Machine
     * @constructor
     * @param {Object} attribs The initialization literal.
     *
     **/
    Machine.Transition = function(attribs){
        this._init(attribs); 
    }; 


    Machine.Transition.prototype = {
        _init: function(attribs){
            this.from = attribs.from; 
            this.character = attribs.character; 

            this.to = attribs.to; 

            if(action in attribs && 
                attribs.action in Machine.Transition.TRANSITION_ENUM){
                this.action = attribs.action;
            } else {
                this.action = undefined; 
            }

            if(argument in attribs){
                this.argument = attribs.argument;
            } else{
                this.argument = undefined; 
            }

                
        }

    };



    /** @constant  **/
    var MOVE_RIGHT = Machine.Transition.MOVE_RIGHT = 0; 

     /** @constant  **/
    var MOVE_LEFT = Machine.Transition.MOVE_LEFT = 1; 

    /** @constant  **/
    var ERASE = Machine.Transition.ERASE=3; 

     /** @constant  **/
    var WRITE = Machine.Transition.WRITE=4; 

     /** @constant  **/
    var NOOP = Machine.Transition.NOOP=5; 


    /** @constant **/
     Machine.Transition.TRANSITION_ENUM = {
        MOVE_RIGHT: Machine.Transition.MOVE_RIGHT,
        MOVE_LEFT: Machine.Transition.MOVE_LEFT,
        ERASE: Machine.Transition.ERASE, 
        WRITE: Machine.Transition.WRITE,
        NOOP: Machine.Transition.NOOP
    }; 


})();

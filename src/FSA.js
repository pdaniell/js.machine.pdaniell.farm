(function() {

    /**
     *
     * This class represents a Finite State Automaton (FSA). An FSA is a
     *
     * @class FSA Finite State Automaton
     * @constructor
     * @memberof Machine
     * @param {Object} attribs A configuration
     * @param {Boolean} attribs.validate
     * @param {List} attribs.states A list of states
     **/
    Machine.FSA = function(attribs) {
        this._init(attributes);
    };



    Machine.FSA.prototype = {
        _init: function(attribs) {
            this.validate = attribs.validate;
        },

    };



})();
'use strict';


/**
 *
 * The MIT License (MIT)
 *
 *   Copyright (c) 2014 Paul Daniell
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 * 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 *
 **/


(function() {

    var Machine = {
        version: '0.0.1',
        author: 'Paul Daniell'
    };

    // Node 
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Machine;
        }
        exports.Machine = Machine;
    }

    // AMD/Require
    else if (typeof define === 'function' && define.amd) {
        define(function(require) {
            return Machine;
        });
    }


    // Browser Global
    else if (typeof window !== 'undefined') {
        window.Machine = Machine;
    }


    // Web Worker
    else if (typeof self !== 'undefined') {
        self.Machine = Machine;
    }



})();

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

        _init: function(attribs){
            this.blank = attribs.blank;
            if(this.blank.length != 1){ 
                throw "Blank character must have length 1"; 
            }
            this._setAlphabet(attribs.chars);
        },

        _setAlphabet: function(chars){
            this.alphabetSet = {}; 

            for (var i=0; i < chars.length; i++){
                var character  = chars.charAt(i); 
                this.alphabetSet[character] = character;
            }

            this.alphabetSet[this.blank] = this.blank;

        },


        // Public Methods 
        contains: function(character){
            if (character in this.alphabetSet) 
                return true;

            return false;
        }

    };


})();

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
    Machine.Transition.MOVE_RIGHT = 0; 

     /** @constant  **/
    Machine.Transition.MOVE_LEFT = 1; 

    /** @constant  **/
    Machine.Transition.ERASE=3; 

     /** @constant  **/
    Machine.Transition.WRITE=4; 

     /** @constant  **/
    Machine.Transition.NOOP=5; 


    /** @constant **/
    /* Machine.Transition.TRANSITION_ENUM = {
        Machine.Transition.MOVE_RIGHT: Machine.Transition.MOVE_RIGHT,
        Machine.Transition.MOVE_LEFT: Machine.Transition.MOVE_LEFT,
        Machine.Transition.ERASE: Machine.Transition.ERASE, 
        Machine.Transition.WRITE: Machine.Transition.WRITE,
        Machine.Transition.NOOP: Machine.Transition.NOOP
    }; */


})();

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
   	Machine.FSA = function(attribs){
    	this._init(attributes); 
    }; 




    Machine.FSA.prototype = {
    	_init: function(attribs){
    		this.validate = attribs.validate; 
    	},

    }; 





})();

(function() {


    /**
     * Machine State Constructor
     * @constructor
     * @memberof Machine
     * @param {Object} config A configuration literal.
     * @param {String} config.name The name of the state; 
     **/
    Machine.State = function(config) {
        this.init(config);
    }

    Machine.State.prototype = {


    };


})();

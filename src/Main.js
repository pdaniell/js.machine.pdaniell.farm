
(function(){

	var Machine = {
		version: '0.0.0', 
		author: 'Paul Daniell'
	}; 

	
  Machine.State = function(config){
    this.init(config); 
  }


  // Node 
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Machine;
    }
    exports.Machine = Machine;
  }

  // AMD/Require
  else if (typeof define === 'function' && define.amd) {
    define(function(require) { return Machine; });
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



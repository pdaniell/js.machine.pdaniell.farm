
(function(){

	var Machine = {
		version: '0.0.0', 
		author: 'Paul Daniell'
	}; 

	



  //======
  // NODE
  //======
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Machine;
    }
    exports.Machine = Machine;
  }
  //============
  // AMD/REQUIRE
  //============
  else if (typeof define === 'function' && define.amd) {
    define(function(require) { return Machine; });
  }
  //========
  // BROWSER
  //========
  else if (typeof window !== 'undefined') {
    window.Machine = Machine;
  }
  //===========
  // WEB WORKER
  //===========
  else if (typeof self !== 'undefined') {
    self.Machine = Machine;
  }



})(); 



(function(){

	


})();
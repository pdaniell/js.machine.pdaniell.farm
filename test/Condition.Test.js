describe("Condiiton Test Suite", function() {


    it("FSA Condition Constructor Test", function() {

        //imports 
        var State = Machine.State; 
        var Condition = Machine.Condition; 

        var controlState = new Machine.State({label:"A", isAccepting:false}); 

		var tsCondition = new Condition({state: controlState, character:"0"}); 

		expect(tsCondition.getState()).toBe(controlState); 
		expect(tsCondition.getCharacter()).toBe("0"); 



    });


});

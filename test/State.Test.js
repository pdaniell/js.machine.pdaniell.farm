describe("State Test Suite", function() {


    it("Basic State Constructor Test", function() {

        var State = Machine.State;

        var controlState = new State({label:"A", isAccepting:false}); 
        expect(controlState.getLabel()).toBe("A"); 
        expect(controlState.getIsAccepting()).toBe(false); 

        var controlState2 = new State({label:"B", isAccepting:true}); 
        expect(controlState2.getIsAccepting()).toBe(true); 

    });


});

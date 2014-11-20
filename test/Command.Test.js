describe("Command Test Suite", function() {


    it("FSA Command Constructor Test", function() {


        var controlState = new Machine.State({label:"A", isAccepting:false}); 
        var controlState2 = new Machine.State({label:"B", isAccepting:true}); 


		var tsCommand = new Machine.Command({
			state: controlState
		}); 

        expect(tsCommand.getState().getLabel()).toBe("A"); 
        expect(tsCommand.getState().getIsAccepting()).toBe(false); 
        tsCommand.setState(controlState2); 


        expect(tsCommand.getState().getLabel()).toBe("B"); 
        expect(tsCommand.getState().getIsAccepting()).toBe(true); 
        

    });


});

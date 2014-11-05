describe("Command Test Suite", function() {


    it("FSA Command", function() {
		var tsCommand = new Machine.Command({
			to: "B"

		}); 

		expect(tsCommand.getToState()).toBe("B");
    });


});

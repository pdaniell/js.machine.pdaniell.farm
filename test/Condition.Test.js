describe("TransitionCondiiton Test Suite", function() {


    it("FSA Condition", function() {
		var tsCondition = new Machine.Condition({from: "A", character:"0"}); 
		expect(tsCondition.getFromState()).toBe("A"); 
		expect(tsCondition.getCharacter()).toBe("0"); 
    });


});

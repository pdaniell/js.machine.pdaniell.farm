describe("Condiiton Test Suite", function() {


    it("FSA Condition Constructor Test", function() {
		var tsCondition = new Machine.Condition({from: "A", character:"0"}); 
		expect(tsCondition.getFromState()).toBe("A"); 
		expect(tsCondition.getCharacter()).toBe("0"); 
    });


});

describe("Turing Machine Test", function() {


    it("Basic Usage for Turing Machine", function() {

        var tm = new Machine.TM();

        tm.setInputString("aaa");

        tm.addStateByLabel("A", false);
        tm.addStateByLabel("B", false);
        tm.addStateByLabel("C", false);
        tm.addStateByLabel("D", false);
        tm.addStateByLabel("E", true);

        tm.addTransitionByStateLabelsAndCharacter("A", "a", "LEFT", null, "A");

        tm.addTransitionByStateLabelsAndCharacter("A", " ", "WRITE", "b", "B");

        tm.addTransitionByStateLabelsAndCharacter("B", "b", "RIGHT", null, "B");

        tm.addTransitionByStateLabelsAndCharacter("B", "a", "RIGHT", null, "C");

        tm.addTransitionByStateLabelsAndCharacter("C", "a", "RIGHT", null, "C");

        tm.addTransitionByStateLabelsAndCharacter("C", " ", "WRITE", "c", "D");

        tm.addTransitionByStateLabelsAndCharacter("D", "c", "ERASE", null, "D");

        tm.addTransitionByStateLabelsAndCharacter("D", " ", "WRITE", "b", "E");

        tm.setInitialStateByLabel("A");


        tm.run(100); 


        expect(tm.getIsHalted()).toBe(true);

        expect(tm.getIsAccepted()).toBe(true);

        expect(tm.getTapeContents()).toBe("baaab"); 
    });

});
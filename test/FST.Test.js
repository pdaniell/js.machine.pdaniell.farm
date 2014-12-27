describe("Finite State Transducer Test", function() {


    it("FST Basic Usage Test for (ab)*", function() {

        var fst = new Machine.FST();

        fst.setInputString("abababababababab");

        fst.addStateByLabel("A", true);
        fst.addStateByLabel("B", false);

        fst.addTransitionByStateLabelsAndCharacter("A", "a", "B", "b");
        fst.addTransitionByStateLabelsAndCharacter("B", "b", "A", Machine.Alphabet.EPSILON_STRING);

        fst.setInitialStateByLabel("A");

        fst.step(); 

        expect(fst.getOutputTape().getChars()).toBe("b"); 


        fst.run(16); 

        expect(fst.getIsHalted()).toBe(true); 


        expect(fst.getIsAccepted()).toBe(true); 
        expect(fst.getOutputTape().getChars()).toBe("bbbbbbbb");
    });


});
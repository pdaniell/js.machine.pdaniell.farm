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


    it("FST Test With Epsilon Input Transitions",
        function() {
            var fst = new Machine.FST();

            fst.setInputString("abababababababab");

            fst.addStateByLabel("A", true);
            fst.addStateByLabel("B", false);
            fst.addStateByLabel("C", false);
            fst.addStateByLabel("D", false);

            fst.addTransitionByStateLabelsAndCharacter("A", "a", "B", "c");

            expect(function() {
                dfa.addTransitionByStateLabelsAndCharacter("A", "", "B",
                    " ");
            }).toThrow();


            fst.addTransitionByStateLabelsAndCharacter("B", "", "C", "");
            fst.addTransitionByStateLabelsAndCharacter("C", "b", "D", "d");
            fst.addTransitionByStateLabelsAndCharacter("C", "a", "D", "c");
            fst.addTransitionByStateLabelsAndCharacter("D", "", "A", "0");


            fst.setInitialStateByLabel("A");


            fst.run(100);

            expect(fst.getIsHalted()).toBe(true);


            expect(fst.getIsAccepted()).toBe(true);
            expect(fst.getOutputTape().getChars()).toBe("cd0cd0cd0cd0cd0cd0cd0cd0");

        });


});
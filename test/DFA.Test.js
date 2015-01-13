describe("Deterministic Finite Automaton Test", function() {


    it("DFA Basic Usage Test for (ab)*", function() {


        var dfa = new Machine.DFA();


        expect(dfa.getAlphabet()).toBe(Machine.Alphabet.UNRESTRICTED);

        dfa.setInputString("abababababababab");

        dfa.addStateByLabel("A", true);
        dfa.addStateByLabel("B", false);

        dfa.addTransitionByStateLabelsAndCharacter("A", "a", "B");
        dfa.addTransitionByStateLabelsAndCharacter("B", "b", "A");

        expect(dfa.getStateTable().length()).toBe(2);

        dfa.setInitialStateByLabel("A");

        //run for 10 steps, it shouldn't halt by then.
        dfa.run(10);
        expect(dfa.getIsHalted()).toBe(false);

        //now run it for 7 more steps
        dfa.run(7);
        expect(dfa.getIsHalted()).toBe(true);


    });


    it(("DFA with epsilon transitions for (ab|aa)*"), function() {

        var dfa = new Machine.DFA();
        dfa.setInputString("abababababababab");

        dfa.addStateByLabel("A", true);
        dfa.addStateByLabel("B", false);
        dfa.addStateByLabel("C", false);
        dfa.addStateByLabel("D", false);


        dfa.addTransitionByStateLabelsAndCharacter("A", "a", "B");

        expect(function() {
            dfa.addTransitionByStateLabelsAndCharacter("A", "", "B");
        }).toThrow();

        dfa.addTransitionByStateLabelsAndCharacter("B", "", "C");
        dfa.addTransitionByStateLabelsAndCharacter("C", "a", "D");
        dfa.addTransitionByStateLabelsAndCharacter("C", "b", "D");
        dfa.addTransitionByStateLabelsAndCharacter("D", "", "A");
        

        expect(function() {
            dfa.addTransitionByStateLabelsAndCharacter("D", "a", "A");
        }).toThrow();




        dfa.setInitialStateByLabel("A");

        //run for 10 steps, it shouldn't halt by then.
        dfa.run(10);
        expect(dfa.getIsHalted()).toBe(false);

        //now run it for 7 more steps
        dfa.run(70);
        expect(dfa.getIsHalted()).toBe(true);

        expect(dfa.getIsAccepted()).toBe(true);


        dfa.setInputString("aaaa");
        dfa.reset(); 

        dfa.run(100); 
        expect(dfa.getIsHalted()).toBe(true);

        expect(dfa.getIsAccepted()).toBe(true);


        dfa.setInputString("aab");
        dfa.reset(); 

        dfa.run(100); 
        expect(dfa.getIsHalted()).toBe(true);

        expect(dfa.getIsAccepted()).toBe(false);


    });


});
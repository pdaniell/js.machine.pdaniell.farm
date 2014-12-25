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


});
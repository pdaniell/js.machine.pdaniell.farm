describe("Deterministic Pushdown Automaton Test Suite", function() {


    it("DPDA for a^{n}b^{n} (Accepting by state)", function() {

        var dpda = new Machine.DPDA({
            initialStackSymbol: "Z"
        });

        dpda.setInputString("aaabbb");



        dpda.addStateByLabel("A", false);
        dpda.addStateByLabel("B", true);



        dpda.addTransitionByStateLabelsAndCharacter("A", "a", "Z", "XZ", "A");


        expect(function() {
            dpda.addTransitionByStateLabelsAndCharacter("A", "", "Z", "XZ", "A");
        }).toThrow();



        dpda.addTransitionByStateLabelsAndCharacter("A", "a", "X", "XX", "A");


        dpda.addTransitionByStateLabelsAndCharacter("A", "b", "X", "", "B");

        dpda.addTransitionByStateLabelsAndCharacter("B", "b", "X", "", "B");



        dpda.setInitialStateByLabel("A");

        dpda.run(100);;



        expect(dpda.getIsHalted()).toBe(true);
        expect(dpda.getIsAccepted()).toBe(true);


        dpda.setInputString("aabbb");
        dpda.reset();
        dpda.run(100);

        expect(dpda.getIsHalted()).toBe(true);
        expect(dpda.getIsAccepted()).toBe(false);


        dpda.setInputString("");
        dpda.reset();
        dpda.run(100);

        expect(dpda.getIsHalted()).toBe(true);
        expect(dpda.getIsAccepted()).toBe(false);

    });


    it("DPDA for a^nb^n (Accepting by empty stack) a^{n}b^{n+1}", function() {

        var dpda = new Machine.DPDA({
            initialStackSymbol: "Z"
        });

        dpda.setInputString("aaabbbb");



        dpda.addStateByLabel("A", false);
        dpda.addStateByLabel("B", false);
        dpda.addStateByLabel("C", false);
        dpda.addStateByLabel("D", false);

        // addTransitionByStateLabelsAndCharacter: function(conditionStateLabel, currentCharacter, conditionStackElement, transitionStackString, transitionStateLabel) 

        dpda.addTransitionByStateLabelsAndCharacter("A", "a", "Z", "XZ", "A");

        dpda.addTransitionByStateLabelsAndCharacter("A", "a", "X", "XX", "A");


        dpda.addTransitionByStateLabelsAndCharacter("A", "b", "X", "", "B");

        dpda.addTransitionByStateLabelsAndCharacter("B", "b", "X", "", "B");


        dpda.addTransitionByStateLabelsAndCharacter("B", "b", "Z", "Z", "C");



        dpda.addTransitionByStateLabelsAndCharacter("C", "", "Z", "", "D");


        dpda.setInitialStateByLabel("A");


        dpda.run(100);;



        expect(dpda.getIsHalted()).toBe(true);
        expect(dpda.getIsAccepted()).toBe(true);



        dpda.setInputString("aaabbb");
        dpda.reset();
        dpda.run(100);

        expect(dpda.getIsHalted()).toBe(true);
        expect(dpda.getIsAccepted()).toBe(false);

    });


});
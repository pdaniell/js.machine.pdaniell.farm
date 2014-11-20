describe("Alphabet Test Suite", function() {
    

    it("Simple Alphabet Constructor Test", function() {

        var alphabet = new Machine.Alphabet({
        	blank:"A", 
        	chars:"AB"}); 

        expect(alphabet.contains("A")).toBe(true); 
        expect(alphabet.contains("D")).toBe(false); 
        expect(alphabet.getBlank()).toBe("A"); 


        expect(alphabet.isCompatibleWith("ABABAAAAAAB")).toBe(true);
        expect(alphabet.isCompatibleWith("ABC")).toBe(false);

    });



    it("Tally Notation", function() {

        var alphabet = Machine.Alphabet.TALLY_NOTATION; 

        expect(alphabet.contains("0")).toBe(true); 
        expect(alphabet.contains("1")).toBe(true); 
		expect(alphabet.getBlank()).toBe("0"); 

    });



});

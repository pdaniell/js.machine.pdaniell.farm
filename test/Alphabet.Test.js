describe("Alphabet Test Suite", function() {
    

    it("Binary Alphabet", function() {

        var alphabet = new Machine.Alphabet({
        	blank:"A", 
        	chars:"AB"}); 

        expect(alphabet.contains("A")).toBe(true); 
        expect(alphabet.contains("D")).toBe(false); 


    });


});

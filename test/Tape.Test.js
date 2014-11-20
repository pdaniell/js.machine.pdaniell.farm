describe("Tape Test Suite", function() {

    it("Basic Tape Constructor", function() {


        var alphabet = Machine.Alphabet.TALLY_NOTATION;

        var tape = new Machine.Tape({
            alphabet: alphabet,
            chars: "0101"
        });

        expect(tape.length()).toBe(4);

        expect(function() {
            tape.setChars("2030")
        }).toThrow(new Error("Incompatible alphabet for contents."));



        expect(tape.getChars()).toBe("0101"); 

        expect(tape.hasCharAt(3)).toBe(true); 

        expect(tape.hasCharAt(4)).toBe(false); 


    });



});
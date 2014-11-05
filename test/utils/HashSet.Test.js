describe("HashSet Test Suite", function() {


    it("Simple HashSet", function() {

        var hashSet = new Machine.HashSet();
        hashSet.add("ABC");

        expect(hashSet.contains("ABC")).toBe(true);

    });





});

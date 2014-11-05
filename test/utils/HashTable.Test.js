describe("HashTable Test Suite", function() {


    it("Simple HashTable", function() {

        var hashTable = new Machine.HashTable();
        hashTable.put("ABC", "DEF");

        expect(hashTable.get("ABC")).toBe("DEF");

    });


});

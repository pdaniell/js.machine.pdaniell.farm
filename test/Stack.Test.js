describe("Stack Test Suite", function() {


    it("Basic Stack Constructor Test", function() {

        var stack = new Machine.Stack(); 
        stack.push("a"); 
        stack.push("b"); 
        stack.push("c"); 
        stack.push("d"); 
        expect(stack.pop()).toBe("d"); 
        expect(stack.pop()).toBe("c"); 
        expect(stack.poppush("z")).toBe("b"); 
        expect(stack.pop()).toBe("z"); 
        


    });


});

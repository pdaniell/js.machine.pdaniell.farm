describe("StateTable Test Suite", function() {


    it("Basic StateTable Constructor Test", function() {


        var controlState = new Machine.State({label:"A", isAccepting:false}); 
        var controlState2 = new Machine.State({label:"B", isAccepting:true}); 

        var stateTable = new Machine.StateTable(); 

        expect(stateTable.length()).toBe(0); 
        expect(stateTable.contains(controlState)).toBe(false); 
        expect(stateTable.getStateFromLabel(null)).toBe(false); 
        expect(stateTable.contains(null)).toBe(false); 
        expect(stateTable.contains(stateTable.getStateFromLabel("A"))).toBe(false); 
         


        stateTable.add(controlState);
        expect(stateTable.length())
            .toBe(1); 


        expect(stateTable.contains(stateTable.getStateFromLabel("A"))).toBe(true); 
        
        stateTable.remove("A"); 

        expect(stateTable.contains(stateTable.getStateFromLabel("A"))).toBe(false); 


        expect(stateTable.length())
            .toBe(0); 
        

    });


});

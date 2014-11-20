describe("TransitionFunction Test Suite", function() {

    it("Basic DFA TransitionFunction Constructor", function() {


        var alphabet = Machine.Alphabet.TALLY_NOTATION;

        
        var cs = new Machine.State({label:"A", isAccepting:false}); 
        var cs2 = new Machine.State({label:"B", isAccepting:false}); 
        var as = new Machine.State({label:"C", isAcepting:true}); 

        var table = new Machine.StateTable(); 

        table.add(cs); 
        //stateTable.add(cs2);
        table.add(as); 

        var txFunction = new Machine.TransitionFunction({
            stateTable: table, 
            alphabet: alphabet

        }); 

        var condition1 = new Machine.Condition({state: cs, character: "0"});

        var command1 = new Machine.Command({state:cs}); 

        txFunction.add(condition1, command1); 

    });



});2
(function() {

    /**
     * A utility class with static color codes. 
     * 
     * @class ANSI
     * @memberof Machine
     *
     **/
    Machine.ANSI = function() {};


    /** @static */
    Machine.ANSI.ANSI_RESET = "\u001B[0m";

    /** @static */
    Machine.ANSI.ANSI_BLACK = "\u001B[30m";


    /** @static */
    Machine.ANSI.ANSI_LIGHT_GRAY= "\u001B[37m";

    /** @static */
    Machine.ANSI.ANSI_DARK_GRAY= "\u001B[90m";

    
    /** @static */
    Machine.ANSI.ANSI_RED = "\u001B[31m";

    /** @static */
    Machine.ANSI.ANSI_GREEN = "\u001B[32m";

    /** @static */
    Machine.ANSI.ANSI_YELLOW = "\u001B[33m";

    /** @static */
    Machine.ANSI.ANSI_BLUE = "\u001B[34m";

    /** @static */
    Machine.ANSI.ANSI_PURPLE = "\u001B[35m";

    /** @static */
    Machine.ANSI.ANSI_CYAN = "\u001B[36m";

    /** @static */
    Machine.ANSI.ANSI_WHITE = "\u001B[37m";

    /** @static  */
    Machine.ANSI.ANSI_BOLD = "\u001B[1m"; 

    /** @static  */
    Machine.ANSI.ANSI_BOLD_RESET = "\u001B[21m"; 

    
    Machine.ANSI.ANSI_INVERT = "\u001B[7m"; 

    /** @static  */
    Machine.ANSI.ANSI_INVERT_RESET = "\u001B[27m"; 

    



    Machine.ANSI.colorize = function(input, color) { 

        var s = "" + color; 
        s  = s + input; 
        s  = s + Machine.ANSI.ANSI_RESET;
        return s; 
    }; 

    Machine.ANSI.embolden = function(input) { 
        return Machine.ANSI.ANSI_BOLD + 
                input + 
                Machine.ANSI.ANSI_BOLD_RESET; 

    }

     Machine.ANSI.invert = function(input) { 
        return Machine.ANSI.ANSI_INVERT + 
                input + 
                Machine.ANSI.ANSI_INVERT_RESET; 

    }

})(); 




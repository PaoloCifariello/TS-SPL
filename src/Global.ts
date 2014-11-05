var GLOB = {

    VERBOSE: false,
    SHOW_ERROR: true,

    EXECUTING_ASSIGN_STATE: (ar?) => GLOB.INFO("Executing Assignment state", ar),
    EXECUTING_IF_THEN_STATE: (ar?) => GLOB.INFO("Executing If-Then state", ar),
    EXECUTING_IF_THEN_ELSE_STATE: (ar?) => GLOB.INFO("Executing If-Then-Else state", ar),
    EXECUTING_WHILE_STATE: (ar?) => GLOB.INFO("Executing While state", ar),
    EXECUTING_FUN_DECLARATION_STATE: (ar?) => GLOB.INFO("Executing Function-Declaration state", ar),
    EXECUTING_FUN_EXECUTION_STATE: (ar?) => GLOB.INFO("Executing Function-Execution state", ar),
    EXECUTING_RETURN_STATE: (ar?) => GLOB.INFO("Executing Return state", ar),

    MISSING_ASSIGN_TOKEN: (ar?) => GLOB.ERROR("Missing assign token", ar),
    MISSING_SEMICOLON_TOKEN: (ar?) => GLOB.ERROR("Missing semicolon token", ar),
    MISSING_L_BRACE_TOKEN: (ar?) => GLOB.ERROR("Missing l_brace token", ar),
    MISSING_R_BRACE_TOKEN: (ar?) => GLOB.ERROR("Missing r_brace token", ar),
    MISSING_L_PAREN_TOKEN: (ar?) => GLOB.ERROR("Missing r_parem token", ar),
    MISSING_R_PAREN_TOKEN: (ar?) => GLOB.ERROR("Missing l_parem token", ar),
    MISSING_QUOTE_TOKEN: (ar?) => GLOB.ERROR("Missing quote token", ar),

    WARN_NO_OPTIONS: (ar?) => GLOB.WARN("Please provide an option\n-t -> to execute tests\n-s filename -> to execute filename", ar),
    
    
    ERROR_PARSING_PROGRAM: (ar?) => GLOB.ERROR("Missing while parsing Program", ar),
    ERROR_PARSING_EXPRESSION: (ar?) => GLOB.ERROR("Error while parsing Expression", ar),
    ERROR_PARSING_ASSIGNMENT: (ar?) => GLOB.ERROR("Error while parsing Assignment", ar),
    ERROR_EXPECTED_ALPHANUMERIC: (ar?) => GLOB.ERROR("Expected alphanumeric value", ar),
    
    
    TEST : [
        "../test/math/math.3l",
        "../test/object/object.3l",
        "../test/object/function.3l",
        "../test/recursion/factorial.3l",
        "../test/recursion/fibonacci.3l",
        "../test/require/require.3l"
    ],

    INFO: function (str, ar) {
        if (GLOB.VERBOSE) {
            console.log("Info : " + str);
            if (ar)
                console.log(ar);
        }
    },

    WARN: function (str, ar) {
        console.warn("Warning : " + str);
        if (ar)
            console.warn(ar);
    },
    
    ERROR: function (str, ar) {
        if (GLOB.SHOW_ERROR) {
            console.error("Error : " + str);
            if (ar)
                console.error(ar);
        }
    }
};
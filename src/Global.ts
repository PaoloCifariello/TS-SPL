export class glob {

    public static VERBOSE =  false;
    public static SHOW_ERROR = true;

    public static EXECUTING_ASSIGN_STATE = (ar?) => glob.INFO("Executing Assignment state", ar);
    public static EXECUTING_IF_THEN_STATE = (ar?) => glob.INFO("Executing If-Then state", ar);
    public static EXECUTING_IF_THEN_ELSE_STATE = (ar?) => glob.INFO("Executing If-Then-Else state", ar);
    public static EXECUTING_WHILE_STATE = (ar?) => glob.INFO("Executing While state", ar);
    public static EXECUTING_FUN_DECLARATION_STATE = (ar?) => glob.INFO("Executing Function-Declaration state", ar);
    public static EXECUTING_FUN_EXECUTION_STATE = (ar?) => glob.INFO("Executing Function-Execution state", ar);
    public static EXECUTING_RETURN_STATE = (ar?) => glob.INFO("Executing Return state", ar);

    public static MISSING_ASSIGN_TOKEN = (ar?) => glob.ERROR("Missing assign token", ar);
    public static MISSING_SEMICOLON_TOKEN = (ar?) => glob.ERROR("Missing semicolon token", ar);
    public static MISSING_L_BRACE_TOKEN = (ar?) => glob.ERROR("Missing l_brace token", ar);
    public static MISSING_R_BRACE_TOKEN = (ar?) => glob.ERROR("Missing r_brace token", ar);
    public static MISSING_L_PAREN_TOKEN = (ar?) => glob.ERROR("Missing r_parem token", ar);
    public static MISSING_R_PAREN_TOKEN = (ar?) => glob.ERROR("Missing l_parem token", ar);
    public static MISSING_QUOTE_TOKEN = (ar?) => glob.ERROR("Missing quote token", ar);

    public static WARN_NO_OPTIONS = (ar?) => glob.WARN("Please provide an option\n-t -> to execute tests\n-s filename -> to execute filename", ar);


    public static ERROR_PARSING_PROGRAM = (ar?) => glob.ERROR("Missing while parsing Program", ar);
    public static ERROR_PARSING_EXPRESSION = (ar?) => glob.ERROR("Error while parsing Expression", ar);
    public static ERROR_PARSING_ASSIGNMENT = (ar?) => glob.ERROR("Error while parsing Assignment", ar);
    public static ERROR_EXPECTED_ALPHANUMERIC = (ar?) => glob.ERROR("Expected alphanumeric value", ar);


    public static TEST = [
        "../test/math/math.3l",
        "../test/object/object.3l",
        "../test/object/function.3l",
        "../test/recursion/factorial.3l",
        "../test/recursion/fibonacci.3l",
        "../test/require/require.3l"
    ];

    public static INFO(str, ar) {
        if (glob.VERBOSE) {
            console.log("Info : " + str);
            if (ar)
                console.log(ar);
        }
    }

    public static WARN(str, ar) {
        console.warn("Warning : " + str);
        if (ar)
            console.warn(ar);
    }

    public static ERROR(str, ar) {
        if (glob.SHOW_ERROR) {
            console.error("Error : " + str);
            if (ar)
                console.error(ar);
        }
    }
}
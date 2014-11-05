var argv = require("optimist").argv;

function executeFile(file) {
    var interp = Interpreting.Interpreter.FromFile(file);
    interp.Init();
    interp.Run();
}

function executeTests() {
    GLOB.TEST.forEach(function (test) {
        var ind = test.lastIndexOf('/');
        var name = test.substring(ind + 1);

        console.log("Executing test: " + name);
            
        var time = Date.now();
        executeFile(__dirname + '/' + test);
        time = Date.now() - time;

        console.log("Test " + name + " executed in " + time + " ms\n");
    });   
}


function main() {
    executeTests();
}

main();
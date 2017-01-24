import {Interpreter} from "./Interpreter/Interpreter";
import {glob} from "./global";

const argv = require('minimist')(process.argv.slice(2));
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//var argv = require("optimist").argv;

function executeFile(file) {
    var interp = Interpreter.FromFile(file);
    interp.Init();
    interp.Run();
}

function executeTests() {
    glob.TEST.forEach(function (test) {
        var ind = test.lastIndexOf('/');
        var name = test.substring(ind + 1);

        console.log("Executing test: " + name);

        var time = Date.now();
        executeFile(test);
        time = Date.now() - time;

        console.log("Test " + name + " executed in " + time + " ms\n");
    });
}


function main() {
    if (argv._.length > 0) {
        executeFile(argv._[0]);
    } else if (argv.t) {
        executeTests();
    } else {
        var interp :Interpreter = new Interpreter();

        rl.on('line', (input) => {
            interp.getNextInput(input);
            interp.Init ();
            interp.Run ();
        });
    }
}

main();
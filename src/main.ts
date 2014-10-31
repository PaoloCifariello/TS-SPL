function main() {
    var tests = [
        "test/math/math.3l",
        "test/object/object.3l",
        "test/object/function.3l",
        "test/recursion/factorial.3l",
        "test/recursion/fibonacci.3l",
        "test/require/require.3l"
    ];

    tests.forEach(function (test) {
        var ind = test.lastIndexOf('/');
        var name = test.substring(ind + 1);

        console.log("Executing test: " + name);

        var interp = Interpreting.Interpreter.FromFile(test);
        interp.Init();
        var time = Date.now();
        interp.Run();
        time = Date.now() - time;

        console.log("Test " + name + " executed in " + time + " ms\n");
    });
}

main();
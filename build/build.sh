#!/bin/bash

# We move into src directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
cd ../src

echo "Building TS-SPL"
tsc -m commonjs -t ES5 lib/**/*.d.ts Global.ts **/*.ts main.ts --out main.js

echo "Done."
#!/bin/bash

# We move into src directory, regardless of the path from which we called this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
cd ..

echo "Building TS-SPL"
tsc --p ./tsconfig.json
echo "Done."
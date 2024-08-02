#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH=/Users/davidlim/Desktop/CPSC304/instantclient:$DYLD_LIBRARY_PATH

# Start Node application
exec node app.js
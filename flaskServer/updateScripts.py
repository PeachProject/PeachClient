#!/usr/bin/env python
import argparse
import subprocess
import os
import signal
import sys
import atexit
import time

def browserify(input, output):
    for file in os.listdir(input):
        if file.endswith(".js"):
            inputfile = input.strip("/") + "/" + file
            outputfile = output.strip("/") + "/" + file
            subprocess.call(["browserify", inputfile, "-o", outputfile])
            print("minify " + outputfile)
            #subprocess.call(["minify", outputfile])
            #At the moment no tool can syntatically check the complex file

def updateScripts():
    inputLocation = "frontEnd/glueCode"
    outputLocation = "frontEnd/static/js/glueCode/bundles"
    browserify(inputLocation, outputLocation)
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='This script should be used to start the flask server properly.')
    parser.add_argument("-browserify_input", "--bi", help="The folder to the browserify glue codes", type=str, default="frontEnd/glueCode", required=False)
    parser.add_argument("-browserify_output", "--bo", help="The output files for the bundled browserify glue code", type=str, default="frontEnd/static/js/glueCode/bundles", required=False)
    args = parser.parse_args()
    browserify(args.bi, args.bo)

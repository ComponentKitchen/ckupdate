#!/bin/bash

# Command line build tool to prepare node_module directories for tests
# usage: preptests

EXPECTED_ARGS=0
E_BADARGS=65
PACKAGE_NAME=""
BUILD_TARGET=""
BRANCH_NAME=""
CURRENT_LOCAL_BRANCH=""

set -o pipefail     # trace ERR through pipes
set -o errtrace     # trace ERR through 'time command' and other functions

error_handler()
{
  JOB="$0"          # job name
  LASTLINE="$1"     # line of error occurrence
  LASTERR="$2"      # error code
  echo "ERROR in ${JOB} : line ${LASTLINE} with exit code ${LASTERR}"
  exit 1
}

trap 'error_handler ${LINENO} ${$?}' ERR

usage()
{
  echo "preptests - command line tool to prepare node_module directories for tests"
  echo "usage: ./preptests.sh"
  echo ""
}

loopDirs()
{
  for path in ./server/cases/test*; do
    [ -d "${path}" ] || continue # if not a directory, skip
    dirname="$(basename "${path}")"
    echo ""
    echo "******************************"
    echo "Found $dirname. Clearing its node_modules and running npm install"
    echo "******************************"
    echo ""
    cd server/cases
    cd $dirname
    rm -rf node_modules
    npm install
    cd ../../../
  done
}

#
# Check for expected arguments
#
if [ $# -gt $EXPECTED_ARGS ]
then
  usage
  exit $E_BADARGS
fi

loopDirs

echo ""
echo "Tests are now prepared with updated node_modules. Run grunt test."


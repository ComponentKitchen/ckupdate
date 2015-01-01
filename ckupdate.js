/*
 *  ckupdate utility
 */

var Promise = require( "bluebird" );
var fs = Promise.promisifyAll( require( "fs" ) );
var logger = require( "./logger").logger( "ckupdate" );
var PackageAnalyzer = require( "./lib/packageAnalyzer" );

function processCommandLine( args ) {
  if ( args.length < 0 ) {
    usage();
    return false;
  }

  for ( var i = 0; i < args.length; i++ ) {
    switch( args[i] ) {
      default:
        break;
    }
  }

  return true;
}

function usage() {
  console.log( "ckupdate: node ckupdate.js" );
}

function execute() {
  if ( !processCommandLine( process.argv ) ) {
    return;
  }

  var packageAnalyzer = new PackageAnalyzer();
  return packageAnalyzer.analyzeTree( process.cwd() )
  .then( function() {

  })
  .catch( function( error ) {
    console.log( "ERR: " + error );
  });
}

execute();

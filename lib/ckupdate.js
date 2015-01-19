/*
 *  ckupdate utility
 */

var Promise = require( "bluebird" );
var fs = Promise.promisifyAll( require( "fs" ) );
var logger = require( "../logger").logger( "ckupdate" );
var PackageAnalyzer = require( "./packageAnalyzer" );
var FlatWriter = require( "./flatWriter" );
var folderName = "bower_components";

function processCommandLine( args ) {
  if ( args.length < 0 ) {
    usage();
    return false;
  }

  for ( var i = 0; i < args.length; i++ ) {
    switch( args[i] ) {
      case "-h":
      case "-help":
      case "-?":
      case "?":
        usage();
        return false;

      case "-o":
        if ( ++i >= args.length ) {
          usage();
          return false;
        }
        folderName = args[ i ];
        break;

      default:
        break;
    }
  }

  return true;
}

function usage() {
  console.log( "ckupdate: node ckupdate.js [-o folderName]" );
}

function execute() {
  if ( !processCommandLine( process.argv ) ) {
    return;
  }

  var cwd = process.cwd();
  // Note: Since we build destination as a folder off the current working directory,
  // we don't need to worry about ckupdate being used to blow away a critical system
  // directory unless the user sets the working directory to, say, root and specifies
  // a folder name like "etc". This would require conscious mischievousness on the part
  // of the user.
  var destination = cwd + "/" + folderName;
  var packageAnalyzer = new PackageAnalyzer();

  return packageAnalyzer.analyzeTree( process.cwd() )
  .then( function() {
    var flatWriter = new FlatWriter( packageAnalyzer.getPackages(), destination );
    return flatWriter.write();
  })
  .catch( function( error ) {
    console.log( "ERR: " + error );
  });
}

execute();

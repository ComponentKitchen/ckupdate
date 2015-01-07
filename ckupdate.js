/*
 *  ckupdate utility
 */

var Promise = require( "bluebird" );
var fs = Promise.promisifyAll( require( "fs" ) );
var logger = require( "./logger").logger( "ckupdate" );
var PackageAnalyzer = require( "./lib/packageAnalyzer" );
var FlatWriter = require( "./lib/flatWriter" );
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

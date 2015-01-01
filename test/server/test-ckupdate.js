//
// Unit tests for ckupdate
//

var Promise = require( "bluebird" );
var path = require( "path" );
var should = require( "chai" ).should();
var PackageAnalyzer = require( "../../lib/packageAnalyzer" );
var FlatWriter = require( "../../lib/flatWriter" );
var packageAnalyzer;
var rootDirectory;

describe( "ckupdate", function() {

  this.timeout( 30000 );

  before( function( done ) {
    packageAnalyzer = new PackageAnalyzer();
    packageAnalyzer.setLoggerLevel( "error" );
    rootDirectory = process.cwd();
    done();
  });

  it( "should flatten the packages in cases/test1", function( done ) {
    var flatWriter;

    packageAnalyzer.analyzeTree( rootDirectory + "/test/server/cases/test1" )
    .then( function() {
      flatWriter = new FlatWriter(
        packageAnalyzer.getPackages(),
        rootDirectory + "/test/server/cases/test1/bower_components" );

      return flatWriter.deleteAll();
    })
    .then( function() {
      return flatWriter.write();
    })
    .then( function() {
      return flatWriter.deleteAll();
    })
    .done( function() {
      done();
    });
  });
});
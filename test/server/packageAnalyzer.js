//
// Unit tests for packageAnalyzer
//

var Promise = require( "bluebird" );
var path = require( "path" );
var should = require( "chai" ).should();
var PackageAnalyzer = require( "../../lib/packageAnalyzer" );
var packageAnalyzer;

describe( "packageAnalyzer", function() {

  before( function( done ) {
    packageAnalyzer = new PackageAnalyzer();
    packageAnalyzer.setLoggerLevel( "error" );
    done();
  });

  beforeEach( function( done ) {
    done();
  });

  afterEach( function( done ) {
    done();
  });

  it( "should have the current directory set to test/server/cases/test1", function( done ) {
    process.chdir( "./test/server/cases/test1" );
    var currentDirectory = packageAnalyzer.getCurrentDirectory();
    should.exist( currentDirectory );
    path.basename( currentDirectory).should.equal( "test1" );
    done();
  });

});

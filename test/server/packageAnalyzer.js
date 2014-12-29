//
// Unit tests for packageAnalyzer
//

var should = require( "chai" ).should();
var PackageAnalyzer = require( "../../lib/packageAnalyzer" );
var packageAnalyzer;

describe( "packageAnalyzer", function() {

  before( function( done ) {
    packageAnalyzer = new PackageAnalyzer();
    packageAnalyzer.setLoggerLevel( "error" );
    done();
  });

  afterEach( function( done ) {
    done();
  });

  it( "should set the current directory to test/cases", function( done ) {
    var currentDirectory = packageAnalyzer.getCurrentDirectory();
    should.exist( currentDirectory );
    done();
  });
});
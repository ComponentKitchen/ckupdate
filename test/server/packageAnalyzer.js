//
// Unit tests for packageAnalyzer
//

var Promise = require( "bluebird" );
var path = require( "path" );
var should = require( "chai" ).should();
var PackageAnalyzer = require( "../../lib/packageAnalyzer" );
var packageAnalyzer;
var rootDirectory;

describe( "packageAnalyzer", function() {

  before( function( done ) {
    packageAnalyzer = new PackageAnalyzer();
    packageAnalyzer.setLoggerLevel( "error" );
    rootDirectory = process.cwd();
    done();
  });

  beforeEach( function( done ) {
    done();
  });

  afterEach( function( done ) {
    done();
  });

  /*
  it( "should have the current directory set to test/server/cases/test1", function( done ) {
    process.chdir( rootDirectory + "/test/server/cases/test1" );
    var currentDirectory = process.cwd();
    should.exist( currentDirectory );
    path.basename( currentDirectory).should.equal( "test1" );
    done();
  });
  */

  it( "should read the package.json file in cases/test1", function( done ) {
    packageAnalyzer.loadPackageJson( rootDirectory + "/test/server/cases/test1" )
    .then( function( json ) {
      should.exist( json );
      should.exist( json.name );
      should.exist( json.dependencies );
      json.name.should.equal( "testproj" );
    })
    .done( function() {
      done();
    });
  });

  it ( "should handle a non-existent package.json file ", function( done ) {
    packageAnalyzer.loadPackageJson( rootDirectory + "/bogus/path/to/nowhere" )
    .then( function( json ) {
      should.not.exist( json );
    })
    .done( function() {
      done();
    });
  });

  it( "should analyze the /cases/test1/node_modules path", function( done ) {
    packageAnalyzer.analyzeNodeModulesPath( rootDirectory + "/test/server/cases/test1/node_modules" )
    .then( function() {
      should.exist( packageAnalyzer.packages );
      packageAnalyzer.numPackages().should.equal( 1 );
    })
    .done( function() {
      done();
    });
  });
});

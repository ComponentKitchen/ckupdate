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
      packageAnalyzer.numPackages().should.equal( 1 );
      var packageArray = packageAnalyzer.getPackageArray( "printable-wall-calendar" );
      should.exist( packageArray );
      packageArray.length.should.equal( 1 );
      var packageItem = packageArray[ 0 ];
      packageItem.packageName.should.equal( "printable-wall-calendar" );
      packageItem.isPrimaryVersion.should.equal( true );
      packageItem.packageVersion.should.equal( "2.0.0" );
      should.exist( packageItem.sourcePath );
    })
    .done( function() {
      done();
    });
  });

  it( "should analyze the /cases/test1/node_modules/printable-wall-calendar/node_modules path", function( done ) {
    packageAnalyzer.clear();
    packageAnalyzer.analyzeNodeModulesPath(
      rootDirectory + "/test/server/cases/test1/node_modules/printable-wall-calendar/node_modules" )
    .then( function() {
      packageAnalyzer.numPackages().should.equal( 5 );
      var packageArray = packageAnalyzer.getPackageArray( "basic-button" );
      should.exist( packageArray );
      packageArray.length.should.equal( 1 );
      var packageItem = packageArray[ 0 ];
      packageItem.packageName.should.equal( "basic-button" );
      packageItem.isPrimaryVersion.should.equal( true );
      packageArray = packageAnalyzer.getPackageArray( "basic-calendar-month" );
      should.exist( packageArray );
      packageArray.length.should.equal( 1 );
      packageArray = packageAnalyzer.getPackageArray( "basic-culture-selector" );
      should.exist( packageArray );
      packageArray.length.should.equal( 1 );
      packageArray = packageAnalyzer.getPackageArray( "basic-days-of-week" );
      should.exist( packageArray );
      packageArray.length.should.equal( 1 );
      packageArray = packageAnalyzer.getPackageArray( "polymer" );
      should.exist( packageArray );
      packageArray.length.should.equal( 1 );
    })
    .done( function() {
      done();
    });
  });

  it ( "should recursively analyze the entire tree for /cases/test1", function( done ) {
    packageAnalyzer.clear();
    packageAnalyzer.analyzeTree( rootDirectory + "/test/server/cases/test1" )
    .then( function() {
      packageAnalyzer.numPackages().should.equal( 21 );
      var packages = packageAnalyzer.getPackages();
      var packageArray = packageAnalyzer.getPackageArray( "basic-culture-selector" );
      should.exist( packageArray );
      packageArray = packageAnalyzer.getPackageArray( "polymer" );
      should.exist( packageArray );
    })
    .done( function() {
      done();
    });
  });

  it( "should recursively analyze the tree for /cases/test2 and find two versions of basic-element", function( done ) {
    packageAnalyzer.clear();
    packageAnalyzer.analyzeTree( rootDirectory + "/test/server/cases/test2" )
    .then( function() {
      packageAnalyzer.numPackages().should.equal( 13 );
      var packages = packageAnalyzer.getPackages();
      var packageArray = packageAnalyzer.getPackageArray( "basic-element" );
      should.exist( packages );
      should.exist( packageArray );
      packageArray.length.should.equal( 2 );
      for ( var i = 0; i < packageArray.length; i++ ) {
        var packageItem = packageArray[ i ];
        if ( packageItem.version == "0.0.1" ) {
          packageItem.isPrimary.should.equal( false );
        }
        if ( packageItem.version == "0.0.1000" ) {
          packageItem.isPrimary.should.equal( true );
        }
      }
    })
    .done( function() {
      done();
    });
  });
});

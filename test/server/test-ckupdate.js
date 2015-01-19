//
// Unit tests for ckupdate
//

var Promise = require( "bluebird" );
var path = require( "path" );
var fs = Promise.promisifyAll( require( "fs-extra" ) );
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
    var destination = rootDirectory + "/test/server/cases/test1/bower_components";

    packageAnalyzer.clear();
    packageAnalyzer.analyzeTree( rootDirectory + "/test/server/cases/test1" )
    .then( function() {
      flatWriter = new FlatWriter( packageAnalyzer.getPackages(), destination );
      return flatWriter.deleteAll();
    })
    .then( function() {
      return flatWriter.write();
    })
    .then( function() {
      return fs.readdirAsync( destination );
    })
    .then( function( directories ) {
      should.exist( directories );
      directories.length.should.equal( 21 );
    })
    .then( function() {
      // Repeat the experiment, but test that flatWriter.write() first clears the output tree
      packageAnalyzer.clear();
      return packageAnalyzer.analyzeTree( rootDirectory + "/test/server/cases/test1" )
    })
    .then( function() {
      flatWriter = new FlatWriter( packageAnalyzer.getPackages(), destination );
      return flatWriter.write();
    })
    .then( function() {
      return fs.readdirAsync( destination );
    })
    .then( function( directories ) {
      should.exist( directories );
      directories.length.should.equal( 21 );
    })
    .then( function() {
      return flatWriter.deleteAll();
    })
    .done( function() {
      done();
    });
  });

  it( "should flatten the packages in cases/test2", function( done ) {
    var flatWriter;
    var destination = rootDirectory + "/test/server/cases/test2/bower_components";

    packageAnalyzer.clear();
    packageAnalyzer.analyzeTree( rootDirectory + "/test/server/cases/test2" )
    .then( function() {
      flatWriter = new FlatWriter( packageAnalyzer.getPackages(), destination );
      return flatWriter.deleteAll();
    })
    .then( function() {
      return flatWriter.write();
    })
    .then( function() {
      return fs.readdirAsync( destination );
    })
    .then( function( directories ) {
      should.exist( directories );
      directories.length.should.equal( 12 );
    })
    .then( function() {
      return flatWriter.deleteAll();
    })
    .done( function() {
      done();
    });
  });
});
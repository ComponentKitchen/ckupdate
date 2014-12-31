
var Promise = require( "bluebird" );
var logger = require( "../logger" ).logger( "packageAnalyzer" );
var fs = Promise.promisifyAll( require( "fs-extra" ) );
var path = require( "path" );
var promiseBatcher = require( "./promise-batcher" );
var PackageItem = require( "./packageItem" );

//
// The packages associative array contains keys corresponding to package names.
// The associated value for each key is an array of packageItems.
//
var packages = {};

function PackageAnalyzer()  {
}

PackageAnalyzer.prototype.setLoggerLevel = function( level ) {
  logger.level( level );
};

//
// Resets the packages associative array. This is primarily for
// unit test purposes.
//
PackageAnalyzer.prototype.clear = function() {
  packages = {};
};

//
// Returns the array of packages for a specified package name. This
// is primarily for unit test purposes.
//
// packageName: key provided for lookup into packages associative array
//
PackageAnalyzer.prototype.getPackageArray = function( packageName ) {
  return packages[ packageName ];
};

//
// Given an absolute path to a directory, attempts to load a package.json
// file contained within that directory. Returns the resulting json object
// if the package.json file is found, otherwise returns null.
//
// path: Absolute path to a directory suspected of containing a package.json file
//
PackageAnalyzer.prototype.loadPackageJson = function( path ) {
  return fs.readJsonAsync( path + "/package.json" )
  .then( function( json ) {
    return json;
  })
  .catch( function( error ) {
    logger.info( "loadPackageJson error: " + error );
    return null;
  });
};

//
// Walks through a /node_modules directory and analyzes the package directories
// contained within it. Makes use of the validateAndAddPackageItem method.
//
// nodeModulesPath: Absolute path to a node_modules directory
//
PackageAnalyzer.prototype.analyzeNodeModulesPath = function( nodeModulesPath ) {
  var params = { context: this, nodeModulesPath: nodeModulesPath };

  return fs.readdirAsync( nodeModulesPath )
  .then( function( directories ) {
    return promiseBatcher.batch( 20, directories, params, validateAndAddPackageItem );
  })
  .catch( function( error ) {
    logger.info( "analyzeNodeModulesPath error: " + error );
  });
};

function validateAndAddPackageItem( packageName, params ) {
  // Validate that packagePath is a directory containing a package.json file
  var packagePath = params.nodeModulesPath + "/" + packageName;

  return params.context.loadPackageJson( packagePath )
  .then( function( json ) {
    if ( !json ) {
      return;
    }

    var packageItem = new PackageItem( json.name, json.version, packagePath );

    var packageArray = packages[ packageItem.packageName ];
    if ( !packageArray ) {
      packageArray = [];
      packages[ packageItem.packageName ] = packageArray;
    }

    packageItem.addToPackageArray( packageArray );
  });
};

PackageAnalyzer.prototype.numPackages = function() {
  var size = 0;

  for ( var key in packages ) {
    if ( packages.hasOwnProperty( key ) ) {
      var packageArray = packages[ key ];
      size += packageArray.length;
    }
  }

  return size;
};

module.exports = PackageAnalyzer;


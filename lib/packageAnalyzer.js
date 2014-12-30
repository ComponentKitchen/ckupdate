
var Promise = require( "bluebird" );
var logger = require( "../logger" ).logger( "packageAnalyzer" );
var fs = Promise.promisifyAll( require( "fs-extra" ) );
var path = require( "path" );
var promiseBatcher = require( "./promise-batcher" );
var PackageItem = require( "./packageItem" );

var packages = {};

function PackageAnalyzer()  {
}

PackageAnalyzer.prototype.packages = packages;

PackageAnalyzer.prototype.setLoggerLevel = function( level ) {
  logger.level( level );
};

PackageAnalyzer.prototype.clear = function() {
  packages = {};
}

PackageAnalyzer.prototype.flatten = function( path ) {

};

PackageAnalyzer.prototype.analyzeNodeModulesPath = function( nodeModulesPath ) {
  var callback = this.validateAndAddPackageItem;
  var params = { context: this, nodeModulesPath: nodeModulesPath };

  return fs.readdirAsync( nodeModulesPath )
  .then( function( directories ) {
    return promiseBatcher.batch( 20, directories, params, callback );
  })
  .catch( function( error ) {
    logger.info( "analyzeNodeModulesPath error: " + error );
  });
};

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

PackageAnalyzer.prototype.validateAndAddPackageItem = function( packageName, params ) {
  // Validate that packagePath is a directory containing a package.json file
  var packagePath = params.nodeModulesPath + "/" + packageName;

  return params.context.loadPackageJson( packagePath )
  .then( function( json ) {
    if ( !json ) {
      return;
    }

    if ( shouldSavePackage( json.name, json.version ) ) {
      var packageItem = new PackageItem();
      packageItem.name = json.name;
      packageItem.version = json.version;
      packageItem.sourcePath = packagePath;
      packageItem.destinationPath = "???";

      packages[ packageItem.name ] = packageItem;
    }
  });
};

PackageAnalyzer.prototype.numPackages = function() {
  var size = 0;

  for ( var key in packages ) {
    if ( packages.hasOwnProperty( key ) ) size++;
  }

  return size;
};

function shouldSavePackage( packageName, packageVersion ) {
  var item = packages[ packageName ];
  if ( !item ) {
    return true;
  }

  // BUGBUG: TODO: logic for comparing version
  // if ( packageVersion > item.packageVersion)
  return true;
}

module.exports = PackageAnalyzer;


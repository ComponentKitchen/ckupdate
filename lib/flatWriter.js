var Promise = require( "bluebird" );
var fs = Promise.promisifyAll( require( "fs-extra" ) );
var promiseBatcher = require( "./promise-batcher" );
var logger = require( "../logger" ).logger( "flatWriter" );

function FlatWriter( packages, destinationPath ) {
  this.packages = packages;
  this.destinationPath = destinationPath;
}

//
// Write out the flattened tree of packages.
// The PackageAnalyzer packages associative array
// and the destination path are set in the constructor.
//
FlatWriter.prototype.write = function() {
  if ( !this.packages || !this.destinationPath ) {
    return;
  }

  var packages = this.packages;
  var destinationPath = this.destinationPath;

  // Start by blowing away the existing destination path
  // if it exists, before rebuilding it.
  return this.deleteAll()
  .then( function() {
    //
    // Prepare for using promise-batcher, which requires an array.
    // We need to convert the associative array into an array, in which
    // each element holds an array of same-named packages.
    //
    var packagesArray = [];
    for ( var key in packages ) {
      if ( packages.hasOwnProperty( key ) ) {
        packagesArray.push( packages[ key ] );
      }
    }

    return promiseBatcher.batch( 1, packagesArray, destinationPath, writePackage );
  });
};

//
// Delete the destination directory.
//
FlatWriter.prototype.deleteAll = function() {
  return fs.removeAsync( this.destinationPath );
};

//
// Search through a package array for the PackageItem with
// isPrimaryVersion==true and write out the tree to the
// destination path.
//
// packageArray: Array of versions of same-name packages.
// destinationPath: Path to flattened directory tree.
//
function writePackage( packageArray, destinationPath ) {
  if ( !packageArray || packageArray.length < 1 ) {
    return;
  }

  return promiseBatcher.batch( 1, packageArray, destinationPath, writePackageItem );
}

function writePackageItem( packageItem, destinationPath ) {
  if ( !packageItem.isPrimaryVersion ) {
    return;
  }

  var destination = destinationPath + "/" + packageItem.packageName;

  //
  // Start by reading the files/directories in the source path and then
  // deep copy each file/directory, excluding node_modules directories.
  //
  var params = { sourcePath: packageItem.sourcePath, destinationPath: destination };
  return fs.readdirAsync( packageItem.sourcePath )
  .then( function( files ) {
    return promiseBatcher.batch( 20, files, params, writePackageItemFileOrDirectory );
  })
  .catch( function( error ) {
    logger.info( "writePackageItem error: " + error );
  });
}

function writePackageItemFileOrDirectory( file, params ) {
  // Ignore node_modules directories
  if ( file == "node_modules" ) {
    return;
  }

  var source = params.sourcePath + "/" + file;
  var dest = params.destinationPath + "/" + file;
  //console.log( "Copying " + source + " to " + dest );
  return fs.copyAsync( source, dest )
  .catch( function( error ) {
    console.log( "Error: " + error );
  });
}

module.exports = FlatWriter;

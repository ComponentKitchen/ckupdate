var Promise = require( "bluebird" );
var logger = require( "../logger" ).logger( "packageAnalyzer" );
var semver = require( "semver" );

function PackageItem( packageName, packageVersion, sourcePath ) {
  this.packageName = packageName;
  this.packageVersion = packageVersion;
  this.sourcePath = sourcePath;
  this.isPrimaryVersion = false;
}

PackageItem.prototype.setLoggerLevel = function( level ) {
  logger.level( level );
};

//
// Adds to the packageAnalyzer's package array and sets the
// isPrimaryVersion flag appropriately.
//
// packageArray: The array associated with the packageName key from
// PackageAnalyzer. The packageArray may be empty but must be non-null.
//
PackageItem.prototype.addToPackageArray = function( packageArray ) {
  if ( packageArray.length < 1 ) {
    this.isPrimaryVersion = true;
    packageArray.push( this );
    return;
  }

  // Keep track of whether we've already got this version from somewhere in the tree
  var versionExists = false;

  for ( var i = 0; i < packageArray.length; i++ ) {
    var item = packageArray[ i ];
    var comparison = this.compare( item );
    versionExists = ( comparison == 0 );
    if ( comparison > 0 && item.isPrimaryVersion ) {
      item.isPrimaryVersion = false;
      this.isPrimaryVersion = true;

      // Found the previous primary version. No other items
      // in the array need to be checked.
      break;
    }
  }

  // Add this version to the packageArray only if we don't already have it
  if ( !versionExists ) {
    packageArray.push( this );
  }
};

PackageItem.prototype.compare = function( packageItem ) {
  if ( semver.eq( this.packageVersion, packageItem.packageVersion ) ) {
    return 0;
  }
  else if ( semver.lt( this.packageVersion, packageItem.packageVersion ) ) {
    return -1;
  }
  else {
    return 1;
  }
};


module.exports = PackageItem;

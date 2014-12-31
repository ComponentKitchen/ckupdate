var Promise = require( "bluebird" );
var logger = require( "../logger" ).logger( "packageAnalyzer" );

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

  for ( var item in packageArray ) {
    var comparison = this.compare( item );
    if ( comparison > 0 && item.isPrimaryVersion ) {
      item.isPrimaryVersion = false;
      this.isPrimaryVersion = true;

      // Found the previous primary version. No other items
      // in the array need to be checked.
      break;
    }
  }

  packageArray.push( this );

  return this.isPrimaryVersion;
};

PackageItem.prototype.compare = function( packageItem ) {
  if ( this.packageVersion == packageItem.packageVersion ) {
    return 0;
  }

  // BUGBUG: TODO: logic to compare semver
  return 1;
};


module.exports = PackageItem;

var Promise = require( "bluebird" );
var logger = require( "../logger" ).logger( "packageAnalyzer" );

function PackageItem() {
}

PackageItem.prototype.packageName = null;
PackageItem.prototype.sourcePath = null;
PackageItem.prototype.destinationPath = null;
PackageItem.prototype.packageVersion = null;

PackageItem.prototype.setLoggerLevel = function( level ) {
  logger.level( level );
};

module.exports = PackageItem;

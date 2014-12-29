
var Promise = require( "bluebird" );
var logger = require( "../logger" ).logger( "packageAnalyzer" );

function PackageAnalyzer() {

}

PackageAnalyzer.prototype.getCurrentDirectory = function() {
  return process.cwd();
};

PackageAnalyzer.prototype.setLoggerLevel = function( level ) {
  logger.level( level );
};

module.exports = PackageAnalyzer;


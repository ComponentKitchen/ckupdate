//
// Unit tests for packageItem
//

var Promise = require( "bluebird" );
var PackageItem = require( "../../lib/packageItem" );

describe( "packageItem", function() {

  it( "should create package items and compare versions", function( done ) {
    var packageItem = new PackageItem( "test-package", "0.3.1", "/bogus/path" );
    var packageItem2 = new PackageItem( "another-package", "1.0.0", "/another/path" );
    var packageItem3 = new PackageItem( "yet-another", "0.1.1", "/yet/another/path" );
    packageItem.compare( packageItem2 ).should.equal( -1 );
    packageItem.compare( packageItem3 ).should.equal( 1 );
    packageItem.compare( packageItem).should.equal( 0 );
    done();
  });
});

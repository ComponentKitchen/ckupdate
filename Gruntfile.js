var Promise = require( "bluebird" );
var path = require( "path" );
var fs = Promise.promisifyAll( require( "fs-extra" ) );
var promiseBatcher = require( "./lib/promise-batcher" );

module.exports = function( grunt ) {

  grunt.loadNpmTasks( "grunt-simple-mocha" );

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON( "package.json" ),

    simplemocha: {
      options: {
        reporter: "list"
      },
      server: {
        src: [
          "test/*.js",
          "test/*/*.js"
        ]
      }
    },

    watch: {
      server: {
        files: [
          "server/*.js",
          "server/*/*.js",
          "test/server/*.js"
        ],
        tasks: [ "simplemocha" ]
      }
    }
  });

  // Default task(s).
  grunt.registerTask( "default", [ "ckupdate" ]);

  grunt.registerTask( "test", [ "simplemocha" ]);

  grunt.registerTask( "prepare-tests", "Prepare the unit tests by running npm install", function() {
    var casesRoot = "./test/server/cases/";
    var done = this.async();
    fs.readdirAsync( "./test/server/cases/" )
    .then( function( files ) {
      var testDirs = [];
      for ( var i = 0; i < files.length; i++ ) {
        var path = casesRoot + files[ i ];
        if ( fs.lstatSync( path ).isDirectory() ) {
          testDirs.push( path );
        }
      }

      return testDirs;
    })
    .then( function( testDirs ) {
      return promiseBatcher.batch( 1, testDirs, null, cleanAndNpmInstall );
    })
    .done( done );
  });

  grunt.registerTask( "ckupdate", "Execute the ckupdate tool", function() {
    var done = this.async();
    var childProcess = require( "child_process" );
    var worker = childProcess.spawn( "node", [ "ckupdate.js" ] );
    worker.stdout.pipe( process.stdout );
    worker.stderr.pipe( process.stderr );
    done();
  });

};

function cleanAndNpmInstall( testDir ) {
  var cwd = process.cwd();
  console.log( "Working directory: " + cwd );
  console.log( "Removing directory: " + testDir + "/node_modules/" );
  return fs.removeAsync( testDir + "/node_modules/" )
  .then( function() {
    var promise = new Promise( function( resolve, reject ) {
      console.log( "Changing dir to: " + testDir );
      process.chdir( testDir );
      var childProcess = require( "child_process" );
      console.log( "Running npm install" );
      var worker = childProcess.exec( "npm install" );
      worker.stdout.pipe( process.stdout );
      worker.stderr.pipe( process.stderr );
      worker.on( "close", function() {
        console.log( "On close -- changing directory to: " + cwd );
        process.chdir( cwd );
        resolve();
      });
      worker.on( "error", function() {
        console.log( "On error -- changing directory to: " + cwd );
        process.chdir( cwd );
      });
    });

    return promise;
  });
}

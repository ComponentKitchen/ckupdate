var Promise = require( "bluebird" );
var path = require( "path" );
var fs = Promise.promisifyAll( require( "fs" ) );

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

  grunt.registerTask( "ckupdate", "Execute the ckupdate tool", function() {
    var done = this.async();
    var childProcess = require( "child_process" );
    var worker = childProcess.spawn( "node", [ "ckupdate.js" ] );
    worker.stdout.pipe( process.stdout );
    worker.stderr.pipe( process.stderr );
    done();
  });

};

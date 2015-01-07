//
// Module dependencies
//
var express = require( "express" );

var app = module.exports = express();


app.set( "view engine", "html" );
//app.use( express.logger({ format: ":response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer" }) );
app.use( express.static(__dirname + '/public') );

app.listen( process.env.PORT || 1337 );
console.log( "Server listening on port %s", process.env.PORT || 1337 );

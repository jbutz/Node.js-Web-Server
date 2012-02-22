var _PORT           = 8124;              // HTTP default is 80
var _HTTP_BASE_PATH = "./";              // "." means the current directory
var _INDEX_FILE     = "helloWorld.html"; // Index file from Base Path


var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var httpServer = require('./httpServer.js');


if (cluster.isMaster)
{
	// Fork workers.
	for (var i = 0; i < numCPUs; i++)
	{
		cluster.fork();
	}
	
	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died');
	});
}
else
{
	
	httpServer.exec(_PORT,_HTTP_BASE_PATH,_INDEX_FILE);
	console.log('Server running on port ' + _PORT);
}

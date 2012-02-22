var _PORT           = 8124;              // HTTP default is 80
var _HTTP_BASE_PATH = "./";              // "." means the current directory
var _INDEX_FILE     = "helloWorld.html"; // Index file from Base Path

var httpServer = require('./httpServer.js');

httpServer.exec(_PORT,_HTTP_BASE_PATH,_INDEX_FILE);

console.log('Server running on port ' + _PORT);

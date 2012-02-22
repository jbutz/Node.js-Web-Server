var http    = require('http');
var path    = require('path');
var fs      = require('fs');
var util    = require('util');
var url     = require('url');

exports.exec = function(_PORT, _HTTP_BASE_PATH, _INDEX_FILE)
{
http.createServer(function(request, response)
{
	var urlPath = path.normalize(_HTTP_BASE_PATH + url.parse(request.url).pathname);
	if(urlPath == ".\\") // Double slash because we are escaping the slash
	{
		urlPath = path.normalize(_HTTP_BASE_PATH + _INDEX_FILE);
	}
	else if(urlPath == "_REQUESTINFO_")
	{
		var options = { 'Content-Type': 'text/plain' };
		response.writeHead(200, options);
		response.end(util.inspect(request, true));
		return;
	}
	console.log("Attempted file access: " + urlPath);
	// Does this file exist?
	path.exists(urlPath, function(exists)
	{
		if( !exists )
		{
			// It ain't there!!!
			response.writeHead(404,{'Content-Type': 'text/plain'});
			response.end("Error: That file does not exist!");
			return;
		}
		else
		{
			// It seems to be there, so let's give it another look!
			fs.stat(urlPath, function(err, stats)
			{
				if( !stats.isFile() ) // Only allow access to files!
				{
					response.writeHead(400,{'Content-Type': 'text/plain'});
					response.end("Error: You can only access files! What sort of funny business is this?");
					return;
				}
				else
				{
					// Appears to be a file. Let's try reading it!
					fs.readFile(urlPath, function(error, content) {
						if(error)
						{
							// Oops?
							response.writeHead(500,{'Content-Type': 'text/plain'});
							response.end("Error: I couldn't read that file, but it seems to be there. How odd.");
							return;
						}
						else
						{
							// Lets figure out a mime-type!
							var fileExt = path.extname(urlPath);
							fileExt = fileExt.replace('.','');
							var mime = 'text/plain';
							switch(fileExt)
							{
								case 'html':
								case 'htm':
									mime = 'text/html';
									break;
								case 'css':
									mime = 'text/css';
									break;
								case 'less':
									mime = 'text/less';
									break;
								case 'js':
									mime = 'text/javascript';
									break;
								case 'xml':
									mime = 'text/xml';
									break;
								case 'png':
								case 'jpeg':
								case 'jpg':
								case 'gif':
									if(fileExt == 'jpg')
									{
										fileExt = 'jpeg';
									}
									else if(fileExt == 'svg')
									{
										fileExt = 'svg+xml';
									}
									mime = 'image/' + fileExt;
									break;
								case 'txt':
									minm = 'text/plain';
									break;
								default:
									mime = "";
									break;
							}
							
							var options = { 'Content-Type': mime };
							if(mime == "")
							{
								options = {};
							}
							response.writeHead(200, options);
							response.end(content);
						}
					})
				}
			});
			fs.readFile
		}
	});
}).listen(_PORT);
}
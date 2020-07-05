/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: This file contains a basic web-server. It offers an API that can 
 *          be used to translate between English, German, and Spanish.
 */

const http = require('http');

const host = '127.0.0.1';
const port = 5000;

function buildTranslations() {
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  buildTranslations();
  var parts = req.url.split('/');
  var languages = new Set(["e", "g", "s"]);

  if (parts.length == 4 && parts[1] == 'translate' && parts[2].length == 3
      && languages.has(parts[2][0]) && languages.has(parts[2][2])
      && parts[2][0] != parts[2][2]) {
    var original = parts[3].split('+');
    var translation = "";
    original.forEach(item => translation += item + " ");
    res.end(translation);
  } else {
    res.end('Invalid request.');
  }
});


server.listen(port, host, () => {
   console.log('Web server running at http://%s:%s',host,port );
});

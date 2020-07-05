/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: This file contains a basic web-server. It offers an API that can be
 *          used to translate between English, German, and Spanish.
 */

const http = require('http');

const host = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(req.url);
});


server.listen(port, host, () => {
   console.log('Web server running at http://%s:%s',host,port );
});

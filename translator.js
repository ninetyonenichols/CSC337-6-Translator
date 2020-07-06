/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: This file contains a basic web-server. It offers an API that can 
 *          be used to translate between English, German, and Spanish.
 */

const http = require('http');
const fs = require('fs');
const readline = require('readline');

const host = '127.0.0.1';
const port = 5000;

e2g = {};
e2s = {};
g2e = {};
g2s = {};
s2e = {};
s2g = {};

/*
 * This function builds the dictionaries that will store translation info.
 */
async function buildTranslations(fname) {
    const filestream = fs.createReadStream(fname);
    const rl = readline.createInterface({
        input: filestream,
        clrfDelay: Infinity,
    });
    for await (const line of rl){
        if (line.startsWith('#')) { continue; }
        let words = line.split('\t');
        if (words.length < 2) { continue; }
        var eng = words[0];
        var foreign = words[1].split('\s')[0];
        e2s[eng] = foreign;
    }
}

/*
 * This function translates a string.
 */
function translate(original) {
    var translation = "";
    original.forEach(item => translation += e2s[item] + ' ');
    return translation;
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  buildTranslations(fname='./src_data/spanish.txt');
  var parts = req.url.split('/');
  var languages = new Set(["e", "g", "s"]);

  if (parts.length == 4 && parts[1] == 'translate' && parts[2].length == 3
      && languages.has(parts[2][0]) && languages.has(parts[2][2])
      && parts[2][0] != parts[2][2]) {
    var original = parts[3].split('+');
    var translation = translate(original);
    res.end(translation);
  } else {
    res.end('Invalid request.');
  }
});


server.listen(port, host, () => {
   console.log('Web server running at http://%s:%s',host,port );
});

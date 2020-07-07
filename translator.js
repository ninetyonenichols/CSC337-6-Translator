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
s2e = {};

buildOrigTranslations('./Spanish.txt', e2s, s2e);
buildOrigTranslations('./German.txt', e2g, g2e);

/*
 * This function builds the dictionaries that will store translation info.
 * @param trans_fname, a string. The name of a translations file.
 * @param orig2for, a string. The name of a mapping from original language to foreign langauge.
 * @param for2orig, a string. The name of a mapping from foreign language to original language.
 */
async function buildOrigTranslations(trans_fname, orig2for, for2orig) {
  const rl = readline.createInterface({
    input: fs.createReadStream(trans_fname),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (line.startsWith('#')) { continue; }
    let words = line.split('\t');
    if (words.length < 2) { continue; }
    var orig = words[0].toLowerCase();
    var foreign = words[1].toLowerCase();
    let delim = foreign.search('[^a-z ]');
    foreign = delim == -1 ? foreign : foreign.substring(0, delim);
    orig2for[orig] = foreign;
    for2orig[foreign] = orig; 
  }
}

/*
 * This function translates a string.
 * @param: orig, a string. The string to be translated.
 * @param: orig2for, a dict. The mapping between original words and translated words.
 */
function translate(orig, orig2for) {
  orig = orig.split('+');
  var translation = "";
  var foreign;
  orig.forEach(item => {
    item = item.toLowerCase();
    if (orig2for == 'g2s') {
      let eng = g2e[item];
      foreign = e2s[eng]; 
    } else if (orig2for == 's2g') {
      let eng = s2e[item];
      foreign = e2g[eng];
    } else {
      foreign = eval(orig2for)[item];
    }
    translation += foreign + ' ';
    })
  return translation;
}

/*
 * Setting up the server. If a valid translation request is made, it will translate.
 * Otherwise, it will say "Invalid Request".
 */
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  var languages = new Set(["e", "g", "s"]);
  var parts = req.url.split('/');

  // processing query and translating input
  if (parts.length == 4 && parts[1] == 'translate' && parts[2].length == 3
    && languages.has(parts[2][0]) && languages.has(parts[2][2])
    && parts[2][0] != parts[2][2]) {
    var translation = translate(parts[3], parts[2]);
    res.end(translation);
  } else {
    res.end('Invalid request.');
  }
});


server.listen(port, host, () => {
  console.log('Web server running at http://%s:%s',host,port );
});

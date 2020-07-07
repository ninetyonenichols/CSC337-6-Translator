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

buildTranslations('./src_data/spanish.txt', e2s, s2e);
buildTranslations('./src_data/german.txt', e2g, g2e);

/*
 * This function builds the dictionaries that will store translation info.
 * @param trans_fname, a string. The name of a translations file.
 * @param orig2for, a dict. A mapping from original language to foreign langauge.
 * @param for2orig, a dict. A mapping from foreign language to original language.
 */
async function buildTranslations(trans_fname, orig2for, for2orig) {
  const filestream = fs.createReadStream(trans_fname);
  const rl = readline.createInterface({
    input: filestream,
    clrfDelay: Infinity,
  });
  for await (const line of rl){
    if (line.startsWith('#')) { continue; }
    let words = line.split('\t');
    if (words.length < 2) { continue; }
    var orig = words[0];
    var foreign = words[1];
    let delim = foreign.search('[^a-zA-Z ]');
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
  var translation = "";
  orig.forEach(item => {
    translation += orig2for[item] + ' ';
    })
  return translation;
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  var parts = req.url.split('/');
  var languages = new Set(["e", "g", "s"]);

  // processing query and translating input
  if (parts.length == 4 && parts[1] == 'translate' && parts[2].length == 3
    && languages.has(parts[2][0]) && languages.has(parts[2][2])
    && parts[2][0] != parts[2][2]) {
    var translation = translate(original=parts[3].split('+'), eval(parts[2]));
    console.log(eval(parts[2]));
    res.end(translation);
  } else {
    res.end('Invalid request.');
  }
});


server.listen(port, host, () => {
  console.log('Web server running at http://%s:%s',host,port );
});

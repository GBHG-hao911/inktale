#!/usr/local/bin/node
'use strict';
const fs = require('fs');
const path = require('path');

if(process.argv.length < 4) {
  console.log('Usage: node json2js.js [input file] [output file]')
  return process.exit(1);
}

const openPath = path.normalize(path.join(process.cwd(), process.argv[2]));
const savePath = path.normalize(path.join(process.cwd(), process.argv[3]));

let inputContent;
try {
  inputContent = fs.readFileSync(openPath, 'utf8');
  //inputContent = inputContent.replace(/\'/g, '\'');
} catch (e) {
  console.log(e);
  return process.exit(1);
}

const outputContent = `'use strict';\nconst output = ${inputContent}\;\nexport default output;`;
fs.writeFileSync(savePath, outputContent);

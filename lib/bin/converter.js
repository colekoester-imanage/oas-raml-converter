#!/usr/bin/env node --harmony
const program = require('commander');
const formats = require('../formats');
const specConverter = require('../../index');

let from = formats.AUTO;
let to = formats.RAML10;
let file = undefined;

const exit = (error) => {
  console.error(error);
  process.exit(1);
};

program
  .arguments('<file>')
  .option('-f, --from <from>', 'The from/input spec, valid values are: swagger, raml08, raml10 and auto (default)')
  .option('-t, --to <to>', 'The to/target spec, valid values are: swagger, raml08 and raml10 (default)')
  .action(f => {
    file = f;
    if (typeof program.from !== 'undefined') {
      from = formats[program.from.toUpperCase()];
      if (typeof from === 'undefined') exit('Invalid --from spec given. See --help.');
    }
    if (typeof program.to !== 'undefined') {
      to = formats[program.to.toUpperCase()];
      if (typeof to === 'undefined') exit('Invalid --to spec given. See --help.');
    }
  })
  .parse(process.argv);

if (typeof file === 'undefined') exit('File path required. See --help.');

const converter = new specConverter.Converter(from, to);
converter.loadFile(file, (err) => {
  if (err) exit(err);

  const format = to.formats[0].toLowerCase();
  converter.convert(format).then(result =>
    console.log(result)
  ).catch(exit);
});
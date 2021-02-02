#!/usr/bin/env node
const fs = require("fs");
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const { addCompany, addLandRecord, buildOwnershipTree } = require('../landtree');

const companyDb = {},
      landDb = {};

const options = yargs(hideBin(process.argv))
  .usage('Usage: $0 --mode=<mode> <companyId>')
  .option('mode', {
    alias: 'm',
    describe: 'How to display the tree',
    type: 'string',
    default:'expand',
    choices: ['from_root', 'expand']
  })
  .argv;

  console.log(options._);

fs.readFileSync("./company_relations.csv", "utf8")
  .split("\n")
  .slice(1) // header row
  .forEach((line) => {
    const [id, name, parentId] = line.split(",");
    addCompany(companyDb, {id, name, parentId});
  });

fs.readFileSync("./land_ownership.csv", "utf8")
  .split("\n")
  .slice(1) // header row
  .forEach((line) => {
    const [landId, companyId] = line.split(",");
    addLandRecord(landDb, {landId, companyId})
  });

let result = null;

if (options.mode == 'from_root' && options._.length > 0) {
  result = buildOwnershipTree(companyDb, landDb, options._[0]);
  result.forEach(entry => console.log(entry));
}


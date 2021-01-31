#!/usr/bin/env node
const fs = require("fs");
const { addCompany, addLandRecord, buildOwnershipTree } = require('../landtree');

const companyDb = {},
      landDb = {};

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

const result = buildOwnershipTree(companyDb, landDb, 'C101307938502');

result.forEach(entry => console.log(entry));
const addCompany = (companyDb, entry) => {
  let record = companyDb[entry.id] || { children: []};
  companyDb[entry.id] = Object.assign(record, entry);

  companyDb[entry.parentId]  = companyDb[entry.parentId] || {};
  companyDb[entry.parentId].children = companyDb[entry.parentId].children || [];
  companyDb[entry.parentId].children.push(entry.id);
};

const addLandRecord = (landDb, entry) => {
  let count = landDb[entry.companyId] || 0;
  landDb[entry.companyId] = ++count;
};

const buildOwnershipTree = (companyDb, landDb, companyId) => {
  let company = companyDb[companyId],
      count  = landDb[companyId] || 0,
      countLookup  = {},
      entries = [];

  if (!company.parentId)
    return [`${company.id}; ${company.name}; owner of ${count} land parcel${count>1 ? 's': ''}`];

  while (company.parentId) {
    company = companyDb[company.parentId];
  }

  subtree(company.id, 0);

  return entries;

  function parcelCount(compId) {
    if (countLookup[compId])
      return countLookup[compId];

    const comp = companyDb[compId];
    let count = landDb[compId] || 0;
    comp.children.forEach(child => count += parcelCount(child));
    countLookup[compId] = count;

    return count;
  }

  function subtree(compId, level) {
    const comp = companyDb[compId];
    const count = parcelCount(compId);
    let info = `${comp.name}; owner of ${count} land parcel${count>1 ? 's': ''}${ comp.id == companyId ? ' ***': ''}`;
    if (level == 0)
      info = `${comp.id}; ` + info;
    else
      info  = `${'| '.repeat(level)}- ${comp.id}; ` + info;

    level++;
    entries.push(info);
    comp.children.forEach(element => subtree(element, level));
  }
}

exports.addCompany = addCompany;
exports.addLandRecord = addLandRecord;
exports.buildOwnershipTree = buildOwnershipTree;
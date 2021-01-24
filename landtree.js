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
      rootCount  = landDb[companyId],
      parentNodes  = {},
      entries = [];

  if (!company.parentId)
    return [`${company.id}; ${company.name}; owner of ${rootCount} land parcel${rootCount>1 ? 's': ''}`];

  while (company.parentId) {
    let parent = companyDb[company.parentId],
        parentCount  = landDb[parent.id];
    let totalCount = parent.children.map(child => landDb[child]).reduce((acc, val) => acc + val, parentCount);
    parentNodes[parent.id] = totalCount;
    // rootCount += totalCount;
    company = parent;
  }

  entries = [`${company.id}; ${company.name}; owner of ${parentNodes[company.id]} land parcel${rootCount>1 ? 's': ''}`];
  company.children.forEach(childId => {
    entries.push(subtree(childId, 1));
  });

  return entries;


  function subtree(compId, level) {
    const comp = companyDb[compId];
    const count = parentNodes[compId] || landDb[compId];
    const result = `${'| '.repeat(level)}- ${comp.id}; ${comp.name}; owner of ${count} land parcel${count>1 ? 's': ''} ${ comp.id == companyId ? '***': ''}`;
    comp.children.forEach(element => subtree(element, level++));
    return result;
  }
}

exports.addCompany = addCompany;
exports.addLandRecord = addLandRecord;
exports.buildOwnershipTree = buildOwnershipTree;
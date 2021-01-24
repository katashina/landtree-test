const addCompany = (companyDb, entry) => {
  let record = companyDb[entry.id] || {};
  companyDb[entry.id] = Object.assign(record, entry);

  companyDb[entry.parentId]  = companyDb[entry.parentId] || {};
  companyDb[entry.parentId].children = companyDb[entry.parentId].children || [];
  companyDb[entry.parentId].children.push(entry.id);
}

exports.addCompany = addCompany;
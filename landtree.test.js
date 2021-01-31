const { addCompany, addLandRecord, buildOwnershipTree } = require('./landtree');

describe('when adding a company to an empty db', () =>{
  it('should update the db with the new entry', () => {
    const db = {};
    const entry = {
      id: 'ABC01',
      name: 'ABC Ltd',
      parentId: 'FOO'
    };

    addCompany(db, entry);
    const expectedResult = Object.assign(entry, { children: [] });
    expect(db[entry.id]).toEqual(entry);
  });
});

describe('when adding a company with a parentId', () => {
  describe('and the parentId entry does not exist', () =>{
    it('should create the parentId entry add the company to the children of parentId', () => {
      const db = {};
      const entry = {
        id: 'ABC01',
        name: 'ABC Ltd',
        parentId: 'FOO'
      };

      addCompany(db, entry);

      expect(db[entry.parentId].children).toContain(entry.id)
    });

    describe('and the parentId entry does exist', () =>{
      it('should add the company to the children of parentId', () => {
        const db = {};
        const entry = {
          id: 'ABC01',
          name: 'ABC Ltd',
          parentId: 'FOO'
        };
        db[entry.parentId] = {};

        addCompany(db, entry);

        expect(db[entry.parentId].children).toContain(entry.id)
      });
    });
  });
});

describe('when adding a company and the record exists', () => {
  it('should update the record', () => {
    const db = {};
    const entry = {
      id: 'FOO',
      name: 'FOO Ltd',
      parentId: 'BAR'
    };
    db[entry.id] = {
      children: ['XYZ']
    };

    addCompany(db, entry);

    expect(db[entry.id].name).toEqual(entry.name);
    expect(db[entry.id].parentId).toEqual(entry.parentId);
    expect(db[entry.id].children.length).toEqual(1);
    expect(db[entry.id].children).toContain('XYZ');
  })
});

describe('when adding land ownership for a company that does not exist', () =>{
  it('should set the count', () => {
    const db = {};
    const entry = {
      landId: 'LAND123',
      companyId: 'BAR'
    };

    addLandRecord(db, entry);

    expect(db[entry.companyId]).toEqual(1);
  });
});

describe('when adding land ownership for a company that does exist', () => {
  it('should update the count', () => {
    const db = {};
    const entry = {
      landId: 'LAND123',
      companyId: 'BAR'
    };

    db[entry.companyId] = 9;

    addLandRecord(db, entry);

    expect(db[entry.companyId]).toEqual(10);
  });
});

describe('when building ownership tree from root', () => {
  it('should print out the compnay id, name and ownership amount', () => {
    const companyDb = {};
    const landDb = {};

    const company = {
      id: 'FOO',
      name: 'FOO Ltd'
    };

    const land = {
      landId: 'LAND123',
      companyId: company.id
    };

    addCompany(companyDb, company);
    addLandRecord(landDb, land);

    const result = buildOwnershipTree(companyDb, landDb, company.id);
    expect(result).toEqual(['FOO; FOO Ltd; owner of 1 land parcel']);
  });

  it('should print out the parent compnay id, name and ownership amount', () => {
    const companyDb = {};
    const landDb = {};

    addCompany(companyDb, { id: 'FOO', name: 'FOO Ltd', parentId: 'BAR'});
    addCompany(companyDb, { id: 'BAR', name: 'BAR GROUP' });
    addCompany(companyDb, { id: 'FIZZ', name: 'FIZZ Ltd', parentId: 'BAR' });
    addCompany(companyDb, { id: 'BUZZ', name: 'BUZZ Ltd', parentId: 'FOO' });
    addCompany(companyDb, { id: 'LULU', name: 'LULU Ltd', parentId: 'FIZZ' });
    addCompany(companyDb, { id: 'FIFI', name: 'FIFI Ltd', parentId: 'LULU' });

    landDb['FOO'] = 4;
    landDb['BAR'] = 6;
    landDb['FIZZ'] = 5;
    landDb['BUZZ'] = 5;
    landDb['LULU'] = 2;
    landDb['FIFI'] = 1;

    const result = buildOwnershipTree(companyDb, landDb, 'FOO');

    expect(result).toEqual( [
      'BAR; BAR GROUP; owner of 23 land parcels',
      '| - FOO; FOO Ltd; owner of 9 land parcels ***',
      '| | - BUZZ; BUZZ Ltd; owner of 5 land parcels',
      '| - FIZZ; FIZZ Ltd; owner of 8 land parcels',
      '| | - LULU; LULU Ltd; owner of 3 land parcels',
      '| | | - FIFI; FIFI Ltd; owner of 1 land parcel'
    ]);
  });

  it('should not print out undefied/NaN when a company does not have an entry in the landDb', () => {
    const companyDb = {};
    const landDb = {};

    addCompany(companyDb, { id: 'FOO', name: 'FOO Ltd', parentId: 'BAR'});
    addCompany(companyDb, { id: 'BAR', name: 'BAR GROUP' });

    landDb['FOO'] = 4;

    const result = buildOwnershipTree(companyDb, landDb, 'FOO');
    expect(result).toEqual( [
      'BAR; BAR GROUP; owner of 4 land parcels',
      '| - FOO; FOO Ltd; owner of 4 land parcels ***'
    ]);
  })
});
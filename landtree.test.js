const addCompany = require('./landtree').addCompany;

describe('when adding a company to an empty db', () =>{
  it('should update the db with the new entry', () => {
    const db = {};
    const entry = {
      id: 'ABC01',
      name: 'ABC Ltd',
      parentId: 'FOO'
    };

    addCompany(db, entry);

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
    console.log(JSON.stringify(db));

    expect(db[entry.id].name).toEqual(entry.name);
    expect(db[entry.id].parentId).toEqual(entry.parentId);
    expect(db[entry.id].children.length).toEqual(1);
    expect(db[entry.id].children).toContain('XYZ');
  })
});
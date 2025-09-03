const { expect } = require('chai');
const { startInMemoryMongo, stopInMemoryMongo, clearDB } = require('../helpers/mongo-memory.test');

let Quote;

describe('Model: Quote', function () {
  this.timeout(20000);

  before(async () => {
    await startInMemoryMongo();
    Quote = require('../../model/quoteModel'); 
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await stopInMemoryMongo();
  });

  it('saves a valid quote', async () => {
    const doc = await Quote.create({ quote: 'TestQuote', });
    expect(doc).to.have.property('_id');
  expect(doc.quote).to.equal('TestQuote');
  });

  it('fails validation when quote is missing', async () => {
    let err;
    try {
      await Quote.create({});
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
    expect(err.name).to.equal('ValidationError');
  });
});


const { expect } = require('chai');
const { startInMemoryMongo, stopInMemoryMongo, clearDB } = require('../helpers/mongo-memory.test');

let Quote, controller;


function mockRes() {
  let statusCode = null;
  let jsonPayload = null;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      jsonPayload = payload;
      this._json = payload;
      return this;
    },
    getStatus() { return statusCode; },
    getJson() { return jsonPayload; }
  };
}

describe('Controller: quoteController', function () {
  this.timeout(20000);

  before(async () => {
    await startInMemoryMongo();
    Quote = require('../../model/quoteModel');
    controller = require('../../controllers/quoteController');
  });


  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await stopInMemoryMongo();
  });


  it('createQuote & status code 200 & returns saved quote', async () => {
    const req = { body: { quote: 'Controller path', author: 'Unit' } };
    const res = mockRes();

    await controller.createQuote(req, res);

    expect(res.getStatus()).to.equal(200);
    const payload = res.getJson();
    expect(payload).to.have.property('message');
    expect(payload).to.have.nested.property('quote.quote', 'Controller path');

    const found = await Quote.findOne({ quote: 'Controller path' });
    expect(found).to.exist;
  });


  it('createQuote & status code 400 on missing quote', async () => {
    const req = { body: {} };
    const res = mockRes();

    await controller.createQuote(req, res);

    expect(res.getStatus()).to.equal(400);
  });
});

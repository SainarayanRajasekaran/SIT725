// tests/routes/quote.routes.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { startInMemoryMongo, stopInMemoryMongo, clearDB } = require('../helpers/mongo-memory.test');

chai.use(chaiHttp);

let app;

describe('Routes: /api Quotes', function () {
  this.timeout(20000);

  before(async () => {
    await startInMemoryMongo();
    // require AFTER DB connection so models bind to the active mongoose
    app = require('../../server');
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await stopInMemoryMongo();
  });

  it('POST /api/PostQuote → 200 + saved quote', async () => {
    const res = await chai.request(app)
      .post('/api/PostQuote')
      .send({ quote: 'Integration test quote', author: 'Route' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').that.matches(/saved/i);
    expect(res.body).to.have.nested.property('quote.quote', 'Integration test quote');
  });

  it('GET /api/getQuote → returns array of quotes', async () => {
    await chai.request(app).post('/api/PostQuote').send({ quote: 'Q1' });
    await chai.request(app).post('/api/PostQuote').send({ quote: 'Q2' });

    const res = await chai.request(app).get('/api/getQuote');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body.map(q => q.quote)).to.include.members(['Q1', 'Q2']);
  });

  it('POST /api/PostQuote → 400 for missing fields', async () => {
    const res = await chai.request(app).post('/api/PostQuote').send({});
    expect(res).to.have.status(400);
  });
});

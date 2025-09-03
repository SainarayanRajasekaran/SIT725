const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../server'); 

chai.use(chaiHttp);

describe('Server Test: server.js is working', () => {
  it('should return 404 on unknown route', async () => {
    const res = await chai.request(app).get('/doesnotexist');
    expect(res).to.have.status(404);
  });
});

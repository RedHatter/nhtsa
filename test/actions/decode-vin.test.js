require('../support/setup');

const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const NHTSA = require('../../index');
const decodeVinSuccessJSON = require('../mocked-responses/decode-vin/success');

chai.use(chaiAsPromised);

describe('#decodeVin()', () => {
  let sandbox;
  let response;
  let data;
  let vin;

  const validVin = 'WUAAU34248N006164';
  const invalidVin = 'foobar';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    const resolved = new Promise(resolve => resolve(decodeVinSuccessJSON));
    sandbox.stub(axios, 'get').returns(resolved);
  });

  afterEach(() => sandbox.restore());

  context('with valid VIN', () => {
    beforeEach(async () => {
      vin = validVin;
      response = await NHTSA.decodeVin(vin);
    });

    it('responds with a 200 status code', () => {
      expect(response.status).to.equal(200);
    });

    it('parses the JSON response', () => {
      expect(typeof response).to.equal('object');
    });

    it('has succssful message', () => {
      expect(response.data['Message']).to.equal('Results returned successfully');
    });

    it('has the correct search criteria', () => {
      expect(response.data['SearchCriteria']).to.equal('VIN:WUAAU34248N006164');
    });
  });

  context('with invalid VIN', () => {
    beforeEach(() => {
      vin = invalidVin;
      response = NHTSA.decodeVin(vin);
    });

    it('responds with an error', () => {
      expect(response).to.be.rejectedWith('Invalid VIN');
    });
  });
});

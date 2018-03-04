require('../support/setup');

const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const NHTSA = require('../../nhtsa');
const decodeVinExtendedSuccessJSON = require('../mocked-responses/decode-vin-flat-format/success');

chai.use(chaiAsPromised);

describe('#decodeVinExtended()', () => {
  let sandbox;
  let response;
  let data;
  let vin;

  const validVin = 'WUAAU34248N006164';
  const invalidVin = 'foobar';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    const resolved = new Promise(resolve => resolve(decodeVinExtendedSuccessJSON));
    sandbox.stub(axios, 'get').returns(resolved);
  });

  afterEach(() => sandbox.restore());

  context('with valid VIN', () => {
    beforeEach(async () => {
      vin = validVin;
      response = await NHTSA.decodeVinExtended(vin);
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
      expect(response.data['SearchCriteria']).to.equal('VIN(s): WUAAU34248N006164');
    });

    it('has results', () => {
      expect(response.data['Results'].length).to.not.equal(0);
    });
  });

  context('with invalid VIN', () => {
    beforeEach(() => {
      vin = invalidVin;
      response = NHTSA.decodeVinExtended(vin);
    });

    it('responds with an error', () => {
      expect(response).to.be.rejectedWith('Invalid VIN');
    });
  });
});

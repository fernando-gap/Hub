const {expect} = require('chai');
const execute = require('../../src/central/operation.js');

describe('Execute a service', function() {
  describe('Try shell commands', function() {
    it('Without arguments', async function() {
      const output = await execute.service('ls');
      expect(output).to.be.an('object');
      expect(output).to.have.key('body');
    });
    it('With arguments', async function() {
      const output = await execute.service('echo', 'hello', 'world');

      expect(output).to.be.an('object');
      expect(output).to.have.key('body');
      expect(output.body).to.be.a('string');
      expect(output.body).to.equal('hello world\n');
    });
  });
});

describe('Execute a command', function() {
  describe('Error on unknown command', function() {
    it('Without arguments');
    it('With arguments');
  });

  describe('Path config', function() {
    it('Different Path config');
    it('Error on path config');
  });
});

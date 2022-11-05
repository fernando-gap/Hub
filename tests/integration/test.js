const { expect } = require('chai');

describe('Main test', function() {
  describe('Test 1', function() {
    it('Check arrays', function() {
      expect([1,2,3]).to.have.members([1,2,3,4])
    })
  })
})

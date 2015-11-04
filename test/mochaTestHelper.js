import chai, {assert, expect} from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiImmutable  from 'chai-immutable';

chai.should();
chai.use(sinonChai);
chai.use(chaiImmutable);

export {
  assert,
  chai,
  expect,
  React,
  sinon,
  sinonChai,
  TestUtils
};

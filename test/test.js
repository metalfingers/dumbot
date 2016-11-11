// Libs
const chai = require('chai'),
  { expect } = chai;

// Source
const Dumbot = require('../index.js'),
  intents = require('./dumbot-config/intents.js'),
  intentHandlers = require('./dumbot-config/intent-handlers.js'),
  path = require('path'),
  conversationsPath = path.resolve('./test/dumbot-config/conversations/'),
  dumbot = new Dumbot({ intents, intentHandlers, conversationsPath }),
  MockUser = require('./mocks/mock-user.js');


describe('new Dumbot', () => {
  it('should error out if an object is not passed in');
  it('should error out if no intents are passed in');
  it('should console.warn if no intent handlers are passed in');
  it('should error out if no conversations path is passed in');
});

describe('dumbot#handleMessage', () => {
  it('should error out if an object is not passed in');
  it('should be a function');
  it('should error out if no user is passed in');
  it('should error out if no message is undefined');
});


describe('dumbot#conversations', () => {
  it('should exist');
});

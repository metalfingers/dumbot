// Libs
const { expect } = require('chai');

// Source
const Dumbot = require('../index.js'),
  intents = require('./dumbot-config/intents.js'),
  intentHandlers = require('./dumbot-config/intent-handlers.js'),
  path = require('path'),
  conversationsPath = path.resolve('./test/dumbot-config/conversations/'),
  dumbot = new Dumbot({ intents, intentHandlers, conversationsPath }),
  MockUser = require('./mocks/mock-user.js'),
  mockUser = new MockUser();

describe('new Dumbot', () => {
  it('should error out if an object is not passed in');

  it('should error out if no intents are passed in', () => {
    expect(() => new Dumbot()).to.throw(TypeError, /Cannot read property 'intents' of undefined/);
  });

  it('should console.warn if no intent handlers are passed in');

  it('should error out if there are no conversations passed in', () => {
    const emptyPath = path.resolve('./test/dumbot-config/no-conversations/');

    expect(() => new Dumbot({ intents: {}, intentHandlers: { a: undefined }, conversationsPath: emptyPath }))
      .to.throw(Error, /conversationsPath does not contain any conversation files/);
  });
});

describe('dumbot#handleMessage', () => {
  it('should error out if an object is not passed in');

  it('should be a function', () => {
    expect(dumbot.handleMessage).to.be.a('function');
  });

  it('should error out if message is undefined', () => {
    expect(dumbot.handleMessage({ user: mockUser, message: '' }))
      .to.throw(TypeError, /Cannot read property 'intents' of undefined/);
  });
});


describe('dumbot#conversations', () => {
  it('should exist');
});

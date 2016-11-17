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
  it('should error out if no intents are passed in', () => {
    expect(() => new Dumbot()).to.throw(TypeError, /Cannot read property 'intents' of undefined/);
  });

  it('should console.warn if no intent handlers are passed in');

  it('should error out if there are no conversations passed in', () => {
    const emptyPath = path.resolve('./test/dumbot-config/no-conversations/'),
      emptyArgs = { intents: {}, intentHandlers: { a: undefined }, conversationsPath: emptyPath };

    expect(() => new Dumbot(emptyArgs))
      .to.throw(Error, /conversationsPath does not contain any conversation files/);
  });

  it('should error out if a non-absolute path is passed in', () => {
    const badPath = './test/dumbot-config/conversations/',
      badArgs = { intents: {}, intentHandlers: { a: undefined }, conversationsPath: badPath };

    expect(() => new Dumbot(badArgs))
      .to.throw(Error, /conversationsPath is not an absolute path/);
  });
});

describe('dumbot#handleMessage', () => {
  it('should be a function', () => {
    expect(dumbot.handleMessage).to.be.a('function');
  });

  it('should error out if message is undefined or empty', () => {
    expect(() => dumbot.handleMessage({ user: mockUser, message: '' }))
      .to.throw(Error, /Message cannot be empty or undefined/);
  });

  describe('intent routing:', () => {
    // these tests test the intent match terms  in intents.js
    it('should route to the correct intent when match term is a string', () => {
      expect(dumbot.handleMessage({ user: mockUser, message: 'hi' }).response)
        .to.equal('hi there.');
    });
});


describe('dumbot#conversations', () => {
  it('should exist', () => {
    expect(dumbot.conversations).to.be.an('object');
  });
});

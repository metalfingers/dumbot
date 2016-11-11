// Libs
const chai = require('chai'),
  expect = chai.expect,
  should = chai.should;

// Source
const Dumbot = require('../index.js'),
  intents = require('./dumbot-config/intents.js'),
  intentHandlers = require('./dumbot-config/intent-handlers.js'),
  path = require('path'),
  conversationsPath = path.resolve('./app/dumbot-config/conversations/'),
  dumbot = new Dumbot(intents, intentHandlers, conversationsPath),
  MockUser = require('./test/utils/mock-user.js');

/**
 * To test first exchange
 */
describe('Conversation - First exchange "Get Started" Test', () => {

});

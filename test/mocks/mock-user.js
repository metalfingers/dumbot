/**
 * TEST UTILS: Used in test only to mock users.
 */
class MockUser {
  // If one is not supplied, a default constructor is used instead:
  // constructor() { }
  constructor() {
    this.session = { conversations: [] };
    this.prefs = {};
  }
}

module.exports = MockUser;

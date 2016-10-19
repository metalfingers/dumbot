const conversations = require('./conversations.js');

function validateResponse(user, conversationName, message) {
  let ret;
  if (user.session.questionAsked) {
    // input validations happen here and save answer or reprompt
    const convoComponent = conversations[conversationName]
      .components
      .filter(elem => elem.name === user.session.questionAsked)[0];
    if (convoComponent.validation(message) === true || convoComponent.validation === undefined) {
      user.prefs[convoComponent.name] = message;
      user.session.questionAsked = undefined;
    } else {
      ret = convoComponent.reprompt;
    }
  }
  return ret;
}

function getNextComponent(user, conversationName, completionMessage) {
  let response;
  conversations[conversationName].components.forEach((component) => {
    // if we're missing a conversation component...
    if (user.prefs[component.name] === undefined) {
      // save this conversation to the conversations array (if it's not already there)
      if (user.session.conversations.some(item => item === conversationName) === false) {
        user.session.conversations.push(conversationName);
      }
      // ask the user for that information
      user.session.questionAsked = component.name;
      response = component.prompt;
    }
  });
  if (response === undefined) {
    // we have everything that we need, say something to end the convo and
    // remove it from the conversations array
    response = completionMessage;
    user.session.conversations.pop();
  }
  return response;
}
const intentHandlers = {
  greeting: (user, message) => {
    // validateResponse() either returns reprompt phrase or undefined
    let response = validateResponse(user, 'greeting', message);
    if (response === undefined) {
      response = getNextComponent(user, 'greeting', `thank you. it's really nice to meet you ${user.prefs.name}!`);
    }
    return { user, response };
  },
  goodbye: (user, message) => {
    // validateResponse() either returns reprompt phrase or undefined
    let response = validateResponse(user, 'goodbye', message);
    if (response === undefined) {
      response = getNextComponent(user, 'goodbye', 'later gator!');
    }
    return { user, response };
  },
};
module.exports = intentHandlers;

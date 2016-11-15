const path = require('path'),
  fs = require('fs'),
  jsFilenameToCamelCase = function jsFilenameToCamelCase(str) {
    return str.toLowerCase()
      .replace(/\.js/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .replace(/ (.)/g, $1 => $1.toUpperCase())
      .replace(/ /g, '');
  },
  bot = function bot({ intents, intentHandlers = {}, conversationsPath }) {
    const conversations = {};

    if (Object.keys(intentHandlers).length === 0) {
      console.warn('No intent handlers passed to dumbot.');
    }

    // check that conversationsPath is an absolute path
    if (!path.isAbsolute(conversationsPath)) {
      throw new Error('conversationsPath is not an absolute path. use path.resolve("your/path/here") to create conversationsPath');
    }


    // if there are no conversation files, throw an error.
    if (fs.readdirSync(conversationsPath).length === 0) {
      throw new Error('conversationsPath does not contain any conversation files.');
    }

    // collect all files in the conversations folder and add whatever they
    // export to the conversations object
    fs.readdirSync(conversationsPath).forEach((file) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      conversations[jsFilenameToCamelCase(file)] = require(`${conversationsPath}/${file}`);
    });

    // our helper functions
    this.validateResponse = function validateResponse(user, conversationName, message) {
      let ret,
        actions;
      if (user.session.questionAsked) {
        // get the conversation component that we're trying to validate input against
        const convoComponent = conversations[conversationName]
          .components
          .filter(elem => elem.name === user.session.questionAsked)[0];

        // if the validation returns true or undefined
        // (it's the expected input or there is no validation for this componenet)...
        if (convoComponent.validation(message) === true || convoComponent.validation === undefined) {
          // todo: run the actions method
          // ...do whatever's in the action property...
          if (typeof convoComponent.action === 'function') {
            actions = convoComponent.action(user, message);
          }

          // ...save the preference and clear the questionAsked property
          user.prefs[convoComponent.name] = message;
          user.session.questionAsked = undefined;
        } else {
          // ...or reprompt (reprompt can be a function)
          ret = typeof convoComponent.reprompt === 'function' ? convoComponent.reprompt(user, message) : convoComponent.reprompt;
        }
      }
      return ret;
    };

    this.getNextComponent = function getNextComponent(user, conversationName, completionMessage) {
      let response;
      conversations[conversationName].components.some((component) => {
        let ret = false;
        // if we're missing a conversation component...
        if (user.prefs[component.name] === undefined) {
          // ...save this conversation to the conversations array (if it's not already there)...
          if (user.session.conversations.some(item => item === conversationName) === false) {
            user.session.conversations.push(conversationName);
          }
          // ...then ask the user for that information
          user.session.questionAsked = component.name;
          response = typeof component.prompt === 'function' ? component.prompt(user) : component.prompt;

          ret = true;
        }

        // if true, we break out of the outer some loop
        return ret;
      });
      if (response === undefined) {
        // we have everything that we need, say something to end the convo and
        // remove it from the conversations array
        response = completionMessage;
        user.session.conversations.pop();
      }
      return response;
    };

    // turn intentHandlers into a Map
    const intentHandlerMap = new Map();

    Object.keys(intentHandlers).forEach((intentName) => {
      intentHandlerMap.set(intentName, intentHandlers[intentName]);
    });

    this.getIntent = function getIntent(user, message) {
      let intentName;
      if (user.session.conversations.length > 0) {
        intentName = user.session.conversations[user.session.conversations.length - 1];
      } else {
        Object.keys(intents).forEach((intent) => {
          if (intents[intent].indexOf(message) !== -1) {
            intentName = intent;
          }
        });
      }
      return (intentName || 'que');
    };

    return {
      conversations,
      handleMessage: ({ user = { session: { conversations: [] }, prefs: {} }, message, helpers }) => {
        let requiredIntent,
          response,
          returnVal;

        // check that we have a message
        if (message === undefined || message === '') {
          throw new Error('Message cannot be empty or undefined');
        }

        // give bot access to helper properties and methods
        this.helpers = (helpers || {});
        this.helpers.validateResponse = (this.helpers.validateResponse || this.validateResponse);
        this.helpers.getNextComponent = (this.helpers.getNextComponent || this.getNextComponent);

        // if we're in a conversation and we've asked a question...
        if (user.session.conversations.length > 0 && user.session.questionAsked) {
          // ...requiredIntent equals the last conversation
          requiredIntent = user.session.conversations[user.session.conversations.length - 1];
        } else {
          requiredIntent = this.getIntent(user, message);
        }

        // if it's a one-shot conversation (only one step and no components) and
        // no handler defined in intentHandlers...
        if (!conversations[requiredIntent].components && !intentHandlers[requiredIntent]) {
          // ...return the prompt...
          returnVal = { user, response: conversations[requiredIntent].prompt };
        } else if (!conversations[requiredIntent].components && intentHandlers[requiredIntent]) {
          // ...go through the handler (assuming that there's no need to validate)
          returnVal = intentHandlerMap.get(requiredIntent)(user, message, this.helpers);
        } else if (conversations[requiredIntent].components && intentHandlers[requiredIntent]) {
          // ...if there are components and a handler defined in intentHandlers,
          //  validate them then go thorugh the handler...
          response = this.helpers.validateResponse(user, requiredIntent, message);

          if (response === undefined) {
            response = this.helpers.getNextComponent(user, requiredIntent, conversations[requiredIntent].componentsCompletionReply(user));
          }
          returnVal = {
            user: intentHandlerMap.get(requiredIntent)(user, message, this.helpers).user,
            response,
          };
        } else if (conversations[requiredIntent].components && !intentHandlers[requiredIntent]) {
          // ...if there are components and no handler defined in intentHandlers, validate them...
          response = this.helpers.validateResponse(user, requiredIntent, message);

          if (response === undefined) {
            response = this.helpers.getNextComponent(user, requiredIntent, conversations[requiredIntent].componentsCompletionReply(user));
          }

          returnVal = { user, response };
        }
        return returnVal;
      },
    };
  };

module.exports = bot;

const intents = require('./intentList.js'),
	intentHandlers = require('./intentHandlers.js');


function getIntent(user, text) {
	let intentName;

	if (user.session.conversations.length > 0) {
		intentName === user.session.conversations[user.session.conversations.length -1];
	} else {
		for (let intent in intents) {
			if (intents[intent].indexOf(text) !== -1) {
				intentName = intent;
			}
		}	
	}
	

	return (intentName || 'not found');
}

const bot = {
	handleMessage: function(user = { session: { conversations: [] }, prefs: {}}, text) {
		let requiredIntent;

		if (user.session.conversations.length > 0 && user.session.questionAsked) {
			requiredIntent = user.session.conversations[user.session.conversations.length -1];
		} else {
			requiredIntent = getIntent(user, text);
		}

		return intentHandlers[requiredIntent](user, text);
	}
};

module.exports = bot;
const conversations = {
	greeting: {
		components: [
			{ name: 'name',
				prompt: 'what is your name?',
				reprompt: 'most people have names that are longer than one letter. what is yours?',
				validation: (message) => message.trim().length > 1,
			}, 
			{ name: 'location',
				prompt: 'where are you?',
				reprompt: `i didn't understand that. can you tell me again where you are?`,
				validation: (message) => message.trim().length > 1,
			},
			{ name: 'age',
				prompt: 'how old are you?',
				reprompt: 'i only understand numbers...sorry. how old are you?',
				validation: (message) => !isNaN(message),
			},
		]
	},
	goodbye: {
		components: [
			{ name: 'destination',
				prompt: 'where are you going?',
				reprompt: 'why don\'t you want to tell me the truth? where are you going?',
				validation: (message) => message !== 'nowhere',
			}, 
			{ name: 'returnTime',
				prompt: 'when are you coming back?',
				reprompt: 'i\'m going to miss you, are you coming back?',
				validation: (message) => false,
			},
		]
	}
};


module.exports = conversations;
const ytdl = require('ytdl-core');
const urls = [];
let isConnected = false;

function play(connection, message) {
	const stream = ytdl(urls[0], { filter: 'audioonly' });
	const dispatcher = connection.play(stream);
	dispatcher.setVolume(0.1);
	urls.shift();
	console.log('next song link : ' + urls[0]);
	dispatcher.on('finish', function() {
		if(urls[0]) {
			play(connection, message);
		}
		else {
			connection.disconnect();
			isConnected = false;
		}
	});
}

module.exports = {
	name: 'play',
	description: 'Play a song.',
	aliases: ['ytb', 'youtube'],
	usage: '[link]',
	async execute(message, args) {
		if(!args.length) {
			urls.push('https://www.youtube.com/watch?v=Hut8wf9U_gM');
		}
		else {
			urls.push(args[0]);
		}
		if(!isConnected) {
			if(message.member.voice.channel) {
				await message.member.voice.channel.join().then(connection => {
					isConnected = true;
					play(connection, message);
				});
			}
		}
	},
};
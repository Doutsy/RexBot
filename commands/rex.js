const fs = require('fs');
const imageFiles = fs.readdirSync('./images/rex').filter(file => file.endsWith('.jpg'));
module.exports = {
	name: 'rex',
	description: 'Get a random picture of Rex.',
	async execute(message) {
		const image = './images/rex/' + imageFiles[Math.floor(Math.random() * imageFiles.length)];
		await message.channel.send('Woof', {
			files: [image] });
	},
};
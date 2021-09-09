const fs = require('fs');
const imageFiles = fs.readdirSync('./images/anakin').filter(file => file.endsWith('.jpg'));
module.exports = {
	name: 'anakin',
	description: 'Get a random picture of Anakin.',
	async execute(message) {
		const image = './images/anakin/' + imageFiles[Math.floor(Math.random() * imageFiles.length)];
		await message.channel.send('meow', {
			files: [image] });
	},
};
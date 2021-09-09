const fs = require('fs');
const imageFiles = fs.readdirSync('./images/garou').filter(file => file.endsWith('.jpg'));
module.exports = {
	name: 'garou',
	description: 'Get a random picture of Garou.',
	async execute(message) {
		const image = './images/garou/' + imageFiles[Math.floor(Math.random() * imageFiles.length)];
		await message.channel.send('Woof', {
			files: [image] });
	},
};
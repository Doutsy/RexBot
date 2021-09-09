const fetch = require('node-fetch');

module.exports = {
	name: 'vincent',
	description: 'Envoie la liste de vincent',
	cooldown: 10,
	async execute(message) {
		const data = [];
		const result = await fetch('http://localhost:5000/api/eleves/')
			.then(response => response.json());
		let id = 1;

		data.push(result.map(username =>'# ' + id++ + ' - ' + username.nom + ' - ' + username.groupe).join('\n'));
		if(result.length) {
			await message.channel.send('```md\n' + data + '```');
		}
		else {
			await message.channel.send('La liste de Vincent est ✨vide✨');
		}
	},
};
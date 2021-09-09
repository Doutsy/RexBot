const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const invites = {};
const wait = require('util').promisify(setTimeout);

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	wait(1000);
	client.user.setPresence({ activity: { name: 'Gratouille son oreille', type: 'PLAYING' }, status: 'online' });
	client.guilds.cache.forEach(g => {
		g.fetchInvites().then(guildInvites => {
			invites[g.id] = guildInvites;
		});
	});

	console.log('Ready!');
});

client.on('guildMemberAdd', member => {
	console.log('hello');
	member.guild.fetchInvites().then(guildInvites => {
		const existingInvites = invites[member.guild.id];
		invites[member.guild.id] = guildInvites;
		const invite = guildInvites.find(i => existingInvites.get(i.code).uses < i.uses);
		let roleName;
		if(invite.code === '6qer9cnmUn') {
			roleName = 'Graphiste';
		}
		else if(invite.code === 'C7sQ8apBXK') {
			roleName = 'Programmeur';
		}
		const role = member.guild.roles.cache.find(r => r.name === roleName);
		member.roles.add(role);
	});
});

client.on('message', async message => {
	if (message.content.toLowerCase().search('je suis (une? .{0,28})') != -1) {
		// message.member.setNickname(message.content.substr(0, 32));
		message.member.setNickname(message.content.match(/je suis (une? .{0,28})/i)[1]);
		return;
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return await message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return await message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return await message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		await message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
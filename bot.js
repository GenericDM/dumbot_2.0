const fs = require("fs");
const Discord = require("discord.js");
var bot = new Discord.Client();
const auth = require("./auth.json");
//based off of copper's bot although it's pretty much its own thing
//comment for webhook test
bot.login(auth.token);
var prefix = auth.prefix
bot.on("ready", function () {
	console.log(`Bot Ready, currently with ${bot.users.size} users in ${bot.guilds.size} guilds.`);
	bot.user.setActivity('prefix is: ' + (prefix));
	bot.user.setStatus('dnd');
});

const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
bot.points = new Enmap({
	provider: new EnmapLevel({
		name: "points"
	})
});
bot.server = new Enmap({
	provider: new EnmapLevel({
		name: "serverSettings"
	})
});

function convertToHex(str) {
	var hex = '';
	for (var i = 0; i < str.length; i++) {
		hex += '' + str.charCodeAt(i).toString(16);
	}
	return hex;
}

function convertFromHex(hex) {
	var hex = hex.toString();
	var str = '';
	for (var i = 0; i < hex.length; i += 2)
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
}

bot.on("error", (err) => {
	console.log(err.error)
});

//bot.on("guildCreate", (server) => {
//	console.log(`Bot has joined ${server.guild.name}`);
//});

//bot.on("guildDelete", (server) => {
//	console.log(`Bot has left ${server.guild.name}`);
//});

bot.on("message", function (message) {

	if (message.channel.type !== "text") return;
	if (message.author == bot.user) return;
	if (message.author.bot == true) return;

	const serverSettings = bot.server.get(`${message.guild.id}`) || {
		welcomeMessageToggle: 1,
		leaveMessageToggle: 1,
	};

	const score = bot.points.get(`${message.author.id}_${message.guild.id}`) || {
		userID: message.author.id,
		guildID: message.guild.id,
		points: 0,
		level: 0
	};

	score.lastSeen = new Date();
	score.points++;
	const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
	if (score.level < curLevel) {
		message.reply(`haha ur now gay level **${curLevel}** in **${message.guild.name}**, good luck with that.`);
		score.level = curLevel;
	}

	bot.points.set(`${message.author.id}_${message.guild.id}`, score);

	if (!message.content.startsWith(auth.prefix)) return;
	if (message.content.startsWith("...")) return;
	var args = message.content.substring((auth.prefix).length).trim().split(/ +/g);

	switch (args.shift().toLowerCase()) {
		case 'togglejoinmessage':
			if (serverSettings.welcomeMessageToggle = 0) {
				serverSettings.welcomeMessageToggle = 1;
				message.channel.send(`turned on join messages`)
			} else {
				serverSettings.welcomeMessageToggle = 0;
				message.channel.send(`turned off join messages`)
			}
			break;
		case 'toggleleavemessage':
			if (serverSettings.leaveMessageToggle = 0) {
				serverSettings.leaveMessageToggle = 1;
				message.channel.send(`turned on leave messages`)
			} else {
				serverSettings.leaveMessageToggle = 0;
				message.channel.send(`turned off leave messages`)
			}
			break;
		case `points`:
			message.channel.send(`You have ${score.points} points, and ${score.level} gay levels`);
			break;
		case 'kickme':
			message.channel.send(`lmao`)
			message.member.kick(`you played yourself`)
			break;
		case 'about':
			var embed = new Discord.RichEmbed()
				.addField(`Made by`, `<@205840324407459840> and <@344960470140321794>`)
				.setColor('RANDOM')
			message.channel.send(embed)
			break;
		case 'bean':
			var embed = message.content.slice(auth.prefix.length).trim().split(/ +/g).slice(1).join(" ");
			if (!embed.includes("<") || embed.length === 0) {
				message.channel.send('lol u need to mention sum1')
				return;
			}
			if (embed.length > 0) {
				var embed2 = new Discord.RichEmbed()
					.setImage('https://cdn.discordapp.com/emojis/373649328222502912.png?v=1')
					.addField(`BEANED`, embed + ` just got beaned!`)
				message.channel.send(embed2)
				console.log(text2 + ` got beaned!`)
			}

			break;
		case 'changeprefix':
			if (message.author.id !== auth.owner_id) return;
			let newPrefix = message.content.split(" ").slice(1, 2)[0];
			auth.prefix = newPrefix;
			var prefix = newPrefix;
			console.log("new prefix, " + prefix)
			bot.user.setActivity('prefix is: ' + (prefix));
			fs.writeFile("./auth.json", JSON.stringify(auth), (err) => console.error);
			break;
		case 'number':
			var randomNumber = Math.floor(Math.random() * 99999999999999999) + 1;
			message.channel.send('wowee that sure is randem xd: ' + randomNumber)
			break;
		case 'tohex':
			let hexstring = message.content.slice((auth.prefix).length).trim().split(/ +/g).slice(1).join(" ");
			message.channel.send(convertToHex(hexstring))
			break;
		case 'fromhex':
			let textstring = message.content.slice((auth.prefix).length).trim().split(/ +/g).slice(1).join(" ");
			message.channel.send(convertFromHex(textstring))
			break;
		case 'lmao':
			var embed = new Discord.RichEmbed()
				.setImage('https://cdn.discordapp.com/emojis/356556240609869824.png?v=1')
			message.channel.send(embed)
			break;
		case 'one':
			var embed = new Discord.RichEmbed()
				.setImage('https://cdn.discordapp.com/emojis/393886629980405781.gif?v=1')
				.setColor('RANDOM')
			message.channel.send(embed)
			break;
		case 'crap':
			var embed = new Discord.RichEmbed()
				.setImage('https://www.youtube.com/watch?v=rouKUSoYjVw')
				.setColor('RANDOM')
			message.channel.send(embed)
			break;
		case 'help':
			message.channel.send("Commands sent to you in your DMs")
			message.author.send('-points -says how many points u have \n-kickme -kicks you \n-about -tell u stuff \n- help - take a guess \n- vote - makes ur message into a vote \n- xd - xd \n- yeah - yeah \n-everyone - @s everyone \n- say - Says whatever you say. \n- number - makes a random numbr \n- idiot - fuckin dumbass \n- one - 1 gif \n-tohex -converts your input into hex \n- fromhex -converts your input from hex \n-bean -beans whoever u mention')
			break;
		case 'vote':
			message.react('👍')
			message.react('👎')
			break;
		case 'pin':
			if (message.pinned == 1 || message.pinnable == 0) return;
			message.pin()
			message.channel.send('You got pinned!')
			message.react('📌')
			break;
		case "everyone":
			message.channel.send(' ' + message.author)
			message.channel.send('lmao rekt')
			break;
		case "emittest":
			if (message.author.id != auth.owner_id) return;
			let event = message.content.slice(auth.prefix.length).trim().split(/ +/g).slice(1).join(" ");
			bot.emit(toString(event), message.guild);
			console.log(`Emitted ` + event)
			break;
		case "xd":
			var embed2 = new Discord.RichEmbed()
				.setImage('https://cdn.discordapp.com/emojis/356929910566027274.png?v=1')
				.setColor('RANDOM')
			message.channel.send(embed2)
			break;
		case "say":
			let text = message.content.slice((auth.prefix).length).trim().split(/ +/g).slice(1).join(" ");
			message.channel.send(text, {
				tts: false
			});
			console.log(text);
			break;
		case 'testy':
			if (message.author.id != auth.owner_id) return;
			bot.emit("guildMemberAdd", message.member);
			break;
		case 'pants':
			message.channel.send('👖👖👖👖👖👖👖\n👖👖👖👖👖👖👖\n👖👖👖👖👖👖👖\n👖👖👖👖👖👖👖\n👖👖👖👖👖👖👖\n👖👖👖👖👖👖👖\n👖👖👖👖👖👖👖')
			break;
		default:
			if (message.author.equals(bot.user)) return;
			message.channel.send("I don't recognise this command, try something else!")
			message.react('🇪')
	}
});
bot.on("message", (message) => {
	if (message.content === bot.user.id) {
		var help = (prefix + 'help')
		message.channel.send('Type ' + help + ' to see a list of commands')
	}
});
bot.on("message", function (message) {
	if (message.includes === '@everyone') {
		message.channel.send('Pinged lmao')
	}
});
//bot.on("guildMemberAdd", (member) => {
//	if (serverSettings.welcomeMessageToggle == 0) return;
//	console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
//	member.guild.channels.find('name', 'general').send(`Welcome to ${member.guild.name}, ${member.user} enjoy your (hopefully long) stay.`);
//});
//bot.on("guildMemberRemove", (member) => {
//	const serverSettings = bot.server.get(`${member.guild.id}`) || {
//		welcomeMessageToggle: 1,
//		leaveMessageToggle: 1,
//	};
//	if (serverSettings.leaveMessageToggle == 0) return;
//	console.log(`User "${member.user.username}" has left ${member.guild.name}`);
//	member.guild.channels.find('name', 'general').send(`"${member.user}" left, sucks to be them.`);
//});

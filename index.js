const Discord = require("discord.js");
const fs = require('fs');
const request = require("request");
const root = `./dumps`;
const settings = require("./settings.json");

const client = new Discord.Client();

function download(uri, filename, callback) {
  	request.head(uri, function(err, res, body){
    	request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  	});
};

function dump(client, message) {
	let time = Date.now();
	let guild = client.guilds.find(guild => guild.id === message.channel.guild.id);
	let emojis = guild.emojis.array();

	if(!fs.existsSync(root)) fs.mkdirSync(root);
	console.log("[!] Creating dump directory. . .");
	fs.mkdirSync(`./dumps/${guild.name}_dump_${time}`);
	console.log(`[+] Downloading ${emojis.length} emojis. . .`)

	for(i = 0; i < emojis.length; i++) {
		let name = emojis[i].identifier.split(":")[0];
		let ext = emojis[i].animated ? "gif" : "png";

		download(emojis[i].url, `${`./dumps/${guild.name}_dump_${time}`}/${name}.${ext}`, () => {
			console.log(`[+] Downloaded emoji ${name} (saved as .${ext})!`);
		});
	}
}

client.on('ready', () => {
	console.log(`[!] Connected to gateway, logged in as ${client.user.username}!`);
});

client.on("message", (message) => {
	if(message.author.id != client.user.id) return;
	if(message.content != `${settings.client.prefix}dump`) return;

	dump(client, message);
});

client.login(settings.client.token);
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");

const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = process.env.PREFIX;

client.login(process.env.DISCORD_BOT_TOKEN);

let channel;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_NUMBER);
    console.log("Bot is ready");
})
client.on('message', (msg) => {
    // ignore if a bot sends the message
    if (msg.author.bot || !msg.content.startsWith(prefix)) return;

    args = msg.content.slice(prefix.length).trim().split(/ +/);
    // ["hello", "Saif"]
    command = args.shift().toLowerCase();

    if(!client.commands.get(command)) {
        return msg.reply("Invalid command");
    }

    command = client.commands.get(command);

    try {
        command.execute(msg, args);
    } catch(error) {
        console.log(error);
        return msg.channel.send("There was an error executing the command");
    }
    // if (command === "hello"){
    //   return msg.reply(`Hello, ${args[0]}`);
    // }
    // if (command === )
    
})

client.on("githubMessage", (body) => {
    console.log (body);
    const action = body.action; 
    const issueurl = body.issue.html_url;
    if (action == "opened"){
        const message = `New issue created : ${issueUrl}`;
    }
})

app.post("/github", (req, res) => {

    console.log(req.body); 
    client.emit("githubMessage", req.body);
    return res.status (200).json({ success: true });
})

const port = process.env.PORT || 8000; 
    app.listen (port, () => { 
        console. log("Server started on port :", port);
    })
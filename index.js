// basic shit
const { token, guildId, clientId, sheet_id, gg_credentials } = require('./config.json');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    // Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
] });
client.login(token);
console.log("Login successful");

const sheetdb = require("sheetdb-node")
const sheet = sheetdb({ address: '90s3csi5c9r61' });
const axios = require('axios');

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("rtm.send") && message.channelId == "750350048730153081") {
        let args = message.content.split(/\s+/);
        args.shift();
        console.log(args)
        if (args[0] == "<@965473856628342814>") {
            // message.reply("good")
            const filter = (reaction, user) => user.id === '916225084698550314';
            const collector = message.createReactionCollector({ filter, time: 5_000 });
            collector.on('collect', r => {
                // console.log(`Collected ${r.emoji.name}`)
                if (r.emoji.name == "✅" && args.length >= 2) {
                    sheet.read({ search: { userId: message.author.id } }).then(function(rawData) {
                        // console.log(data);
                        let data = JSON.parse(rawData)
                        if (data.length == 0) {
                            createUser(message.author.id, args[1])
                            message.channel.send("Tạo tài khoản thành công!")
                            naptien(message.author.id)
                            message.channel.send("Nạp thành công " + args[1] + " RTM vào tài khoản")
                        } else {
                            naptien(message.author.id)
                            message.channel.send("Nạp thành công " + args[1] + " RTM vào tài khoản")
                        }
                    }, function(err){
                        console.log(err);
                    });
                } else {
                    message.channel.send("you fking broke haha!")
                }
            });
            // collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        }
    }
    if (message.content.startsWith("bet") && message.channelId == "750350048730153081") {
        let args = message.content.split(/\s+/);
        args.shift();
        sheet.read({ search: { userId: message.author.id } }).then(function(rawData) {
            let data = JSON.parse(rawData)
            if (data.length == 0) {
                message.channel.send("Bạn chưa có tài khoản!")
            } else {
                if (typeof args[0] == "undefined") {
                    message.channel.send("VD: bet tai 69")
                    message.channel.send("bet xiu 96")
                } else if (args[0] == "tai" || args[0] == "xiu") {
                    rollDice()
                } 
            }
        }, function(err){
            console.log(err);
        });
    }
    if (message.content == "roll") {
        rollDice()
    }
});

function naptien(userID) {
    sheet.read({ search: { userId: userID } }).then(function(rawData) {
        let data = JSON.parse(rawData)
        
    }, function(err){
        console.log(err);
    });
}

function createUser(userID, preBal) {
    sheet.endpoint('count').then(function(rawCount) {
        count = JSON.parse(rawCount)
        sheet.create({ id: count.rows+1, userId: userID, balance: preBal, withdrawal:0, actualBalance: `=C${count.rows+2}-D${count.rows+2}`}).then(function(data) {
            console.log(data);
        }, function(err){
            console.log(err);
        });
    }, function(error){
        console.log(error);
    });
}

function placeBet(choice, money, userId) {
    
}

function rollDice() {
    axios.get('https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new')
        .then(function (response) {
    // handle success
    console.log(typeof response.data);
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .then(function () {
    // always executed
    });
}
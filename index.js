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

const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

const sheetdb = require("sheetdb-node")
const sessionDb = require("sheetdb-node")
const sheet = sheetdb({ address: '90s3csi5c9r61' });
const session = sessionDb({ address: 'ihbzrsj20kcuh' })
const axios = require('axios');

const userInteraction = require('./functions/userInteraction.js');
const { rollDice, createSession } = require("./functions/rollSession.js");

let dice = []

const unixTime = Math.floor(Date.now() / 1000);

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
                            userInteraction.createUser(message.author.id, args[1])
                            message.channel.send("Tạo tài khoản thành công!")
                            // naptien(message.author.id)
                            message.channel.send("Nạp thành công " + args[1] + " RTM vào tài khoản")
                        } else {
                            userInteraction.naptien(message.author.id, args[1])
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
                    message.channel.send(blockQuote("bet <lựa chọn> <số lượng> \nVD: bet tai 69\n        bet xiu 96"))
                }
            } 
        })
    }
    if (message.content.includes("tx.bal")) {
        sheet.read({ search: { userId: message.author.id } }).then(function(rawData) {
            let processedData = JSON.parse(rawData)
            const parsedBal = parseInt(processedData[0].actualBalance)
            message.channel.send("Số dư của bạn là: " + parsedBal + " RTM")
        })
    }
});
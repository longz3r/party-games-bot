// basic shit
const config = require('./config.json');
const { Client, Intents, BaseGuildEmojiManager } = require('discord.js');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    // Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
] });
client.login(config.token);

const redisDB = require('redis');
const redis = redisDB.createClient({
    url: config.redisURL
});

client.on('ready', async () => {
    console.log("Ready!");
    await redis.connect()
})

const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');


redis.on('error', (err) => console.log('Redis Client Error', err));

const userInteraction = require('./functions/userInteraction.js');
const vi = require('./languages/vietnamese.js');
const en = require('./languages/english.js');
const { rollDice, calculateResult } = require("./functions/rollSession.js");

const unixTime = Math.floor(Date.now() / 1000);

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("rtm.send")) {
            var userLanguage = await userInteraction.getLanguage(message.author.id);
            let args = message.content.split(/\s+/);
            args.shift();
            //args processing
            var processedArgs = []
            if (args[0] == "<@965473856628342814>") {
                processedArgs[0] = "<@965473856628342814>"
                processedArgs[1] = args[1]
            } else if (args[1] == "<@965473856628342814>") {
                processedArgs[0] = "<@965473856628342814>"
                processedArgs[1] = args[0]
            }

            if (processedArgs[0] == "<@965473856628342814>") {
                let rtmBalance = await userInteraction.getBalance(message.author.id);
                const filter = (reaction, user) => user.id === '916225084698550314';
                const collector = message.createReactionCollector({ filter, time: 5_000 });
                collector.on('collect', reaction => {
                    if (reaction.emoji.name == "✅" && args.length >= 2) {
                        if (rtmBalance == null) {
                            userInteraction.createUser(message.author.id, processedArgs[1])
                            if (userLanguage == "vi") {
                                message.channel.send(vi.createUser(processedArgs[1]))
                            } else {
                                message.channel.send(en.createUser(processedArgs[1]))
                            }
                        } else {
                            userInteraction.naptien(message.author.id, processedArgs[1])
                            if (userLanguage == "vi") {
                                let newBalance = parseInt(rtmBalance) + parseInt(processedArgs[1])
                                message.channel.send(vi.napTien(processedArgs[1], newBalance))
                            } else {
                                let newBalance = parseInt(rtmBalance) + parseInt(processedArgs[1])
                                message.channel.send(en.napTien(processedArgs[1], newBalance))
                            }
                        }
                    }
                });
            }
    }
    if (message.content.includes("pg.bal")) {
        let userLanguage = await userInteraction.getLanguage(message.author.id);
        if (await userInteraction.getBalance(message.author.id) == null) {
                message.channel.send(`Account not found\nYou can create account by using: ${bold("rtm.send <@965473856628342814> <amount>")}`)
        } else {
            if (userLanguage == "vi") {
                message.reply(vi.balance(await userInteraction.getBalance(message.author.id)))
            } else {
                message.reply(en.balance(await userInteraction.getBalance(message.author.id)))
            }
        }
    }
    if (message.content.startsWith("pg.set")) {
        let args = message.content.split(/\s+/);
        args.shift();
        switch (args[0]) {
            case "language":
                if (args[1] == "vi") {
                    userInteraction.setLanguage(message.author.id, "vi")
                    message.reply("Ngôn ngữ đã được thay đổi thành tiếng Việt")
                } else if (args[1] == "en") {
                    userInteraction.setLanguage(message.author.id, "en")
                    message.reply("Language has been changed to English")
                }
                break;
        }
    }
    if (message.content.startsWith("pg.bet")) {
        var userLanguage = await userInteraction.getLanguage(message.author.id);
        let args = message.content.split(/\s+/);
        args.shift();
        //args processing
        var processedBetArgs = []
        if (args[0] == "tai" || args[0] == "xiu") {
            processedBetArgs[0] = args[0]
            processedBetArgs[1] = args[1]
        } else if (args[1] == "tai" || args[1] == "xiu") {
            processedBetArgs[0] = args[1]
            processedBetArgs[1] = args[0]
        }
        console.log(processedBetArgs[1])
        if (isNaN(processedBetArgs[1])) {
            message.channel.send("dit con me may nhap du so tien vao")
        } else {
        if (processedBetArgs[1] > parseInt(await userInteraction.getBalance(message.author.id))) {
            if (userLanguage == "vi") {
                message.channel.send(vi.balanceNotEnough(await userInteraction.getBalance(message.author.id)))
            } else if (userLanguage == "en") {
                message.channel.send(en.balanceNotEnough(await userInteraction.getBalance(message.author.id)))
            }
            } else {
                let dice = []

                message.channel.send(`${bold(`Round ${await redis.GET("round")}`)}`)
                redis.INCRBY("round", 1)
                dice[0] = parseInt(Math.floor(Math.random() * 6)) + 1;
                dice[1] = parseInt(Math.floor(Math.random() * 6)) + 1;
                dice[2] = parseInt(Math.floor(Math.random() * 6)) + 1;
                console.log(dice)
                message.channel.send(`🎲1: ${spoiler(dice[0])}\n🎲2: ${spoiler(dice[1])}\n🎲3: ${spoiler(dice[2])}`)
                
                let total = dice[0] + dice[1] + dice[2]
                let result = null
                if (total >= 3 && total <= 10) {
                    result = "xiu"
                } else if (total >= 11 && total <= 18) {
                    result = "tai"
                }

                let balance = parseInt(await userInteraction.getBalance(message.author.id))
                setTimeout(() => {
                    if (result == "tai") {
                        if (userLanguage == "vi") {
                            message.channel.send("🎲Kết quả: " + bold("Tài"))
                        } else if (userLanguage == "en") {
                            message.channel.send("🎲Result: " + bold("Tai"))
                        }
                    } else if (result == "xiu") {
                        if (userLanguage == "vi") {
                            message.channel.send("🎲Kết quả: " + bold("Xỉu"))
                        } else {
                            message.channel.send("🎲Result: " + bold("Xiu"))
                        }
                    }
                    if (processedBetArgs[0] == result) {
                        redis.HINCRBY(message.author.id, "rtmBalance", parseInt(processedBetArgs[1]))
                        redis.HINCRBY(message.author.id, "totalWinning", parseInt(processedBetArgs[1]))
                        redis.HINCRBY(message.author.id, "exp", 5)
                        if (userLanguage == "vi") {
                            message.reply(vi.betWin(processedBetArgs[1], balance + parseInt(processedBetArgs[1])))
                        } else {
                            message.reply(en.betWin(processedBetArgs[1], balance + parseInt(processedBetArgs[1])))
                        }
                    } else {
                        redis.HINCRBY(message.author.id, "rtmBalance", parseInt(processedBetArgs[1]) * -1)
                        redis.HINCRBY(message.author.id, "totalWinning", parseInt(processedBetArgs[1]) * -1)
                        redis.HINCRBY(message.author.id, "exp", 2)
                        if (userLanguage == "vi") {
                            message.reply(vi.betLose(processedBetArgs[1], balance - parseInt(processedBetArgs[1])))
                        } else  {
                            message.reply(en.betLose(processedBetArgs[1], balance - parseInt(processedBetArgs[1])))
                        }
                    }
                }, 5000);
            }
        }
    }
});